import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User, UserForm} from '../interfaces/user';
import {API_BASE_URL} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  http = inject(HttpClient);

  constructor() { }

  register(user: UserForm) {
    return this.http.post<User>(`${API_BASE_URL}/user`, user);
  }
}
