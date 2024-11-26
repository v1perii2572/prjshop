import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../model/Product.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../model/Category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
})
export class ProductAddComponent {
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    imageUrl: '',
    categoryId: 0,
    createdDate: new Date(),
    category: undefined,
  };

  categories: Category[] = [];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        if (data.$values) {
          const categoryMap = new Map<string, any>();
          data.$values.forEach((item: any) => {
            if (item.$id && !item.$ref) {
              categoryMap.set(item.$id, item);
            }
          });
          this.categories = data.$values.map((item: any) => {
            return item.$ref ? categoryMap.get(item.$ref) : item;
          });
        } else {
          this.categories = data;
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  addProduct(): void {
    if (!this.product.name || !this.product.price || !this.product.categoryId) {
      alert('Please fill in all required fields!');
      return;
    }

    this.productService.addProduct(this.product).subscribe({
      next: () => {
        alert('Product added successfully!');
        this.router.navigate(['/sale-list-product']);
      },
      error: (error) => {
        console.error('Error adding product:', error);
        alert('Failed to add product. Please try again.');
      },
    });
  }
}
