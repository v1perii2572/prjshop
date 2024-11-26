import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { UpdateRequest } from '../models/update-request.model';
import { Response } from '../models/response.model';
import { BASE_URL } from '../../../app.config';
import { ChangePassword } from '../models/change-password.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  $user = new BehaviorSubject<User | undefined>(undefined);

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  update(request: UpdateRequest): Observable<Response> {
    const user = this.getUser();
    return this.http.put<Response>(`${BASE_URL}/User/${user?.id}`, request);
  }

  getCurrentUser() {
    return this.http.get<User>(`${BASE_URL}/Auth/me`);
  }

  changePassword(request: ChangePassword): Observable<any> {
    const token = this.cookieService.get('Authentication');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    return this.http.post<any>(`${BASE_URL}/auth/change-password`, request, {
      headers,
    });
  }

  refreshToken() {
    const currentToken = this.cookieService
      .get('Authentication')
      ?.replace('Bearer ', '');
    return this.http.post<any>(`${BASE_URL}/auth/refresh-token`, {
      token: currentToken,
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
      let address = decodedToken.address;
      let email = decodedToken.email;
      let fullname = decodedToken.fullname;
      let id = decodedToken.userId;
      let username = decodedToken.username;
      const user: User = {
        fullName: fullname,
        email: email,
        id: id,
        address: address,
        username: username,
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
