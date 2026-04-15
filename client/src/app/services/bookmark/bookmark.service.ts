import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { FindBlog } from '../../model/FindBlog';
import { ApiResponse } from '../../model/ApiResponse';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(private http: HttpClient) {}

  getMyBookmarks(): Observable<FindBlog[]> {
    // get userId from local storage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // redirect to login page if userId is not found in local storage
      window.location.href = '/login';
      return of([]);
    }

    return this.http
      .get<ApiResponse<FindBlog[]>>(`/api/bookmarks?userId=${userId}`)
      .pipe(map((response) => response.data ?? []));
  }
}
