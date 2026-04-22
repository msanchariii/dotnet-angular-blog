import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, isActive, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService: AuthService;
  router = inject(Router);

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  get userName(): string | null {
    return this.authService.getUserName();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }

  goToBookmarks() {
    // This method can be used if you want to navigate programmatically
    this.router.navigate(['/bookmarks']);
  }

  goToProfile() {
    // This method can be used if you want to navigate programmatically
    this.router.navigate(['/profile']);
  }

  goToFeed() {
    // This method can be used if you want to navigate programmatically
    this.router.navigate(['/blog']);
  }

  onLogout() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
  }

  // ngOnInit() {
  //   this.userEmail = this.authService.getUserEmail();
  // }
}
