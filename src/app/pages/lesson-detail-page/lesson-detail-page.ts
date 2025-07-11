import {
  afterNextRender, ChangeDetectorRef,
  Component, effect,
  ElementRef,
  EventEmitter,
  inject,
  Injector, OnInit,
  runInInjectionContext, signal
} from '@angular/core';
import {Header} from '../../components/header/header';
import {Lesson, LessonPositionRelatedToCourse, LessonStatus} from '../../interfaces/lesson';
import {LessonService} from '../../services/lesson-service'
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AlertService} from '../../services/alert';
import {YouTubePlayer} from '@angular/youtube-player';
import {HttpErrorResponse} from '@angular/common/http';
import {ModuleTitlePipe} from '../../pipes/module-title-pipe';
import {LessonTitlePipe} from '../../pipes/lesson-title-pipe';
import {BreadcrumbLister} from '../../components/breadcumb-lister/breadcrumb-lister.component';
import {Breadcrumb} from '../../interfaces/breadcrumb';

@Component({
  selector: 'app-lesson-detail-page',
  imports: [
    Header,
    YouTubePlayer,
    RouterLink,
    ModuleTitlePipe,
    LessonTitlePipe,
    BreadcrumbLister
  ],
  templateUrl: './lesson-detail-page.html',
})
export class LessonDetailPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private lessonService = inject(LessonService);
  private alertService = inject(AlertService);

  private router = inject(Router);
  private injector = inject(Injector);
  private changeDetectorRef = inject(ChangeDetectorRef);

  lesson = signal<Lesson | null>(null)

  lessonId?: number;
  parentCourseId = signal<number | null>(null);

  private elementRef = inject(ElementRef);

  videoWrapperWidth: number | null = null;
  videoWrapperHeight: number | null = null;
  videoWrapperId: string = "video-wrapper";

  breadcrumbs: Breadcrumb[] = [
    {label: 'Início', url: '/'},
    {label: 'Curso', url: `/curso/${this.parentCourseId()}`},
    {label: 'Aula'}
  ]

  constructor() {
    effect(() => {
      this.breadcrumbs[1] = {
        label: this.lesson() ? `Curso "${this.lesson()?.parent_course_title}"` : 'Curso',
        url: `/curso/${this.parentCourseId()}`
      }
    })
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.parentCourseId.set(params['course_id'])
      this.lessonId = params['lesson_id']

      if (!this.parentCourseId() || !this.lessonId) {
        this.alertService.error('É preciso informar o ID do curso e da aula.')
        this.router.navigateByUrl('/')
        return;
      }

      this.lessonService.getById(this.lessonId!).subscribe({
        next: (lesson: Lesson) => {
          this.lesson.set(lesson)
          if (lesson.status !== LessonStatus.LOCKED) this.setVideoWrapperSize()
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.alertService.error("Aula não encontrada. Verifique se houve um erro de digitação na URL ou tente novamente.")
            this.router.navigateByUrl(`/curso/${this.parentCourseId()}`)
              .catch((err: HttpErrorResponse) => {
                if (err.status === 404) this.router.navigateByUrl(`/`)
              })
          }

          this.alertService.error("Ocorreu um erro ao carregar os dados da aula. Tente novamente.")
        }
      })
    })
  }

  setVideoWrapperSize() {
    this.changeDetectorRef.detectChanges();

    const videoWrapperElement: Element = this.elementRef.nativeElement.querySelector(`#${this.videoWrapperId}`);
    if (!videoWrapperElement) return;

    const height = videoWrapperElement.clientHeight
    this.videoWrapperWidth = height * 16 / 9
    this.videoWrapperHeight = height
  }

  goToPreviousLesson() {
    if (this.lesson()?.position_related_to_course === LessonPositionRelatedToCourse.FIRST) return;
    this.router.navigateByUrl(`/curso/${this.parentCourseId()}/aula/${this.lesson()?.previous_lesson_id}`)
  }

  goToNextLesson() {
    if (this.lesson()?.position_related_to_course === LessonPositionRelatedToCourse.LAST) return;
    this.router.navigateByUrl(`/curso/${this.parentCourseId()}/aula/${this.lesson()?.next_lesson_id}`)
  }

  protected readonly LessonStatus = LessonStatus;
}
