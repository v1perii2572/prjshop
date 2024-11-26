import { Cart } from './../models/cart.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'https://localhost:7071/api/Cart';
  private apiUrl1 = 'https://localhost:7071/api/CartItem';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCartByUserId(userId: string): Observable<Cart | null> {
    const user = this.authService.getUser();
    if (user) {
      return this.http.get<Cart>(`${this.apiUrl}/${user.userId}`).pipe(
        catchError((error) => {
          if (error.status === 404) {
            return of(null);
          }
          throw error;
        })
      );
    } else {
      console.error('User not logged in or userId missing');
      return of(null);
    }
  }

  getOrCreateCartByUserId(userId: string): Observable<Cart> {
    return this.getCartByUserId(userId).pipe(
      switchMap((cart) => {
        if (cart) {
          return of(cart);
        } else {
          const Cart: Cart = {
            userId: userId,
            isActive: true,
            id: '',
            cartItems: {
              $values: [],
            },
          };
          return this.addCart(Cart);
        }
      }),
      map((cart) => {
        if (!cart.cartItems) {
          cart.cartItems = { $values: [] };
        }
        if (!cart.cartItems.$values) {
          cart.cartItems.$values = [];
        }
        return cart;
      }),
      catchError((error) => {
        console.error('Error in getOrCreateCartByUserId:', error);
        throw error;
      })
    );
  }

  getCartItemsByCartId(cartId: string): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(`${this.apiUrl1}/${cartId}`);
  }

  addCart(cartVmm: Cart): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, cartVmm);
  }

  updateCart(cartId: string, cart: Cart): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${cartId}`, cart);
  }

  deleteCart(cartId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${cartId}`);
  }

  clearCart(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear/${userId}`);
  }
}
