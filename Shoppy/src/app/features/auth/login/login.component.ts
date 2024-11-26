import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../models/login-request.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  model: LoginRequest;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.model = {
      email: '',
      password: '',
    };
  }

  onFormSubmit() {
    this.authService.login(this.model).subscribe({
      next: (response) => {
        this.cookieService.set(
          'Authentication',
          `Bearer ${response.token}`,
          undefined,
          '/',
          undefined,
          true,
          'Strict'
        );
        const decodedToken: any = jwtDecode(response.token);
        let roles = decodedToken.roles;
        const userId = decodedToken.userId;
        const address = decodedToken.address;

        this.authService.setUser({
          email: this.model.email,
          roles,
          userId,
          address,
        });

        if (roles === 'Admin') {
          this.router.navigateByUrl('/sale-list-product');
        } else {
          this.router.navigateByUrl('/');
        }
      },
    });
  }
}
