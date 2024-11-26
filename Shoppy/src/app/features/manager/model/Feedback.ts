import { Order } from './order.model';
import { Product } from './Product.model';
import { User } from './user';

export interface Feedback {
  id: number;
  productId: number;
  userId: string;
  orderId?: number;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdDate: Date;

  product?: Product;
  user?: User;
  order?: Order;
}
