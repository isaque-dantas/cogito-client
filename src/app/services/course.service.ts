import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {API_BASE_URL} from '../app.config';
import {Course, CourseForm} from '../interfaces/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  http = inject(HttpClient);
  base_url = `${API_BASE_URL}/course`;

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base_url)
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.base_url}/${id}`)
  }

  create(course: CourseForm): Observable<Course> {
    return this.http.post<Course>(this.base_url, course)
  }

  edit(course: CourseForm, id: number): Observable<void> {
    return this.http.put<void>(`${this.base_url}/${id}`, course)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base_url}/${id}`)
  }

  subscribeIn(id: number) {
    console.log(`Tentando com id ${id}`)
    return this.http.post<Course>(`${this.base_url}/${id}/subscribe`, {})
  }
}
