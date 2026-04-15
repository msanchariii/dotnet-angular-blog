import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../services/auth';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register-form',
  imports: [CommonModule, InputTextModule, FormsModule, PasswordModule, ButtonModule, RouterLink],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    if (this.isLoading) {
      return;
    }

    this.errorMessage = '';

    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    this.isLoading = true;

    const payload = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
    };

    this.authService
      .register(payload)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (response) => {
          if (response.success && response.statusCode === 200) {
            this.router.navigate(['/login']);
            return;
          }

          this.errorMessage = response.message || 'Registration failed';
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Unable to register. Please try again.';
        },
      });
  }
}
