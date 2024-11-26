import { OrderItemService } from './../service/order-item.service';
import { Component, OnInit } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../service/cart.service';
import { CartItemService } from '../service/cart-item.service';
import { ProductServiceService } from '../../product/service/product-service.service';
import { AuthService } from '../../auth/services/auth.service';
import { OrderService } from '../service/order.service';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { Product } from '../../product/models/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MomoService } from '../../../payment/service/momo.service';
import { OrderInfoModel } from '../../../payment/models/OrderInfoModel';
import { forkJoin, switchMap } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any;
  cartItems: CartItem[] = [];
  userId: string = '';

  constructor(
    private cartService: CartService,
    private cartItemService: CartItemService,
    private productService: ProductServiceService,
    private authService: AuthService,
    private orderService: OrderService,
    private orderItemService: OrderItemService,
    private router: Router,
    private momoService: MomoService,
  ) { }

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.userId = user.userId;
      this.loadCartItems(user.userId);
    } else {
      console.error('User not logged in or userId missing');
    }
  }

  private loadCartItems(userId: string): void {
    this.cartService.getCartByUserId(userId).subscribe(
      (response) => {
        if (response && response.cartItems && response.cartItems.$values) {
          this.cartItems = response.cartItems.$values.map((item: any) => ({
            id: item.id,
            cartId: item.cartId,
            productId: item.productId,
            quantity: item.quantity,
            imageUrl: '',
            productName: '',
            productPrice: 0,
          }));

          this.cartItems.forEach((cartItem) => {
            this.productService.getProductById(cartItem.productId).subscribe(
              (product: Product) => {
                cartItem.imageUrl = product.imageUrl;
                cartItem.productName = product.name;
                cartItem.productPrice = product.price;
              },
              (error) =>
                console.error(
                  `Error fetching product ${cartItem.productId}:`,
                  error
                )
            );
          });
        } else {
          this.cartItems = [];
        }
      },
      (error) => {
        console.error('Error loading cart items:', error);
      }
    );
  }

  private calculateTotalAmount(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  }

  private clearCart(): void {
    if (!this.userId) {
      console.error('User is not logged in. Cannot clear cart.');
      return;
    }
    this.cartItems = [];
    this.cartService.clearCart(this.userId).subscribe(
      () => console.log('Cart cleared successfully'),
      (error) => console.error('Failed to clear cart:', error)
    );
  }
  placeMomo(): void {
    console.log("Bắt đầu quy trình thanh toán MoMo");

    // Kiểm tra điều kiện
    if (this.cartItems.length === 0) {
      console.error('Giỏ hàng trống, không thể tạo đơn hàng.');
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      console.error('Vui lòng đăng nhập để thanh toán');
      return;
    }

    const shippingAddress = user.address || '';
    const totalAmount = this.calculateTotalAmount();

    // 1. Tạo đơn hàng
    const order: Order = {
      userId: this.userId,
      totalAmount: totalAmount,
      orderDate: new Date().toUTCString(),
      status: 'approve', // Trạng thái chờ thanh toán
      shippingAddress: shippingAddress,
      orderItems: [],
    };

    // 2. Lưu đơn hàng và xử lý thanh toán
    this.orderService.createOrder(order).pipe(
      switchMap(createdOrder => {
        if (!createdOrder.id) {
          throw new Error('Order ID is missing from the created order');
        }

        // Tạo các order items
        const orderItemObservables = this.cartItems.map(cartItem => {
          const orderItem: OrderItem = {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.productPrice,
            imgurl: cartItem.imageUrl || '',
            orderId: createdOrder.id!
          };
          return this.orderItemService.createOrderItem(orderItem);
        });

        // Tạo thông tin thanh toán MoMo
        const orderInfoModel = {
          fullName: user.address,
          orderId: 'name',
          orderInfo: 'Details',
          amount: totalAmount
        };

        // Combine order items creation với MoMo payment request
        return forkJoin({
          orderItems: forkJoin(orderItemObservables),
          momoPayment: this.momoService.createPaymentUrl(orderInfoModel)
        });
      })
    ).subscribe({
      next: ({ orderItems, momoPayment }) => {
        console.log('Order items created:', orderItems);
        console.log('Momo payment URL received:', momoPayment);

        // Lưu thông tin để kiểm tra sau khi thanh toán
        localStorage.setItem('pendingMomoOrder', JSON.stringify({
          orderItems: orderItems,
          totalAmount: totalAmount,
          timestamp: Date.now()
        }));

        // Cập nhật số lượng sản phẩm
        const quantityUpdates = this.cartItems.map(cartItem =>
          this.productService.updateProductQuantity(cartItem.productId, cartItem.quantity)
        );

        forkJoin(quantityUpdates).subscribe({
          next: (results) => {
            console.log('All product quantities updated');
            this.clearCart();

            // Chuyển đến trang thanh toán MoMo
            if (momoPayment.paymentUrl) {
              window.location.href = momoPayment.paymentUrl;
            } else {
              console.error('Invalid payment URL');
            }
          },
          error: (error) => {
            console.error('Error updating product quantities:', error);
          }
        });
      },
      error: (error) => {
        console.error('Error in payment process:', error);
        if (error.error?.errors) {
          console.error('Validation errors:', error.error.errors);
        }
      }
    });
  }



  placeOrder(): void {
    if (this.cartItems.length === 0) {
      console.error('No items in the cart to place an order.');
      return;
    }

    const orderItems: OrderItem[] = [];
    let orderItemsCreatedCount = 0;

    const user = this.authService.getUser();
    const shippingAddress = user?.address || '';

    const order: Order = {
      userId: this.userId,
      totalAmount: this.calculateTotalAmount(),
      orderDate: new Date().toUTCString(),
      status: 'Pending',
      shippingAddress: shippingAddress,
      orderItems: [],
    };

    this.orderService.createOrder(order).subscribe(
      (createdOrder) => {
        console.log('Order created successfully:', createdOrder);

        if (!createdOrder.id) {
          console.error('Order ID is missing from the created order');
          return;
        }

        this.cartItems.forEach((cartItem, index) => {
          if (!cartItem.imageUrl) {
            console.error(
              `Missing image URL for product ${cartItem.productId}`
            );
            cartItem.imageUrl = '';
          }

          const orderItem: OrderItem = {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.productPrice,
            imgurl: cartItem.imageUrl || '',
            orderId: createdOrder.id !== undefined ? createdOrder.id : 0,
          };

          this.orderItemService.createOrderItem(orderItem).subscribe(
            (createdOrderItem) => {
              console.log('Order item created:', createdOrderItem);
              orderItems.push(createdOrderItem);

              this.productService
                .updateProductQuantity(cartItem.productId, cartItem.quantity)
                .subscribe(
                  (updatedProduct) => {
                    console.log(`Product quantity updated:`, updatedProduct);
                  },
                  (error) => {
                    console.error(
                      `Error updating product quantity for product ${cartItem.productId}:`,
                      error
                    );
                  }
                );

              orderItemsCreatedCount++;

              if (orderItemsCreatedCount === this.cartItems.length) {
                createdOrder.orderItems = orderItems;
                console.log(
                  'All order items added to the order:',
                  createdOrder
                );
                this.clearCart();
              }
            },
            (error) => {
              console.error('Error creating order item:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error creating order:', error);
        if (error.error && error.error.errors) {
          console.error('Validation errors:', error.error.errors);
        }
      }
    );
  }

  deleteCartItem(cartItem: CartItem): void {
    this.cartItemService.deleteCartItem(cartItem).subscribe((result) => {
      if (result) {
        this.cartItems = this.cartItems.filter(
          (item) => item.id !== cartItem.id
        );
      }
    });
  }

  increaseQuantity(item: CartItem): void {
    this.cartItemService.increaseQuantity(item).subscribe(
      (updatedItem) => {
        const index = this.cartItems.findIndex(
          (cartItem) => cartItem.id === updatedItem.id
        );
        if (index !== -1) {
          this.cartItems[index].quantity = updatedItem.quantity;
        }
      },
      (error) => console.error('Error increasing quantity:', error)
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.cartItemService.decreaseQuantity(item).subscribe(
        (updatedItem) => {
          const index = this.cartItems.findIndex(
            (cartItem) => cartItem.id === updatedItem.id
          );
          if (index !== -1) {
            this.cartItems[index].quantity = updatedItem.quantity;
          }
        },
        (error) => console.error('Error decreasing quantity:', error)
      );
    }
  }
}
