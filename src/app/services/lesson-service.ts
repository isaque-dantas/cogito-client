import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {API_BASE_URL} from '../app.config'
import {Lesson, LessonForm, LessonUpdateForm} from '../interfaces/lesson';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  http = inject(HttpClient);

  getById(id: number): Observable<Lesson> {
    return this.http.get<Lesson>(`${API_BASE_URL}/lesson/${id}`);
  }

  create(lessonData: LessonForm, moduleId: number) {
    return this.http.post<Lesson>(`${API_BASE_URL}/module/${moduleId}/lesson`, lessonData)
  }

  update(id: number, updateData: LessonUpdateForm) {
    return this.http.put<void>(`${API_BASE_URL}/lesson/${id}`, updateData)
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/lesson/${id}`)
  }
}
