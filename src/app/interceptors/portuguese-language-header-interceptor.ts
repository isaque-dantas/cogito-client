import { HttpInterceptorFn } from '@angular/common/http';

export const portugueseLanguageHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticatedRequest = req.clone({
    headers: req.headers.set('Accept-Language', 'pt_BR'),
  });

  return next(authenticatedRequest);
};
