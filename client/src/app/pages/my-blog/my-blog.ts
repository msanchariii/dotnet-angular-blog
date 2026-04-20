import { ChangeDetectorRef, Component } from '@angular/core';
import { BlogCard } from '../../components/blog-card/blog-card';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlogExtended } from '../../model/FindBlog';
import { EditBlog } from '../../components/edit-blog/edit-blog';

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
    const isConfirmed = globalThis.confirm('Delete this blog?');
    if (!isConfirmed) {
      return;
    }

    this.blogService.deleteBlog(blogId).subscribe((response) => {
      if (response.success) {
        this.blogData = this.blogData.filter((blog) => blog.blogId !== blogId);
        this.cdr.detectChanges();
      }
    });
  }
}
