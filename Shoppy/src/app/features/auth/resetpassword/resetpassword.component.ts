import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ResetPasswordRequest } from '../models/resetpassword-request';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css',
})
export class ResetpasswordComponent implements OnInit {
  model: ResetPasswordRequest = {
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  };

  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.model.email = params['email'];
      }
    });
  }

  onResetPasswordSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (
      !this.model.email ||
      !this.model.code ||
      !this.model.newPassword ||
      !this.model.confirmPassword
    ) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (!this.isValidEmail(this.model.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    if (this.model.code.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit code';
      return;
    }

    if (this.model.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    if (this.model.newPassword !== this.model.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;
    this.authService.resetPassword(this.model).subscribe({
      next: (response: string) => {
        this.successMessage = response;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error) => {
        console.error('Reset password error:', error);
        if (error.status === 400) {
          this.errorMessage = error.error || 'Invalid reset attempt';
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
