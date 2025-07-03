import {inject, Injectable} from '@angular/core';
import {ModuleForm, ModuleUpdateForm} from '../interfaces/module';
import {ModuleService} from './module-service';
import {LessonForm} from '../interfaces/lesson';
import {AlertService} from './alert';

@Injectable({
  providedIn: 'root'
})
export class ModuleFormService {
  private moduleService = inject(ModuleService)
  private alertService = inject(AlertService)

  handleUpdate(moduleData: { id: number; data: ModuleUpdateForm }) {
    this.moduleService.update(moduleData.id, moduleData.data).subscribe({
      next: () => this.alertService.success(`O módulo #${moduleData.id} foi editado com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao editar o módulo #${moduleData.id}. Tente novamente.`),
    })
  }

  handleAdd(moduleData: ModuleForm) {
    this.moduleService.create(moduleData).subscribe({
      next: () => this.alertService.success(`O módulo '${moduleData.title}' foi adicionada com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao adicionar o módulo '${moduleData.title}'. Tente novamente`),
    })
  }
}
