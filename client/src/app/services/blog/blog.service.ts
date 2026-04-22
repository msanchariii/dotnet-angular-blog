import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../model/ApiResponse';
import { FindBlog, FindBlogExtended } from '../../model/FindBlog';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  createBlog(request: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>('/api/blogs', request);
  }

  findBlogs(params?: {
    PageSize?: 5 | 10 | 20 | 50 | 100;
    PageNo?: number;
    SortBy?: 'newest' | 'oldest' | 'popular';
    CategoryId?: string;
    Tags?: string[];
  }): Observable<FindBlogExtended[]> {
    const query = new URLSearchParams({ pageSize: params?.PageSize?.toString() ?? '10' });

    if (params?.PageNo) {
      query.set('PageNumber', params.PageNo.toString());
    }

    if (params?.SortBy) {
      query.set('SortBy', params.SortBy);
    }

    if (params?.CategoryId) {
      query.set('Category', params.CategoryId);
    }

    if (params?.Tags?.length) {
      params.Tags.forEach((tag) => {
        if (tag?.trim()) {
          query.append('Tags', tag);
        }
      });
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

  findBlogsForAdmin(params?: {
    PageSize?: 5 | 10 | 20 | 50 | 100;
    PageNo?: number;
    SortBy?: 'newest' | 'oldest' | 'popular';
    CategoryId?: string;
    Tags?: string[];
  }): Observable<FindBlogExtended[]> {
    const query = new URLSearchParams({ pageSize: params?.PageSize?.toString() ?? '10' });

    if (params?.PageNo) {
      query.set('PageNumber', params.PageNo.toString());
    }

    if (params?.SortBy) {
      query.set('SortBy', params.SortBy);
    }

    if (params?.CategoryId) {
      query.set('Category', params.CategoryId);
    }

    if (params?.Tags?.length) {
      params.Tags.forEach((tag) => {
        if (tag?.trim()) {
          query.append('Tags', tag);
        }
      });
    }

    return this.http.get<ApiResponse<FindBlog[]>>(`/api/blogs/admin/all?${query.toString()}`).pipe(
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

  getMyBlogs(): Observable<FindBlogExtended[]> {
    return this.http.get<ApiResponse<FindBlog[]>>('/api/blogs/my').pipe(
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
    return this.http.get<ApiResponse<FindBlog[]>>('/api/bookmarks/me').pipe(
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

  deleteBlog(blogId: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`/api/blogs/${blogId}`);
  }

  updateBlog(blogId: string, payload: any): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(`/api/blogs/${blogId}`, payload);
  }

  togglePublish(blogId: string, isPublished: boolean): Observable<ApiResponse<FindBlog>> {
    return this.http.patch<ApiResponse<FindBlog>>(`/api/blogs/${blogId}/publish`, {
      isPublished,
    });
  }

  getInitials(author: string): string {
    const names = author.trim().split(/\s+/);
    return names
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase();
  }

  getReadTime(content: string): string {
    const wordsPerMinute = 150;
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

  sanitizeBlogContent(content: string): string {
    return content.replace(/&nbsp;/g, ' ');
  }

  sanitizeBlogPreview(content: string): string {
    return content.replace(/&nbsp;/g, ' ').replace(/<[^>]*>/g, '');
  }
}
