import {Component, effect, inject} from '@angular/core';
import {Header} from '../../components/header/header';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Course, CourseWithCoordinatorInfo} from '../../interfaces/course';
import {CourseService} from '../../services/course.service';
import {AlertService} from '../../services/alert';

@Component({
  selector: 'app-admin-panel-page',
  imports: [
    Header,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './admin-panel-page.html',
  styleUrl: './admin-panel-page.css'
})
export class AdminPanelPage {
  private courseService = inject(CourseService);
  courses$?: Observable<CourseWithCoordinatorInfo[]>;
  private alertService = inject(AlertService);

  constructor() {
    effect(() => this.courses$ = this.courseService.getAllWithCoordinatorInfo())
  }

  deleteCourse(id: number) {
    this.courseService.delete(id).subscribe({
      next: () => this.alertService.success(`Curso #${id} excluído com sucesso.`),
      error: () => this.alertService.error("Ocorreu um erro ao tentar excluir o curso. Tente novamente.")
    })
  }
}
