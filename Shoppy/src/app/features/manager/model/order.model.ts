import { OrderItem } from './order-item.model';

export interface Order {
  id: number;
  orderId: number;
  orderItems: OrderItem[];
  totalPrice: number;
  status: string;
  customerName?: string;
  userId: string;
}
