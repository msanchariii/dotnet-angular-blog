import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BlogService } from '../../services/blog';
import { FindBlogExtended } from '../../model/FindBlog';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-blogs.html',
  styleUrl: './admin-blogs.css',
})
export class AdminBlogs {
  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  blogs: FindBlogExtended[] = [];
  isLoading = false;
  errorMessage = '';
  actionMessage = '';

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.errorMessage = '';

    this.blogService
      .findBlogsForAdmin({ PageSize: 100 })
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (blogs) => {
          this.blogs = blogs;
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to load blogs.';
        },
      });
  }

  formatDate(value: Date | string | null | undefined): string {
    if (!value) {
      return '-';
    }

    return this.blogService.formatCreatedAt(new Date(value));
  }

  viewBlog(blogId: string) {
    return ['/blog', blogId];
  }

  deleteBlog(blogId: string) {
    const confirmed = globalThis.confirm('Delete this blog?');
    if (!confirmed) {
      return;
    }

    this.actionMessage = '';

    this.blogService.deleteBlog(blogId).subscribe({
      next: (response) => {
        if (response.success) {
          this.blogs = this.blogs.filter((blog) => blog.blogId !== blogId);
          this.actionMessage = 'Blog deleted successfully.';
          this.cdr.detectChanges();
          return;
        }

        this.errorMessage = response.message || 'Unable to delete blog.';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unable to delete blog.';
      },
    });
  }

  togglePublish(blog: FindBlogExtended) {
    this.actionMessage = '';
    const nextValue = !blog.isPublished;

    this.blogService.togglePublish(blog.blogId, nextValue).subscribe({
      next: (response) => {
        if (response.success) {
          this.actionMessage = nextValue ? 'Blog approved.' : 'Blog unpublished.';
          this.loadBlogs();
          return;
        }

        this.errorMessage = response.message || 'Unable to update publish status.';
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Unable to update publish status.';
      },
    });
  }
}
