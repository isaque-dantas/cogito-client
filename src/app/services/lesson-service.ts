import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {API_BASE_URL} from '../app.config'
import {Lesson, LessonForm} from '../interfaces/lesson';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  http = inject(HttpClient);

  getById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${API_BASE_URL}/lesson/${id}`);
  }

  update(id: number, updateData: LessonForm) {
    return this.http.put<void>(`${API_BASE_URL}/lesson/${id}`, updateData)
  }
}
