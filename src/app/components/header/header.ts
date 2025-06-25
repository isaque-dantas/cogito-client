import {Component, inject, OnInit} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
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
export class Header implements OnInit {
  isUserLogged: boolean = false;
  authService = inject(AuthService)

  ngOnInit() {
    this.isUserLogged = this.authService.isAuthenticated()
  }
}
