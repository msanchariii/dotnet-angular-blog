import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { FindBlog, FindBlogExtended } from '../../model/FindBlog';
import { CreateBlogRequest } from '../../model/create-blog-request';
import { AuthService } from '../auth';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  createBlog(request: CreateBlogRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/blogs', request);
  }

  findBlogs(): Observable<FindBlogExtended[]> {
    const userId = this.authService.getUserId();
    console.log('Fetching Blogs For the user: ', userId);

    const query = new URLSearchParams({ pageSize: '100' });
    if (userId) {
      query.set('userId', userId);
    }

    return this.http.get<ApiResponse<FindBlog[]>>(`/api/blogs?${query.toString()}`).pipe(
      map(
        (response) =>
          response.data?.map((blog) => ({
            ...blog,
            readTime: this.getReadTime(blog.content),
            avatarColor: this.getAvatarColor(blog.authorName),
            initials: this.getInitials(blog.authorName),
          })) ?? [],
      ),
    );
  }

  findBlogById(blogId: string): Observable<FindBlogExtended | null> {
    return this.http.get<ApiResponse<FindBlog>>(`/api/blogs/${blogId}`).pipe(
      map((response) => {
        const blog = response.data;
        if (!blog) return null;
        return {
          ...blog,
          readTime: this.getReadTime(blog.content),
          avatarColor: this.getAvatarColor(blog.authorName),
          initials: this.getInitials(blog.authorName),
        };
      }),
    );
  }

  getMyBookmarks(): Observable<FindBlogExtended[]> {
    const userId = this.authService.getUserId();

    if (!userId) {
      return of([]);
    }

    return this.http.get<ApiResponse<FindBlog[]>>(`/api/bookmarks?userId=${userId}`).pipe(
      map(
        (response) =>
          response.data?.map((blog) => ({
            ...blog,
            isBookmarked: true,
            readTime: this.getReadTime(blog.content),
            avatarColor: this.getAvatarColor(blog.authorName),
            initials: this.getInitials(blog.authorName),
          })) ?? [],
      ),
    );
  }

  getInitials(author: string): string {
    const names = author.trim().split(/\s+/);
    return names
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase();
  }

  getReadTime(content: string): string {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  }

  getAvatarColor(author: string): string {
    const firstLetter = author.charAt(0).toUpperCase();

    if (['A', 'B', 'C'].includes(firstLetter)) return 'bg-amber-500';
    if (['D', 'E', 'F'].includes(firstLetter)) return 'bg-blue-500';
    if (['G', 'H', 'I'].includes(firstLetter)) return 'bg-green-500';
    if (['J', 'K', 'L'].includes(firstLetter)) return 'bg-red-500';
    if (['M', 'N', 'O'].includes(firstLetter)) return 'bg-purple-500';
    if (['P', 'Q', 'R'].includes(firstLetter)) return 'bg-pink-500';
    if (['S', 'T', 'U'].includes(firstLetter)) return 'bg-indigo-500';
    if (['V', 'W', 'X', 'Y', 'Z'].includes(firstLetter)) return 'bg-teal-500';

    return 'bg-slate-900';
  }

  formatCreatedAt(createdAt: Date): string {
    const date = new Date(createdAt);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  generateTags(content: string): string[] {
    const tagSet = new Set<string>();
    const words = content.split(/\s+/);
    words.forEach((word) => {
      if (word.startsWith('#') && word.length > 1) {
        tagSet.add(word.substring(1).toLowerCase());
      }
    });
    return Array.from(tagSet);
  }
}
