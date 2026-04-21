import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { FindBlog } from '../../model/FindBlog';
import { ApiResponse } from '../../model/ApiResponse';
import { ToggleBookmarkResponse } from '../../model/Bookmark';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(private http: HttpClient) {}

  toggleBookmark(blogId: string): Observable<ApiResponse<ToggleBookmarkResponse>> {
    if (!blogId) {
      console.error('toggleBookmark: blogId is missing', { blogId });
      return of({
        success: false,
        statusCode: 400,
        message: 'Blog ID is missing',
        data: null,
      } as any);
    }

    return this.http.post<ApiResponse<ToggleBookmarkResponse>>('/api/bookmarks/toggle', {
      blogId,
    });
  }

  getMyBookmarks(): Observable<FindBlog[]> {
    return this.http
      .get<ApiResponse<FindBlog[]>>('/api/bookmarks/me')
      .pipe(map((response) => response.data ?? []));
  }
}
