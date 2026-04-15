import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../model/ApiResponse';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../model/LoginResponse';
import { tap } from 'rxjs/operators';
import { RegisterResponse } from '../model/register-response';
import { RegisterRequest } from '../model/register-request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_EMAIL_KEY = 'userEmail';

  constructor(private http: HttpClient) {} // Injected here

  login(user: { password: string; email: string }) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/Auth/login`, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        tap((response) => {
          if (response.statusCode === 200 && response.success && response.data) {
            localStorage.setItem(this.USER_ID_KEY, response.data.userId);
            localStorage.setItem(this.USER_EMAIL_KEY, response.data.email);
          }
        }),
      );
  }

  register(user: RegisterRequest) {
    return this.http.post<ApiResponse<RegisterResponse>>(`${environment.apiUrl}/Auth/register`, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
    });
  }

  getUser() {
    return {
      id: this.getUserId(),
      email: this.getUserEmail(),
    };
  }

  getUserId(): string | null {
    return localStorage.getItem(this.USER_ID_KEY);
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  clearUser() {
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.USER_ID_KEY);
  }
}
