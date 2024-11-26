import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/Product';
import { ProductServiceService } from '../service/product-service.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NgxPaginationModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 8;

  categories = [
    { id: 1, name: 'Furniture', description: 'Home decor furniture' },
    { id: 2, name: 'Ceramics', description: 'Decorative ceramics and pottery' },
    { id: 3, name: 'Lighting', description: 'Decorative lights and lamps' },
    {
      id: 4,
      name: 'Wall Art',
      description: 'Paintings, posters, and decorative wall art',
    },
    { id: 5, name: 'Textiles', description: 'Rugs, cushions, and curtains' },
  ];

  selectedCategories: { [key: number]: boolean } = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  };

  constructor(private productService: ProductServiceService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: any) => {
        console.log('Data from API:', data);

        if (data.$values) {
          const productMap = new Map<string, any>();
          data.$values.forEach((item: any) => {
            if (item.$id && !item.$ref) {
              productMap.set(item.$id, item);
            }
            if (item.category?.products?.$values) {
              item.category.products.$values.forEach((subItem: any) => {
                if (subItem.$id && !subItem.$ref) {
                  productMap.set(subItem.$id, subItem);
                }
              });
            }
          });
          this.products = data.$values
            .map((item: any) => {
              if (item.$ref) {
                return productMap.get(item.$ref);
              }
              return item;
            })
            .filter(
              (item: any) =>
                item && item.id && item.name && item.price && item.category
            );
        } else {
          this.products = data;
        }

        console.log('Loaded products:', this.products);
        this.filteredProducts = [...this.products];
        console.log('Filtered products after load:', this.filteredProducts);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      },
    });
  }

  toggleCategoryFilter(categoryId: number): void {
    console.log('Toggling filter for category:', categoryId);
    this.selectedCategories[categoryId] = !this.selectedCategories[categoryId];
    this.applyFilters();
  }

  applyFilters(): void {
    console.log('Selected categories for filter:', this.selectedCategories);
    const activeCategories = Object.entries(this.selectedCategories)
      .filter(([_, isSelected]) => isSelected)
      .map(([categoryId]) => parseInt(categoryId));

    console.log('Active categories:', activeCategories);

    if (activeCategories.length === 0) {
      this.filteredProducts = [...this.products];
      console.log('No filter applied, showing all products');
    } else {
      this.filteredProducts = this.products.filter((product) => {
        const categoryId = product.category?.id;
        console.log('Checking product categoryId:', categoryId);
        return activeCategories.includes(categoryId);
      });
      console.log('Filtered products:', this.filteredProducts);
    }
  }

  clearFilters(): void {
    console.log('Clearing all filters');
    this.selectedCategories = {
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    };
    this.filteredProducts = [...this.products];
    console.log(
      'Filtered products after clearing filters:',
      this.filteredProducts
    );
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
