import {Inject, inject, Injectable, PLATFORM_ID} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthToken} from '../interfaces/auth-token';
import {API_BASE_URL} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  private readonly isBrowser: boolean = false;

  constructor(@Inject(PLATFORM_ID) platformId: any) {
    this.isBrowser = platformId == "browser";
    console.log(platformId);
  }

  login(email: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${API_BASE_URL}/auth/token`, {email, password})
      .pipe(
        tap((token: AuthToken) => this.storeAuthTokenInLocalStorage(token))
      )
  }

  storeAuthTokenInLocalStorage(authToken: AuthToken): AuthToken {
    if (!this.isBrowser) return authToken

    localStorage.setItem("access", authToken.access);
    return authToken
  }

  logout() {
    if (!this.isBrowser) return;

    localStorage.clear()
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) return false

    return this.doesAccessTokenExist() && !this.hasAccessTokenExpired()
  }

  hasAccessTokenExpired(): boolean {
    if (!this.isBrowser) return false

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

  doesAccessTokenExist(): boolean {
    if (!this.isBrowser) return false

    return !!localStorage.getItem('access');
  }

  getToken(): string | null {
    if (!this.isBrowser || !this.isAuthenticated()) return null

    return "Bearer " + localStorage.getItem('access')!
  }
}
