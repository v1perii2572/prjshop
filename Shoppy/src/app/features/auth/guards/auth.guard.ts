import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const authService = inject(AuthService);
  const router = inject(Router);

  let token = cookieService.get('Authentication');
  const user = authService.getUser();

  console.log('Token:', token);
  console.log('User from AuthService:', user);

  if (token && user) {
    token = token.replace('Bearer ', '');
    const decodedToken: any = jwtDecode(token);

    let roles = decodedToken.roles;

    const requiredRoles = route.data['roles'] as Array<string>;

    const expirationDate = decodedToken.exp * 1000;
    const currentTime = new Date().getTime();

    if (expirationDate < currentTime) {
      console.warn('Token expired. Logging out.');
      authService.logout();
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url },
      });
    }

    const hasRequiredRole = requiredRoles.some((role) => roles.includes(role));

    if (hasRequiredRole) {
      console.log('Access granted.');
      return true;
    } else {
      console.warn('Access denied. User does not have required roles.');
      return router.createUrlTree(['/']);
    }
  } else {
    console.warn('No valid token or user. Redirecting to login.');
    authService.logout();
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
};
