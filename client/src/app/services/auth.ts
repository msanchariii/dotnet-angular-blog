import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../model/ApiResponse';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../model/LoginResponse';
import { tap } from 'rxjs/operators';
import { RegisterResponse } from '../model/register-response';
import { RegisterRequest } from '../model/register-request';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  // private readonly USER_ID_KEY = 'userId';
  // private readonly USER_EMAIL_KEY = 'userEmail';
  // private readonly USER_ROLE_KEY = 'userRole';

  constructor(private http: HttpClient) {}

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

  decodeAuthToken(token: string): {
    userId: string;
    name: string;
    role: string;
    email: string;
    exp: number;
    iss: string;
    aud: string;
  } | null {
    try {
      console.log('Decoding token:', token);
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getToken(): string | null {
    const name = this.canUseStorage() ? localStorage.getItem(this.TOKEN_KEY) : null;
    console.log('Retrieved token:', name);
    return name;
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeAuthToken(token);
    return decoded ? decoded.userId : null;
  }

  getUserEmail(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeAuthToken(token);
    return decoded ? decoded.email : null;
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeAuthToken(token);
    return decoded ? decoded.role : null;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) return null;

    const decoded = this.decodeAuthToken(token);
    return decoded ? decoded.name : null;
  }

  clearUser() {
    if (!this.canUseStorage()) return;
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
