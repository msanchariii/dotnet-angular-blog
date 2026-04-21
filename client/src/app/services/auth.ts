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
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_ID_KEY = 'userId';
  private readonly USER_EMAIL_KEY = 'userEmail';
  private readonly USER_ROLE_KEY = 'userRole';

  constructor(private http: HttpClient) {} // Injected here

  private canUseStorage(): boolean {
    return typeof globalThis !== 'undefined' && typeof globalThis.localStorage !== 'undefined';
  }

  login(user: { password: string; email: string }) {
    return this.http
      .post<ApiResponse<LoginResponse>>(`${environment.apiUrl}/Auth/login`, {
        email: user.email,
        password: user.password,
      })
      .pipe(
        tap((response) => {
          if (response.statusCode === 200 && response.success && response.data) {
            if (this.canUseStorage()) {
              localStorage.setItem(this.TOKEN_KEY, response.data.token);
              localStorage.setItem(this.USER_ID_KEY, response.data.user.userId);
              localStorage.setItem(this.USER_EMAIL_KEY, response.data.user.email);
              localStorage.setItem(this.USER_ROLE_KEY, response.data.user.role);
            }
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
      role: this.getUserRole(),
    };
  }

  getToken(): string | null {
    return this.canUseStorage() ? localStorage.getItem(this.TOKEN_KEY) : null;
  }

  getUserId(): string | null {
    return this.canUseStorage() ? localStorage.getItem(this.USER_ID_KEY) : null;
  }

  getUserEmail(): string | null {
    return this.canUseStorage() ? localStorage.getItem(this.USER_EMAIL_KEY) : null;
  }

  getUserRole(): string | null {
    return this.canUseStorage() ? localStorage.getItem(this.USER_ROLE_KEY) : null;
  }

  clearUser() {
    if (!this.canUseStorage()) return;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
