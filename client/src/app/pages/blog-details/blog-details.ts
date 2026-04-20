import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BlogService } from '../../services/blog/blog.service';
import { FindBlog } from '../../model/FindBlog';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog-details',
  imports: [RouterLink],
  templateUrl: './blog-details.html',
  styleUrl: './blog-details.css',
})
export class BlogDetails implements OnInit {
  constructor(
    private blogService: BlogService,
    private activateRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  blogid!: string; // Automatically populated from the URL
  protected blog: FindBlog | null = null;
  private isLoading: boolean = true;
  protected readTime: string = '';
  protected publishedAt: string = '';
  protected initials: string | undefined;
  protected avatarColor: string | undefined;
  protected tags: string[] = [];

  ngOnInit() {
    this.blogid = this.activateRoute.snapshot.paramMap.get('blogid') || '';
    if (this.blogid) {
      this.blogService.findBlogById(this.blogid).subscribe({
        next: (blog) => {
          this.blog = blog;
          // console.log(this.blog);
          this.isLoading = false;
          if (this.blog) {
            this.publishedAt = this.blogService.formatCreatedAt(this.blog.createdAt);
            this.readTime = this.blogService.getReadTime(this.blog.content);
            this.avatarColor = this.blogService.getAvatarColor(this.blog.authorName);
            this.initials = this.blogService.getInitials(this.blog.authorName);
            this.tags = (this.blog.tags ?? []).filter((tag) => !!tag?.trim());
            this.blog.content = this.blogService.sanitizeBlogContent(this.blog.content);
          } else {
            this.tags = [];
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching blog details:', err);
          this.isLoading = false;
        },
      });
    }
  }

  // protected readonly takeaways = [
  //   'Keep one strong thesis and repeat it with different angles.',
  //   'Use predictable metadata placement on every post.',
  //   'Preserve generous line-height for long-form readability.',
  // ];
}
