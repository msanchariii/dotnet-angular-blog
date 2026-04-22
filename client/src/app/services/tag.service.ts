import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../model/ApiResponse';
import { FindTag } from '../model/Tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  http = inject(HttpClient);

  getAllTags() {
    return this.http.get<ApiResponse<FindTag[]>>(`/api/tags`);
  }
}
