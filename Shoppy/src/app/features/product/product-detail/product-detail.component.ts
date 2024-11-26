import { Category } from './../models/Category';
import { CategoryService } from './../service/category.service';
import { CartItemService } from './../../cart/service/cart-item.service';
import { CartItem } from './../../cart/models/cart-item.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductServiceService } from '../service/product-service.service';
import { Product } from '../models/Product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { CartService } from '../../cart/service/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  id: number | undefined;
  product: Product | null = null;
  quantity: number = 1;
  category: Category | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServiceService,
    private cartItemService: CartItemService,
    private authService: AuthService,
    private cartService: CartService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.loadProductDetails(this.id);
    });
  }

  loadProductDetails(id: number): void {
    this.productService.getProductById(id).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.loadCategory(data.categoryId);
        console.log('Loaded product:', this.product);
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.product = null;
      },
    });
  }

  loadCategory(categoryId: number): void {
    this.categoryService.getCategoryById(categoryId).subscribe({
      next: (data: Category) => {
        this.category = data;
        console.log('Loaded category:', this.category);
      },
      error: (error) => {
        console.error('Error loading category:', error);
        this.category = null;
      },
    });
  }

  increaseQuantity(): void {
    if (this.quantity < (this.product?.stockQuantity || 1)) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.product) {
      console.error('Product not loaded');
      return;
    }

    const user = this.authService.getUser();
    if (!user) {
      console.error('User not logged in');
      return;
    }

    this.cartService.getOrCreateCartByUserId(user.userId).subscribe({
      next: (cart) => {
        console.log('Cart found or created:', cart);

        const cartItems = cart.cartItems?.$values || [];

        const cartItem: CartItem = {
          id: 0,
          cartId: cart.id,
          productId: this.product?.id || 0,
          productName: this.product?.name || '',
          productPrice: this.product?.price || 0,
          quantity: this.quantity,
          imageUrl: this.product?.imageUrl || '',
        };

        if (cartItems.length === 0) {
          this.cartItemService.addCartItem(cartItem).subscribe({
            next: (newCartItem) => {
              console.log('Product added to cart:', newCartItem);
              alert('Product successfully added to the cart!');
            },
            error: (addError) => {
              console.error('Error adding cart item:', addError);
              alert('Failed to add product to cart');
            },
          });
          return;
        }

        this.cartItemService
          .checkCartItemExists(cart.id, this.product?.id || 0)
          .subscribe({
            next: (exists) => {
              console.log('Product exists in cart:', exists);

              if (exists) {
                const existingCartItem = cartItems.find(
                  (item: CartItem) =>
                    item.cartId === cart.id &&
                    item.productId === this.product?.id
                );

                if (existingCartItem) {
                  console.log('Found existing cart item:', existingCartItem);
                  existingCartItem.quantity += this.quantity;
                  this.cartItemService
                    .updateCartItem(existingCartItem.id, existingCartItem)
                    .subscribe({
                      next: (updatedItem) => {
                        console.log('Quantity updated:', updatedItem);
                        alert('Product quantity updated in the cart!');
                      },
                      error: (updateError) => {
                        console.error('Error updating cart item:', updateError);
                        alert('Failed to update cart item quantity');
                      },
                    });
                }
              } else {
                this.cartItemService.addCartItem(cartItem).subscribe({
                  next: (newCartItem) => {
                    console.log('Product added to cart:', newCartItem);
                    alert('Product successfully added to the cart!');
                  },
                  error: (addError) => {
                    console.error('Error adding cart item:', addError);
                    alert('Failed to add product to cart');
                  },
                });
              }
            },
            error: (error) => {
              console.error('Error checking cart item existence:', error);
              alert('Failed to check if product exists in cart');
            },
          });
      },
      error: (error) => {
        console.error('Error getting/creating cart:', error);
        alert('Failed to access shopping cart');
      },
    });
  }
}
