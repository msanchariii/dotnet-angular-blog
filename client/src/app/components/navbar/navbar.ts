import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  router = inject(Router);
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
}
