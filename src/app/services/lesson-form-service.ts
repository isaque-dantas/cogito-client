import {inject, Injectable} from '@angular/core';
import {LessonService} from './lesson-service';
import {LessonForm} from '../interfaces/lesson';
import {HttpErrorResponse} from '@angular/common/http';
import {AlertService} from './alert';

@Injectable({
  providedIn: 'root'
})
export class LessonFormService {
  private lessonService = inject(LessonService)
  private alertService = inject(AlertService)

  sendUpdateRequestAndAlertAccordingToResponse(lessonModule: { id: number; data: LessonForm }) {
    this.lessonService.update(lessonModule.id, lessonModule.data).subscribe({
      next: () => this.alertService.success(`A aula #${lessonModule.id} foi editada com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao editar a aula #${lessonModule.id}. Tente novamente.`),
    })
  }
}
