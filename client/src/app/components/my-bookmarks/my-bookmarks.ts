import { ChangeDetectorRef, Component } from '@angular/core';
import { BlogCard } from '../blog-card/blog-card';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlogExtended } from '../../model/FindBlog';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-bookmarks',
  imports: [BlogCard, FormsModule, SelectModule, MultiSelectModule],
  templateUrl: './my-bookmarks.html',
  styleUrl: './my-bookmarks.css',
})
export class MyBookmarks {
  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  blogData: FindBlogExtended[] = [];

  sanitizePreview(content: string): string {
    return this.blogService.sanitizeBlogPreview(content);
  }

  ngOnInit() {
    this.blogService.getMyBookmarks().subscribe((blogs) => {
      this.blogData = blogs;
      this.cdr.detectChanges();
    });
  }

  onBookmarkChanged(event: { blogId: string; isBookmarked: boolean }) {
    if (!event.isBookmarked) {
      this.blogData = this.blogData.filter((b) => b.blogId !== event.blogId);
      this.cdr.detectChanges();
      return;
    }

    const blog = this.blogData.find((b) => b.blogId === event.blogId);
    if (blog) {
      blog.isBookmarked = event.isBookmarked;
    }
  }
}
