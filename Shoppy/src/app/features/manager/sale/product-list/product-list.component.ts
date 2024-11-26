import { AuthService } from './../../../auth/services/auth.service';
import { CategoryService } from '../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/Product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Category } from '../../model/Category.model';
import { Order } from '../../model/order.model';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';
import { OrderItem } from '../../model/order-item.model';
import { User } from '../../model/user';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule, NgxPaginationModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class SaleProductListComponent implements OnInit {
  userId: string = '';
  orders: Order[] = [];
  currentPage: string = 'product';
  pageTitle: string = 'Manage Products';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory: Category | null = null;
  userNames: { [key: string]: string } = {};
  newCategory: Category = {
    id: 0,
    name: '',
    description: '',
    createdDate: new Date().toISOString(),
  };
  ordersWithDetails: Order[] = [];

  users: User[] = [];
  selectedUser: User | null = null;
  newUser: User = {
    id: '',
    userName: '',
    email: '',
    fullName: '',
    address: '',
    refreshTokens: [],
    orders: [],
    cart: {} as any,
    feedbacks: [],
  };
  isEditing: boolean = false;

  productPage: number = 1;
  categoryPage: number = 1;
  orderPage: number = 1;
  userPage: number = 1;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.loadOrders();
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.users.forEach((user) => {
          this.userNames[user.id] = user.userName;
        });
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }

  selectUser(user: User): void {
    this.selectedUser = { ...user };
    this.isEditing = true;
  }

  createUser(): void {
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.loadUsers();
        this.resetForm();
      },
      error: (error) => {
        console.error('Error creating user:', error);
      },
    });
  }

  updateUser(): void {
    if (this.selectedUser) {
      this.userService.updateUser(this.selectedUser).subscribe({
        next: () => {
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating user:', error);
        },
      });
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
    }
  }

  resetForm(): void {
    this.selectedUser = null;
    this.isEditing = false;
    this.newUser = {
      id: '',
      userName: '',
      email: '',
      fullName: '',
      address: '',
      refreshTokens: [],
      orders: [],
      cart: {} as any,
      feedbacks: [],
    };
  }

  togglePage(page: string): void {
    this.currentPage = page;
    if (page === 'product') {
      this.pageTitle = 'Manage Products';
    } else if (page === 'category') {
      this.pageTitle = 'Manage Categories';
    } else if (page === 'order') {
      this.pageTitle = 'Manage Orders';
    }
  }

  private getUserName(userId: string): void {
    if (!this.userNames[userId]) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userNames[userId] = user.name;
          this.orders = [...this.orders];
        },
        error: (error) => {
          console.error(`Error fetching user ${userId}:`, error);
          this.userNames[userId] = 'Unknown User';
        },
      });
    }
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        if (data.$values) {
          const productMap = new Map<string, any>();
          data.$values.forEach((item: any) => {
            if (item.$id && !item.$ref) {
              productMap.set(item.$id, item);

              if (item.category?.$id) {
                productMap.set(item.category.$id, item.category);
              }

              if (item.category?.products?.$values) {
                item.category.products.$values.forEach((subItem: any) => {
                  if (subItem.$id && !subItem.$ref) {
                    productMap.set(subItem.$id, subItem);
                  }
                });
              }
            }
          });
          this.products = data.$values
            .map((item: any) => {
              let product = item.$ref ? productMap.get(item.$ref) : item;
              if (product.category?.$ref) {
                product = {
                  ...product,
                  category: productMap.get(product.category.$ref),
                };
              }

              return product;
            })
            .filter((item: any) => {
              return item && item.id && item.name && item.price;
            });
        } else {
          this.products = data;
        }

        this.filteredProducts = [...this.products];
        console.log('Loaded products:', this.products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
        console.log('Loaded categories:', categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        },
      });
    }
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter((cat) => cat.id !== id);
          console.log('Category deleted');
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          alert('Failed to delete category.');
        },
      });
    }
  }

  loadOrders(): void {
    this.orderService.getOrdersWithDetails().subscribe({
      next: (response: any) => {
        console.log('API Response:', response);
        const orders = this.transformOrders(response);
        orders.forEach((order) => {
          this.userService.getUserById(order.userId).subscribe({
            next: (user: any) => {
              order.customerName = user.name;
            },
            error: (error) => {
              console.error('Error loading user:', error);
              order.customerName = 'Unknown';
            },
          });

          order.orderItems.forEach((item) => {
            if (item.productId) {
              this.productService.getProductById(item.productId).subscribe({
                next: (product: any) => {
                  item.product = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    description: product.description,
                    stockQuantity: product.stockQuantity,
                    categoryId: product.categoryId,
                    imageUrl: product.imageUrl,
                    createdDate: product.createdDate,
                  };
                  order.totalPrice = this.calculateTotalAmount(order);
                },
                error: (error) => {
                  console.error('Error loading product:', error);
                  item.product = {
                    id: 0,
                    name: 'Unknown Product',
                    price: 0,
                    description: '',
                    stockQuantity: 0,
                    categoryId: 0,
                    imageUrl: '',
                    createdDate: new Date(),
                  };
                },
              });
            } else {
              console.error('Product ID is undefined for order item:', item);
            }
          });
        });

        this.ordersWithDetails = orders;
        console.log('Loaded orders:', this.ordersWithDetails);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      },
    });
  }

  private transformOrders(response: any): Order[] {
    if (response && response.length) {
      return response.map((order: any) => ({
        orderId: order.id,
        userId: order.userId,
        orderDate: order.orderDate,
        shippingAddress: order.shippingAddress,
        orderItems:
          order.orderItems?.$values.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
          })) || [],
        totalPrice: order.totalAmount,
        status: order.status,
      }));
    }
    return [];
  }

  getOrderItems(order: Order): OrderItem[] {
    return order.orderItems || [];
  }

  changeOrderStatus(
    order: Order,
    status: 'complete' | 'pending' | 'delivery'
  ): void {
    if (status && order.status !== status) {
      order.status = status;
      this.updateOrderStatus(order);
    }
  }

  updateOrderStatus(order: Order): void {
    if (order.orderId === undefined) {
      console.error('Order ID is undefined');
      return;
    }

    const validStatuses = ['pending', 'delivery', 'complete'];
    if (!validStatuses.includes(order.status)) {
      alert('Invalid order status');
      return;
    }

    order.totalPrice = this.calculateTotalAmount(order);

    this.orderService.updateOrder(order.orderId, order).subscribe({
      next: (updatedOrder: Order) => {
        console.log('Order status updated:', updatedOrder);
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      },
    });
  }

  private calculateTotalAmount(order: Order): number {
    return order.orderItems.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0
    );
  }
}
