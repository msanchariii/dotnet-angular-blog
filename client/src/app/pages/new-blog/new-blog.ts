import { Component, ChangeDetectorRef, OnInit, PLATFORM_ID, Inject, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BlogService } from '../../services/blog/blog.service';
import { FindCategory } from '../../model/FindCategory';
import { CategoryService } from '../../services/category/category.service';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-new-blog',
  imports: [InputTextModule, FormsModule, ButtonModule, SelectModule, TextareaModule, EditorModule],
  templateUrl: './new-blog.html',
  styleUrl: './new-blog.css',
})
export class NewBlog implements OnInit {
  constructor(
    private blogService: BlogService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object, // 👈 inject platform id
  ) {}

  private readonly router: Router = inject(Router);

  userId: string | null = null; // 👈 no longer read localStorage here
  title: string = '';
  content: string = '';
  categories: FindCategory[] = [];
  categoryId: string = '';
  tags: string[] = [];
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  get isFormInvalid(): boolean {
    return !this.title.trim() || !this.content.trim() || !this.categoryId;
  }

  ngOnInit() {
    // 👇 guard every browser API behind this check
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      window.location.href = '/login';
      return;
    }

    this.categoryService.getAllCategories().subscribe((categories) => {
      this.categories = categories;
      this.cdr.detectChanges();
    });
  }

  onContentChange() {
    this.tags = this.extractTags(this.content);
  }

  submitBlog() {
    // on success, push to blog list page
    if (this.isSubmitting) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.userId) {
      this.errorMessage = 'Please login first.';
      return;
    }

    if (!this.title.trim() || !this.content.trim() || !this.categoryId) {
      this.errorMessage = 'Category, title and content are required.';
      return;
    }

    this.isSubmitting = true;

    this.blogService
      .createBlog({
        userId: this.userId,
        title: this.title.trim(),
        content: this.content.trim(),
        categoryId: this.categoryId || null,
        tags: this.tags,
      })
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.successMessage = 'Blog submitted successfully.';
            this.title = '';
            this.content = '';
            this.categoryId = '';
            this.tags = [];

            // Redirect to blog list page on success
            this.router.navigate(['/blog']);

            return;
          }

          this.errorMessage = response.message || 'Unable to submit blog.';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to publish blog. Please try again.';
        },
      });
  }

  private extractTags(value: string): string[] {
    const matches = value.match(/#[a-zA-Z0-9-_]+/g) ?? [];
    const uniqueTags = new Set(matches.map((tag) => tag.slice(1).toLowerCase()));
    return Array.from(uniqueTags);
  }
}
