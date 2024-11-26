import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../model/Category.model';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-add.component.html',
  styleUrl: './category-add.component.css',
})
export class CategoryAddComponent implements OnInit {
  pageTitle: string = 'Add Category';
  newCategory: Category = {
    id: 0,
    name: '',
    description: '',
    createdDate: new Date().toISOString(),
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.newCategory.name && this.newCategory.description) {
      this.categoryService.createCategory(this.newCategory).subscribe({
        next: (category) => {
          console.log('Category added successfully:', category);
          this.router.navigate(['/sale-category-list']);
        },
        error: (err) => {
          console.error('Error adding category:', err);
        },
      });
    }
  }
}
