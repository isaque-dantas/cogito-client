import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './header.html',
})
export class Header {
  authService = inject(AuthService)
  router = inject(Router)

  logout() {
    this.router.navigateByUrl("login").then(() => this.authService.logout())
  }
}
