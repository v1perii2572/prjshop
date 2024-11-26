import { Component } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  user: User = {
    id: '',
    userName: '',
    email: '',
    fullName: '',
    address: '',
    refreshTokens: [],
    orders: [],
    cart: {
      id: '', // Assuming 'cart' has an 'id' property
      userId: '', // Assuming 'userId' is required
      cartItems: { $values: [] }, // Initialize cartItems with $values
      isActive: true // Assuming 'isActive' defaults to true
    },
    feedbacks: []
  };

  constructor(private userService: UserService) { }

  // Method to handle form submission
  addUser(): void {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        console.log('User added successfully!', response);
        // Optionally reset the form
        this.user = {
          id: '',
          userName: '',
          email: '',
          fullName: '',
          address: '',
          refreshTokens: [],
          orders: [],
          cart: {
            id: '',
            userId: '',
            cartItems: { $values: [] }, // Initialize cartItems with $values
            isActive: true
          },
          feedbacks: []
        };
      },
      error: (error) => {
        console.error('Error adding user', error);
      }
    });
  }
}
