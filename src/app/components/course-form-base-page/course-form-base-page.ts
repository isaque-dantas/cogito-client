import {Component, computed, inject, signal, TemplateRef} from '@angular/core';
import {Header} from '../header/header';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CourseFormService} from '../../services/course-form-service';
import {CourseService} from '../../services/course.service';
import {CourseForm} from '../../interfaces/course';
import {AlertService} from '../../services/alert';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {CourseFormBasePageInterface} from '../../interfaces/course-form-base-page';
import {BreadcrumbLister} from '../breadcumb-lister/breadcrumb-lister.component';
import {Breadcrumb} from '../../interfaces/breadcrumb';
import {ModuleTitlePipe} from '../../pipes/module-title-pipe';
import {LessonType} from '../../interfaces/lesson';
import {LessonContent} from '../lesson-content/lesson-content';
import {LessonFormService} from '../../services/lesson-form-service';

@Component({
  selector: 'app-course-form-base-page',
  imports: [
    Header,
    ReactiveFormsModule,
    BreadcrumbLister,
    RouterLink,
    LessonContent
  ],
  templateUrl: './course-form-base-page.html',
  styleUrl: './course-form-base-page.css'
})
export class CourseFormBasePage implements CourseFormBasePageInterface {
  protected activatedRoute = inject(ActivatedRoute);
  protected courseService = inject(CourseService)
  protected alertService = inject(AlertService)
  protected router = inject(Router)

  submitButtonLabel!: string
  formTitle!: string

  lessonFormService = inject(LessonFormService)
  formService = inject(CourseFormService)
  form!: FormGroup

  breadcrumbs: Breadcrumb[] = []

  selectedModuleIndex = signal<number>(0)
  selectedModule = computed(() => {
    return this.modules.at(this.selectedModuleIndex())
  })

  get modules() {
    return (this.form.controls as { modules: FormArray<FormGroup> }).modules
  }

  addModule() {
    this.modules.push(this.formService.moduleGroupFactory())
    this.selectedModuleIndex.set(this.modules.length - 1)
  }

  addLesson(moduleIndex: number) {
    (this.modules.at(moduleIndex).controls as any).lessons.push(this.lessonFormService.lessonGroupFactory())
  }

  removeModule(moduleIndex: number) {
    if (this.modules.length == 1) return;

    this.beforeRemovingModule(moduleIndex)
    this.modules.removeAt(moduleIndex);

    let newSelectedModuleIndex = moduleIndex - 1
    if (newSelectedModuleIndex < 0) {
      newSelectedModuleIndex = 0
    }

    this.selectedModuleIndex.set(newSelectedModuleIndex)
  }

  removeLesson(moduleIndex: number, lessonIndex: number) {
    const lessons = (this.modules.at(moduleIndex).controls as any).lessons

    if (lessons.length == 1) return;

    this.beforeRemovingLesson(moduleIndex, lessonIndex)
    lessons.removeAt(lessonIndex)
  }

  onSubmit() {
    if (this.form.invalid) return;

    let courseForm = this.form.value as CourseForm
    courseForm = this.lessonFormService.replaceVideoLinksByIdsInCourseForm(courseForm)

    this.sendFormToServer(courseForm)
  }

  handleFormError(error: HttpErrorResponse): void {
    const messageByStatus: { [status: number]: string } = {
      0: error.message,
      401: "Você precisa estar logado(a) para criar ou editar um curso.",
      403: "Você precisa ser coordenador(a) para criar ou editar um curso.",
    }

    let message = messageByStatus[error.status]
    if (message == undefined) message = messageByStatus[0]

    this.alertService.error(message)
  }

  selectModule(moduleIndex: number) {
    this.selectedModuleIndex.set(moduleIndex)
  }

  sendFormToServer(courseForm: CourseForm): void { }
  beforeRemovingModule(moduleIndex: number) { }
  beforeRemovingLesson(moduleIndex: number, lessonIndex: number) { }
  areThereAnyPendingChanges(): boolean {
    return false
  }
  getUrlForCourseView(): string {
    return "/"
  }

  protected readonly LessonType = LessonType;
}
