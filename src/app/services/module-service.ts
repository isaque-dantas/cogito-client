import {inject, Injectable} from '@angular/core';
import {API_BASE_URL} from '../app.config';
import {HttpClient} from '@angular/common/http';
import {ModuleUpdateForm} from '../interfaces/module';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  http = inject(HttpClient);

  update(id: number, updateData: ModuleUpdateForm) {
    return this.http.put<void>(`${API_BASE_URL}/module/${id}`, updateData)
  }
}
