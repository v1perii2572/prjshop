import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  model = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
  };

  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegisterSubmit() {
    if (this.model.password !== this.model.confirmPassword) {
      this.errorMessage = 'Passwords do not match. Please try again.';
      return;
    }

    const { confirmPassword, ...registerData } = this.model;
    const updatedData = { ...registerData, UserName: registerData.name };

    this.authService.register(updatedData).subscribe({
      next: () => {
        this.errorMessage = '';
        this.successMessage = 'Registration successful! You can now log in.';
        setTimeout(() => {
          this.router.navigateByUrl('/login');
        }, 2000);
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage =
          err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }
}
