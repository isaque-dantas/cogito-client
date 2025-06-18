import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of, tap} from 'rxjs';
import {AuthToken} from '../interfaces/auth-token';
import {API_BASE_URL} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  login(email: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${API_BASE_URL}/auth/token`, {email, password})
      .pipe(
        tap((token: AuthToken) => this.storeAuthTokenInLocalStorage(token))
      )
  }

  storeAuthTokenInLocalStorage(authToken: AuthToken) {
    localStorage.setItem("access", authToken.access);
    return authToken;
  }
}
