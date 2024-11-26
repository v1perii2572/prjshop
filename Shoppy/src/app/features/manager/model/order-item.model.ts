import { Product } from './Product.model';

export interface OrderItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  product?: Product;
  productId: number;
}
