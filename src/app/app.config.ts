import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {errorLoggerInterceptor} from './interceptors/error-logger-interceptor';
import {authInterceptor} from './interceptors/auth.interceptor';
import {portugueseLanguageHeaderInterceptor} from './interceptors/portuguese-language-header-interceptor';
import {provideEnvironmentNgxMask} from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    // provideClientHydration(withEventReplay()),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorLoggerInterceptor, portugueseLanguageHeaderInterceptor])
    ),
    provideEnvironmentNgxMask()
  ]
};

export const API_BASE_URL = 'http://localhost:8000';
