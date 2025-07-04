import {inject, Injectable} from '@angular/core';
import {LessonService} from './lesson-service';
import {LessonForm, LessonUpdateForm} from '../interfaces/lesson';
import {HttpErrorResponse} from '@angular/common/http';
import {AlertService} from './alert';

@Injectable({
  providedIn: 'root'
})
export class LessonFormService {
  private lessonService = inject(LessonService)
  private alertService = inject(AlertService)

  handleUpdate(lessonData: { id: number; data: LessonUpdateForm }) {
    this.lessonService.update(lessonData.id, lessonData.data).subscribe({
      next: () => this.alertService.success(`A aula #${lessonData.id} foi editada com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao editar a aula #${lessonData.id}. Tente novamente.`),
    })
  }

  handleAdd(lessonData: { moduleId: number, data: LessonForm }) {
    this.lessonService.create(lessonData.data, lessonData.moduleId).subscribe({
      next: () => this.alertService.success(`A aula '${lessonData.data.title}' foi adicionada com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao adicionar a aula '${lessonData.data.title}'. Tente novamente.`)
    })
  }

  handleDelete(id: number) {
    this.lessonService.delete(id).subscribe({
      next: () => this.alertService.success(`A aula #${id} foi excluída com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao excluir a aula #${id}. Tente novamente`),
    })
  }
}
