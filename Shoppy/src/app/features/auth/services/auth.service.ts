import { routes } from '../../../app.routes';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request.model';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { LoginResponse } from '../models/login-response.model';
import { BASE_URL } from '../../../app.config';
import { User } from '../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { RegisterRequest } from '../models/register-request.model';
import { ForgotPasswordRequest } from '../models/forgotpassword-request';
import { ResetPasswordRequest } from '../models/resetpassword-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE_URL}/Auth/login`, request);
  }

  register(request: RegisterRequest): Observable<Response> {
    return this.http.post<Response>(`${BASE_URL}/Auth/register`, request, {
      responseType: 'text' as 'json',
    });
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<string> {
    return this.http.post(`${BASE_URL}/Auth/forgot-password`, request, {
      responseType: 'text',
    });
  }

  resetPassword(request: ResetPasswordRequest): Observable<string> {
    return this.http.post(`${BASE_URL}/Auth/reset-password`, request, {
      responseType: 'text',
    });
  }

  setUser(user: User): void {
    this.$user.next(user);
    localStorage.setItem('user-email', user.email);
  }

  user(): Observable<User | undefined> {
    return this.$user.asObservable();
  }

  getUser(): User | undefined {
    const token = this.cookieService.get('Authentication');

    if (token) {
      const decodedToken: any = jwtDecode(token.replace('Bearer ', ''));

      let roles = decodedToken.roles;
      const userId = decodedToken.userId;
      const email = decodedToken.email;
      const addres = decodedToken.address;

      const user: User = {
        email: email,
        roles: roles,
        userId: userId,
        address: addres,
      };

      return user;
    }
    return undefined;
  }

  logout(): void {
    localStorage.clear();
    this.cookieService.delete('Authentication', '/');
    this.$user.next(undefined);
  }
}
