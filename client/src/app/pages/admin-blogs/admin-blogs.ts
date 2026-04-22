import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { BlogService } from '../../services/blog';
import { FindBlogExtended } from '../../model/FindBlog';
import { AuthService } from '../../services/auth';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink, ToastModule],
  templateUrl: './admin-blogs.html',
  styleUrl: './admin-blogs.css',
})
export class AdminBlogs {
  private messageService = inject(MessageService);
  constructor(
    private blogService: BlogService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  blogs: FindBlogExtended[] = [];
  isLoading = true;
  errorMessage = '';
  actionMessage = '';

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
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
          this.cdr.detectChanges();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to load blogs.';
          this.cdr.detectChanges();
          this.isLoading = false;
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
    const swalWithBootstrapButtons = Swal.mixin({
      buttonsStyling: true,
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.blogService.deleteBlog(blogId).subscribe({
            next: (response) => {
              if (response.success) {
                this.blogs = this.blogs.filter((blog) => blog.blogId !== blogId);
                this.cdr.detectChanges();
                this.messageService.add({
                  severity: 'info',
                  summary: 'Info',
                  detail: 'Blog Deleted',
                });
                swalWithBootstrapButtons.fire({
                  title: 'Deleted!',
                  text: 'Blog has been deleted.',
                  icon: 'success',
                });
                return;
              }

              swalWithBootstrapButtons.fire({
                title: 'Error',
                text: response.message || 'Unable to delete blog.',
                icon: 'error',
              });
            },
            error: (err) => {
              swalWithBootstrapButtons.fire({
                title: 'Error',
                text: err?.error?.message || 'Unable to delete blog.',
                icon: 'error',
              });
            },
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: 'Your blog is safe :)',
            icon: 'error',
          });
        }
      });
  }

  togglePublish(blog: FindBlogExtended) {
    const nextValue = !blog.isPublished;

    this.blogService.togglePublish(blog.blogId, nextValue).subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'info',
            summary: 'Info',
            detail: nextValue ? 'Blog Approved' : 'Blog Unpublished',
          });
          this.loadBlogs();
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.message || 'Unable to update publish status.',
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err?.error?.message || 'Unable to update publish status.',
        });
      },
    });
  }
}
