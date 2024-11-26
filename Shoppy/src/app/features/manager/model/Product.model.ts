import { Category } from './Category.model';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  imageUrl: string;
  createdDate: Date;
  updatedDate?: string;
  category?: Category | null;
}
