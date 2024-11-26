import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { of } from 'rxjs';
import { Cart } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartItemService {
  private apiUrl = 'https://localhost:7071/api/CartItem';

  constructor(private http: HttpClient) {}

  getAllCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl);
  }

  getCartItemById(id: number): Observable<CartItem> {
    return this.http.get<CartItem>(`${this.apiUrl}/${id}`);
  }

  updateCartItem(id: number, cartItem: CartItem): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/${id}`, cartItem);
  }

  deleteCartItem(cartItem: CartItem): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${cartItem.id}`);
  }

  increaseQuantity(cartItem: CartItem): Observable<CartItem> {
    cartItem.quantity += 1;
    return this.http.put<CartItem>(`${this.apiUrl}/${cartItem.id}`, cartItem);
  }

  decreaseQuantity(cartItem: CartItem): Observable<CartItem> {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      return this.http.put<CartItem>(`${this.apiUrl}/${cartItem.id}`, cartItem);
    }
    return of(cartItem);
  }

  addCartItem(cartItemPayload: CartItem): Observable<any> {
    return this.http.post<any>(this.apiUrl, cartItemPayload);
  }

  checkCartItemExists(cartId: string, productId: number): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.apiUrl}/exists?cartId=${cartId}&productId=${productId}`
    );
  }
}
