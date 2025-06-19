import { HttpInterceptorFn } from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token: string | null = authService.getToken()

  if (!token) return next(req);

  const authenticatedRequest = req.clone({
    headers: req.headers.set('Authorization', token),
  });

  return next(authenticatedRequest);
};
