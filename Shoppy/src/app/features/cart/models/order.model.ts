import { OrderItem } from './order-item.model';

export interface Order {
  id?: number;
  userId: string;
  totalAmount: number;
  orderDate: string;
  status: string;
  orderItems: OrderItem[];
  shippingAddress: string;
}
