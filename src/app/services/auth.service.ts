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

  storeAuthTokenInLocalStorage(authToken: AuthToken): AuthToken {
    localStorage.setItem("access", authToken.access);
    return authToken;
  }

  logout() {
    localStorage.clear()
  }

  isAuthenticated(): boolean {
    return this.doesAccessTokenExist() && !this.isAccessTokenExpired()
  }

  isAccessTokenExpired(): boolean {
    if (!this.doesAccessTokenExist()) return true

    const token: string = localStorage.getItem("access")!
    const encodedTokenPayload = token.split('.')[1]
    const decodedTokenPayload = JSON.parse(atob(encodedTokenPayload))
    const exp = decodedTokenPayload.exp

    if (!exp) return true

    const expirationDate = new Date(exp * 1000).getTime()
    const currentDate = new Date().getTime()

    return currentDate >= expirationDate
  }

  doesAccessTokenExist() {
    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    if (!this.isAuthenticated()) return null

    return "Bearer " + localStorage.getItem('access');
  }
}
