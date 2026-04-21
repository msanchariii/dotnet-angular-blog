import { ChangeDetectorRef, Component } from '@angular/core';
import { BlogCard } from '../../components/blog-card/blog-card';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlogExtended } from '../../model/FindBlog';
import { EditBlog } from '../../components/edit-blog/edit-blog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-blog',
  standalone: true,
  imports: [BlogCard, EditBlog],
  templateUrl: './my-blog.html',
  styleUrl: './my-blog.css',
})
export class MyBlog {
  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
  ) {}

  blogData: FindBlogExtended[] = [];
  isEditDialogVisible = false;
  selectedBlogId: string | null = null;

  ngOnInit() {
    this.loadMyBlogs();
  }

  private loadMyBlogs() {
    this.blogService.getMyBlogs().subscribe((blogs) => {
      this.blogData = blogs;
      this.cdr.detectChanges();
    });
  }

  onBookmarkChanged(event: { blogId: string; isBookmarked: boolean }) {
    const blog = this.blogData.find((b) => b.blogId === event.blogId);
    if (blog) {
      blog.isBookmarked = event.isBookmarked;
    }
  }

  onEditBlog(blogId: string) {
    this.selectedBlogId = blogId;
    this.isEditDialogVisible = true;
  }

  onBlogUpdated() {
    this.loadMyBlogs();
  }

  sanitizedBlogPreview(content: string): string {
    return this.blogService.sanitizeBlogPreview(content);
  }

  onDeleteBlog(blogId: string) {
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
                this.blogData = this.blogData.filter((blog) => blog.blogId !== blogId);
                this.cdr.detectChanges();
                swalWithBootstrapButtons.fire({
                  title: 'Deleted!',
                  text: 'Your blog has been deleted.',
                  icon: 'success',
                });
              } else {
                swalWithBootstrapButtons.fire({
                  title: 'Error!',
                  text: response.message || 'Unable to delete blog.',
                  icon: 'error',
                });
              }
            },
            error: (err) => {
              swalWithBootstrapButtons.fire({
                title: 'Error!',
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
}
