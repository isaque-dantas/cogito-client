import {inject, Injectable} from '@angular/core';
import {API_BASE_URL} from '../app.config';
import {HttpClient} from '@angular/common/http';
import {Module, ModuleForm, ModuleUpdateForm} from '../interfaces/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  http = inject(HttpClient);

  create(data: ModuleForm, courseId: number) {
    return this.http.post<Module>(`${API_BASE_URL}/course/${courseId}/module`, data)
  }

  update(id: number, updateData: ModuleUpdateForm) {
    return this.http.put<void>(`${API_BASE_URL}/module/${id}`, updateData)
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/module/${id}`)
  }
}
