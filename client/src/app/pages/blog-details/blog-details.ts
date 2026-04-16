import { Component, Input } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlog } from '../../model/FindBlog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-details',
  imports: [RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails {
  constructor(private blogService: BlogService) {}

  @Input() blogid!: string; // Automatically populated from the URL
  protected blog: FindBlog | null = null;
  private isLoading: boolean = true;
  protected readTime: string = '';
  protected publishedAt: string = '';
  protected initials: string | undefined;
  protected avatarColor: string | undefined;
  protected readonly tags = ['layout', 'hierarchy', 'readability', 'tailwind'];

  ngOnInit() {
    this.blogService.findBlogById(this.blogid).subscribe({
      next: (blog) => {
        this.blog = blog;
        this.isLoading = false;
        if (this.blog) {
          this.publishedAt = this.blogService.formatCreatedAt(this.blog.createdAt);
          this.readTime = this.blogService.getReadTime(this.blog.content);
          this.avatarColor = this.blogService.getAvatarColor(this.blog.authorName);
          this.initials = this.blogService.getInitials(this.blog.authorName);
        }
      },
      error: (err) => {
        console.error('Error fetching blog details:', err);
        this.isLoading = false;
      },
    });
  }

  // protected readonly takeaways = [
  //   'Keep one strong thesis and repeat it with different angles.',
  //   'Use predictable metadata placement on every post.',
  //   'Preserve generous line-height for long-form readability.',
  // ];
}
