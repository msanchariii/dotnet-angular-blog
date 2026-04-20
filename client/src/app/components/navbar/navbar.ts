import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  authService: AuthService;
  router = inject(Router);
  userEmail: string | null;

  constructor(authService: AuthService) {
    this.authService = authService;
    this.userEmail = authService.getUserEmail();
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
    this.router.navigate(['/']);
  }

  onLogout() {
    this.authService.clearUser();
    this.router.navigate(['/login']);
  }

  // ngOnInit() {
  //   this.userEmail = this.authService.getUserEmail();
  // }
}
