import { ChangeDetectorRef, Component } from '@angular/core';
import { BlogCard } from '../../components/blog-card/blog-card';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlogExtended } from '../../model/FindBlog';

@Component({
  selector: 'app-my-blog',
  standalone: true,
  imports: [BlogCard],
  templateUrl: './my-blog.html',
  styleUrl: './my-blog.css',
})
export class MyBlog {
  constructor(
    private blogService: BlogService,
    private cdr: ChangeDetectorRef,
  ) {}

  blogData: FindBlogExtended[] = [];

  ngOnInit() {
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
}
