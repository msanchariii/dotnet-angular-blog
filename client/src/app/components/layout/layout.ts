import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  private readonly router: Router = inject(Router);
  private readonly authService: AuthService;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(authService: AuthService) {
    this.authService = authService;
    // const userId = authService.getUserId();
    // if (!userId) {
    //   this.router.navigate(['/login']);
    // }
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.router.navigate(['/login']);
    }
  }
}
