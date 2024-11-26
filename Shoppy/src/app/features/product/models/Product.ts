import { Category } from "./Category";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: number;
    imageUrl: string;
    createdDate: string;
    updatedDate?: string;
    category: Category;
}