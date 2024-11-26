import { Component } from '@angular/core';
import { CategoryService } from '../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../model/Category.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.css',
})
export class CategoryEditComponent {
  pageTitle: string = 'Edit Category';
  category: Category = {
    id: 0,
    name: '',
    description: '',
    createdDate: new Date().toISOString(),
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const categoryId = Number(this.route.snapshot.paramMap.get('id'));
    if (categoryId) {
      this.loadCategory(categoryId);
    }
  }

  loadCategory(id: number): void {
    this.categoryService.getCategoryById(id).subscribe({
      next: (data) => {
        this.category = data;
      },
      error: (err) => {
        console.error('Error loading category:', err);
        // Redirect or handle error as needed
      },
    });
  }

  onSubmit(): void {
    if (this.category.name && this.category.description) {
      this.categoryService.updateCategory(this.category).subscribe({
        next: (updatedCategory) => {
          console.log('Category updated successfully:', updatedCategory);
          this.router.navigate(['/sale-category-list']); // Navigate to category list after successful update
        },
        error: (err) => {
          console.error('Error updating category:', err);
        },
      });
    }
  }
}
