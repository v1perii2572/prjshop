import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';  // Import ActivatedRoute
import { UserService } from '../../services/user.service';
import { User } from '../../model/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User = {
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
      cartItems: { $values: [] },
      isActive: true
    },
    feedbacks: []
  };
  isLoading: boolean = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,   // Inject ActivatedRoute
    private router: Router           // Inject Router (for navigation on success)
  ) { }

  ngOnInit(): void {
    // Get the user ID from the route parameters
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserData(userId);
    } else {
      console.error('User ID is missing!');
    }
  }

  loadUserData(userId: string): void {
    this.isLoading = true;  // Start loading spinner
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.user = user;  // Populate the form with user data
        this.isLoading = false;  // Stop loading spinner
      },
      error: (error) => {
        console.error('Error loading user data', error);
        this.isLoading = false;  // Stop loading spinner
      }
    });
  }

  saveUser(): void {
    this.isLoading = true;  // Start loading spinner for saving user
    this.userService.updateUser(this.user).subscribe({
      next: (response) => {
        console.log('User updated successfully!', response);
        this.isLoading = false;  // Stop loading spinner
        this.router.navigate(['/users']);  // Navigate back to the user list or another page
      },
      error: (error) => {
        console.error('Error updating user', error);
        this.isLoading = false;  // Stop loading spinner
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/sale-list-product']);  // Navigate back to the user list or another page
  }
}
