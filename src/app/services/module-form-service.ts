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

  handleAdd(moduleData: { courseId: number, data: ModuleForm }) {
    this.moduleService.create(moduleData.data, moduleData.courseId).subscribe({
      next: () => this.alertService.success(`O módulo '${moduleData.data.title}' foi adicionada com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao adicionar o módulo '${moduleData.data.title}'. Tente novamente`),
    })
  }

  handleDelete(moduleId: number) {
    this.moduleService.delete(moduleId).subscribe({
      next: () => this.alertService.success(`O módulo #${moduleId} foi excluído com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao excluir o módulo #${moduleId}. Tente novamente`),
    })
  }
}
