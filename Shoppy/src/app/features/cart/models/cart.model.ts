import { CartItem } from './cart-item.model';

export interface Cart {
  id: string;
  userId: string;
  cartItems: { $values: CartItem[] };
  isActive: boolean;
}
