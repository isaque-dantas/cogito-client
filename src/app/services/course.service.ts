import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_BASE_URL} from '../app.config';
import {Course, CourseForm, CoursePatchForm, CourseWithCoordinatorInfo} from '../interfaces/course';

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

  edit(course: CoursePatchForm, id: number): Observable<void> {
    return this.http.patch<void>(`${this.base_url}/${id}`, course)
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base_url}/${id}`)
  }

  subscribeIn(id: number) {
    return this.http.post<Course>(`${this.base_url}/${id}/subscribe`, {})
  }

  searchByTitle(searchQuery: string) {
    return this.http.get<Course[]>(
      this.base_url,
      {params: {q: searchQuery}}
    )
  }

  getAllWithCoordinatorInfo() {
    return this.http.get<CourseWithCoordinatorInfo[]>(`${this.base_url}?coordinator-info=true`);
  }
}
