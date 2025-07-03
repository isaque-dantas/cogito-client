import {afterNextRender, Component, effect, ElementRef, inject, Injector, runInInjectionContext} from '@angular/core';
import {Header} from '../../components/header/header';
import {SideMenu} from '../../components/side-menu/side-menu';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Course} from '../../interfaces/course';
import {CourseService} from '../../services/course.service';
import {AlertService} from '../../services/alert';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {LessonStatus} from '../../interfaces/lesson';
import {HttpErrorResponse} from '@angular/common/http';
import {AuthService} from '../../services/auth.service';
import {PercentagePipe} from '../../pipes/percentage-pipe';
import {ModuleTitlePipe} from '../../pipes/module-title-pipe';
import {LessonTitlePipe} from '../../pipes/lesson-title-pipe';

@Component({
  selector: 'app-course-detail-page',
  imports: [
    Header,
    SideMenu,
    AsyncPipe,
    RouterLink,
    PercentagePipe,
    NgTemplateOutlet,
    ModuleTitlePipe,
    LessonTitlePipe
  ],
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.css',
})
export class CourseDetailPage {
  private elementRef = inject(ElementRef);

  private activatedRoute = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  authService = inject(AuthService);

  injector = inject(Injector);

  course: Course | null = null;
  courseProgressBarId: string = "progress-bar";

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const courseId = params['id']

      if (!courseId) {
        this.alertService.error('É preciso informar o ID do curso.')
        this.router.navigateByUrl('/')
        return;
      }

      this.courseService.getById(courseId).subscribe({
        next: result => {
          this.course = result
          this.setProgressBarWidth(result.progress_level_percentage)
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.alertService.error("O curso com o ID informado não existe.")
          } else {
            this.alertService.error("Ocorreu um erro ao tentar carregar o curso. Tente novamente.");
          }

          this.router.navigateByUrl("/")
        }
      })
    });
  }

  setProgressBarWidth(progressPercentage?: number) {
    if (!this.course?.is_subscribed || this.course?.has_user_finished) return;

    runInInjectionContext(this.injector, () => {
      afterNextRender(() => {
        const courseProgressBar: HTMLElement = (this.elementRef.nativeElement as Element).querySelector("#" + this.courseProgressBarId)!
        console.log(courseProgressBar)
        console.log(progressPercentage)
        courseProgressBar.style.width = `${progressPercentage! * 100}%`;
      })
    })
  }

  subscribeIntoCourse(id: number) {
    this.courseService.subscribeIn(id).subscribe({
      next: (courseWithUnlockedData) => {
        this.course = courseWithUnlockedData
        this.alertService.success(`Inscrição no curso realizada com sucesso!`)
        this.setProgressBarWidth(0)
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.alertService.error(err.error.detail)
          return;
        }

        this.alertService.error("Ocorreu um erro ao tentar inscrever você neste curso. Tente novamente.")
      }
    })
  }

  deleteCourse(id: number) {
    console.log("tentando exluir id", id)
    this.courseService.delete(id).subscribe({
      next: () => this.alertService.success(`Curso #${id} excluído com sucesso.`),
      error: () => this.alertService.error("Ocorreu um erro ao tentar excluir o curso. Tente novamente.")
    })
  }

  protected readonly LessonStatus = LessonStatus;
}
