import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FindCategory } from '../../model/FindCategory';
import { ApiResponse } from '../../model/ApiResponse';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<FindCategory[]> {
    // Schema
    // {
    //   "success": true,
    //   "statusCode": 0,
    //   "message": "string",
    //   "data": [
    //     {
    //       "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //       "categoryName": "string",
    //       "slug": "string"
    //     }
    //   ]
    // }
    return this.http
      .get<ApiResponse<FindCategory[]>>(`/api/categories`)
      .pipe(map((response) => response.data ?? []));
  }
}
