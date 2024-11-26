import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordRequest } from '../models/forgotpassword-request';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css',
})
export class ForgotpasswordComponent implements OnInit {
  model: ForgotPasswordRequest = {
    email: '',
  };

  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  onForgotPasswordSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';
    this.isLoading = true;

    if (!this.model.email) {
      this.errorMessage = 'Please enter your email address';
      this.isLoading = false;
      return;
    }

    if (!this.isValidEmail(this.model.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.isLoading = false;
      return;
    }

    this.authService.forgotPassword(this.model).subscribe({
      next: (response: string) => {
        this.isLoading = false;
        this.successMessage = response;
        setTimeout(() => {
          this.router.navigate(['/reset-password'], {
            queryParams: { email: this.model.email },
          });
        }, 3000);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Forgot password error:', error);

        if (error.status === 400) {
          this.errorMessage = error.error || 'User not found';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error occurred. Please try again later.';
        } else {
          this.errorMessage = 'An error occurred. Please try again.';
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
