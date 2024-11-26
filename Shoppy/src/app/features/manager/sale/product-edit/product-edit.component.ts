import { Category } from './../../../product/models/Category';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../model/Product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit {
  productId!: number;
  product: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    stockQuantity: 0,
    categoryId: 0,
    imageUrl: '',
    createdDate: new Date(),
    category: null,
  };
  isLoading: boolean = false;
  categories: Category[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProduct();
    this.loadCategories();
  }

  loadProduct(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (data: Product) => {
        this.product = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      },
    });
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

  saveProduct(): void {
    this.isLoading = true;
    this.productService.updateProduct(this.product).subscribe({
      next: () => {
        alert('Product updated successfully!');
        this.router.navigate(['/sale-list-product']);
      },
      error: (error) => {
        console.error('Error updating product:', error);
        this.isLoading = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/sale-list-product']);
  }
}
