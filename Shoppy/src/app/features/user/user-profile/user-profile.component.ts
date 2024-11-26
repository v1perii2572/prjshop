import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../services/user.service';
import { UpdateRequest } from '../models/update-request.model';
import { ChangePassword } from '../models/change-password.model';
import { OrderService } from '../services/order.service';
import { ProductService } from '../services/product.service';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  user: User = {
    id: '',
    email: '',
    fullName: '',
    address: '',
    username: '',
  };
  ordersWithDetails: Order[] = [];

  currentPassword: string = '';
  newPassword: string = '';
  rePassword: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private cookieService: CookieService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.refreshUserData();
    this.loadOrders();
  }

  onLogout() {
    this.userService.logout();
    this.router.navigateByUrl('/');
  }

  changePassword() {
    if (this.newPassword !== this.rePassword) {
      alert('New passwords do not match.');
      return;
    }

    const changePasswordRequest: ChangePassword = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
    };

    this.userService.changePassword(changePasswordRequest).subscribe({
      next: (response) => {
        alert('Password changed successfully');
        this.currentPassword = '';
        this.newPassword = '';
        this.rePassword = '';
      },
      error: (error) => {
        alert(
          'Error changing password: ' +
            (error.error?.message || 'Please try again.')
        );
      },
    });
  }

  updateProfile() {
    console.log('Current User:', this.user);

    const updateRequest: UpdateRequest = {
      id: this.user.id,
      fullName: this.user.fullName,
      email: this.user.email,
      address: this.user.address,
      username: this.user.username,
    };

    console.log('Update Request being sent:', updateRequest);

    this.userService.update(updateRequest).subscribe({
      next: (response: any) => {
        console.log('Profile updated successfully:', response);
        this.refreshUserData();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        if (error.status === 401) {
          alert('Session expired. Please login again.');
          this.router.navigate(['/login']);
        } else {
          alert('Error updating profile. Please try again.');
        }
      },
    });
  }

  private refreshUserData() {
    this.userService.getCurrentUser().subscribe({
      next: (userData: any) => {
        console.log('Received user data:', userData);
        this.user = {
          id: userData.id,
          email: userData.email,
          fullName: userData.fullName,
          address: userData.address,
          username: userData.username,
        };
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
      },
    });
  }

  loadUserInfo(): void {
    const token = this.cookieService.get('Authentication');
    if (token) {
      this.updateUserFromToken(token);
    }
  }

  private updateUserFromToken(token: string): void {
    const decodedToken: any = jwtDecode(token.replace('Bearer ', ''));

    this.user.fullName = decodedToken.fullname;
    this.user.email = decodedToken.email;
    this.user.address = decodedToken.address;
    this.user.id = decodedToken.userId;
    this.user.username = decodedToken.username;
  }

  getOrderItems(order: Order): OrderItem[] {
    return order.orderItems || [];
  }

  loadOrders(): void {
    const token = this.cookieService.get('Authentication');
    if (!token) {
      console.error('User not authenticated.');
      return;
    }

    const decodedToken: any = jwtDecode(token.replace('Bearer ', ''));
    const userId = decodedToken.userId;

    if (!userId) {
      console.error('User ID not found in token.');
      return;
    }

    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (response: any) => {
        console.log('API Response for user orders:', response);

        const orders = response.$values || [];

        this.ordersWithDetails = orders.map((order: any) => {
          const orderItems = order.orderItems.$values.map((item: any) => ({
            id: item.id,
            orderId: item.orderId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice || 0,
            product: null,
          }));

          return {
            id: order.id,
            orderDate: order.orderDate,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
            customerName: this.user.fullName,
            orderItems: orderItems,
          };
        });

        // Fetch product details for each order item
        this.ordersWithDetails.forEach((order) => {
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
            }
          });
        });

        console.log('Loaded orders for user:', this.ordersWithDetails);
      },
      error: (error) => {
        console.error('Error loading user orders:', error);
      },
    });
  }
}
