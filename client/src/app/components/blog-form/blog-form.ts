import {
  Component,
  ChangeDetectorRef,
  OnInit,
  PLATFORM_ID,
  inject,
  input,
  output,
  effect,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { BlogService } from '../../services/blog/blog.service';
import { CategoryService } from '../../services/category/category.service';
import { FindCategory } from '../../model/FindCategory';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-blog-form', // Changed selector name
  standalone: true,
  imports: [InputTextModule, FormsModule, ButtonModule, SelectModule, EditorModule],
  templateUrl: './blog-form.html',
  styleUrl: './blog-form.css',
})
export class BlogFormComponent implements OnInit {
  editId = input<string | null>(null); // If provided, we are in Edit mode
  onSaveSuccess = output<any>();

  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  private platformId = inject(PLATFORM_ID);

  userId: string | null = null;
  title: string = '';
  content: string = '';
  categoryId: string = '';
  tags: string[] = [];
  categories: FindCategory[] = [];

  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  private readonly syncEditData = effect(() => {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const id = this.editId();
    if (!id) {
      return;
    }

    this.loadBlogData(id);
  });

  get isEditMode(): boolean {
    return !!this.editId();
  }

  get isFormInvalid(): boolean {
    return !this.title.trim() || !this.content.trim() || !this.categoryId;
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.userId = localStorage.getItem('userId');
    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getAllCategories().subscribe((cats) => {
      this.categories = cats;
      this.cdr.detectChanges();
    });
  }

  private loadBlogData(id: string) {
    this.blogService.findBlogById(id).subscribe((data) => {
      if (data) {
        this.title = data.title;
        this.content = data.content;
        this.categoryId = data.categoryId;
        this.tags = data.tags;
        this.cdr.detectChanges();
      }
    });
  }

  onContentChange() {
    const matches = this.content.match(/#[a-zA-Z0-9-_]+/g) ?? [];
    const uniqueTags = new Set(matches.map((tag) => tag.slice(1).toLowerCase()));
    this.tags = Array.from(uniqueTags);
  }

  submit() {
    if (this.isSubmitting || !this.userId) return;

    this.isSubmitting = true;
    const payload = {
      userId: this.userId,
      title: this.title.trim(),
      content: this.content.trim(),
      categoryId: this.categoryId,
      tags: this.tags,
    };

    // Switch between Create and Update service calls
    const request$ = this.isEditMode
      ? this.blogService.updateBlog(this.editId()!, payload)
      : this.blogService.createBlog(payload);

    request$
      .pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.onSaveSuccess.emit(res.data);
          } else {
            this.errorMessage = res.message;
          }
        },
        error: (err) => (this.errorMessage = 'An error occurred.'),
      });
  }
}
