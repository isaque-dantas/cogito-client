import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, tap, throwError} from 'rxjs';
import {inject} from '@angular/core';
import {AlertService} from '../services/alert';

export const errorLoggerInterceptor: HttpInterceptorFn = (req, next) => {
  const alert = inject(AlertService)

  return next(req).pipe(
    tap(console.log),
    catchError((error: HttpErrorResponse) => {
      console.log(error)
      if (error.status === 500) {
        alert.error("Houve um erro inesperado. Contate o administrador do sistema.")
      }

      return throwError(() => error)
    })
  );
};
