import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-login-form',
  imports: [CommonModule, InputTextModule, FormsModule, PasswordModule, ButtonModule, RouterLink],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const payload = {
      email: this.email,
      password: this.password,
    };

    this.authService
      .login(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.statusCode === 200 && response.data) {
            this.router.navigate(['/blog']);
            return;
          }

          this.errorMessage = response.message || 'Login failed';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to login. Please try again.';
        },
      });
  }

  value: string = '';
}
