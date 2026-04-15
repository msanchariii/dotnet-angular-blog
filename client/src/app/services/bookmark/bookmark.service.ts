import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { FindBlog } from '../../model/FindBlog';
import { ApiResponse } from '../../model/ApiResponse';
import { AuthService } from '../auth';
import { ToggleBookmarkResponse } from '../../model/Bookmark';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  toggleBookmark(blogId: string): Observable<ApiResponse<ToggleBookmarkResponse>> {
    const userId = this.authService.getUserId();

    if (!userId || !blogId) {
      console.error('toggleBookmark: userId or blogId is missing', { userId, blogId });
      return of({
        success: false,
        statusCode: 400,
        message: 'User ID or Blog ID is missing',
        data: null,
      } as any);
    }

    return this.http.post<ApiResponse<ToggleBookmarkResponse>>('/api/bookmarks/toggle', {
      userId,
      blogId,
    });
  }

  getMyBookmarks(): Observable<FindBlog[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return of([]);
    }

    return this.http
      .get<ApiResponse<FindBlog[]>>(`/api/bookmarks?userId=${userId}`)
      .pipe(map((response) => response.data ?? []));
  }
}
