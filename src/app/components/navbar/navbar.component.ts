import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Service/Authenticate/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuActive = false;
  userName = 'Someone Famous';
  userRole = 'Website Designer';

  constructor(public authService: AuthService, private router: Router) {}

  menuToggle(): void {
    this.isMenuActive = !this.isMenuActive;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedInside = (event.target as HTMLElement).closest('.action');
    if (!clickedInside && this.isMenuActive) {
      this.isMenuActive = false; // Close menu if clicked outside
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isMenuActive) {
      this.isMenuActive = false; // Close menu on scroll
    }
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuActive = false; // Close menu after navigation
  }

  logout(): void {
    // Implement your logout logic here
    // this.authService.logout();
    this.authService.logout();
    this.isMenuActive = false;
    this.router.navigate(['/signin']);
  }
}
