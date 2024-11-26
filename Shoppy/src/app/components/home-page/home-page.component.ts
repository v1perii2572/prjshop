import { Component, OnInit } from '@angular/core';
import { Product } from '../../features/product/models/Product';
import { ProductServiceService } from './../../features/product/service/product-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 8;

  selectedCategories: { [key: string]: boolean } = {
    mobile: false,
    bags: false,
    sweatshirt: false,
    boots: false,
  };

  constructor(private productService: ProductServiceService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        if (data.$values) {
          const productMap = new Map<string, any>();
          data.$values.forEach((item: any) => {
            if (item.$id && !item.$ref) {
              productMap.set(item.$id, item);

              if (item.category?.products?.$values) {
                item.category.products.$values.forEach((subItem: any) => {
                  if (subItem.$id && !subItem.$ref) {
                    productMap.set(subItem.$id, subItem);
                  }
                });
              }
            }
          });

          this.products = data.$values
            .map((item: any) => {
              if (item.$ref) {
                return productMap.get(item.$ref);
              }
              return item;
            })
            .filter((item: any) => {
              return item && item.id && item.name && item.price;
            });
        } else {
          this.products = data;
        }

        this.filteredProducts = [...this.products];
        console.log('Loaded products:', this.products);
      },
      error: (error) => {
        console.error('Lỗi khi tải sản phẩm:', error);
      },
    });
  }

  toggleCategoryFilter(category: string): void {
    this.selectedCategories[category] = !this.selectedCategories[category];
    this.applyFilters();
  }

  applyFilters(): void {
    const activeCategories = Object.entries(this.selectedCategories)
      .filter(([_, isSelected]) => isSelected)
      .map(([category]) => category);

    if (activeCategories.length === 0) {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter((product) =>
        activeCategories.includes(product.category?.name.toLowerCase())
      );
    }
  }

  getValidImageUrl(url: string): string {
    if (!url) {
      return 'placeholder.jpg';
    }
    if (url.startsWith('http')) {
      return url;
    }
    return `${url}`;
  }
}
