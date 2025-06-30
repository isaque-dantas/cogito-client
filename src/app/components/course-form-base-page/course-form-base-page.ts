import {Component, inject, TemplateRef} from '@angular/core';
import {Header} from '../header/header';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CourseFormService} from '../../services/course-form-service';
import {CourseService} from '../../services/course.service';
import {CourseForm} from '../../interfaces/course';
import {AlertService} from '../../services/alert';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {CourseFormBasePageInterface} from '../../interfaces/course-form-base-page';

@Component({
  selector: 'app-course-form-base-page',
  imports: [
    Header,
    ReactiveFormsModule,
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

  formService = inject(CourseFormService)

  form!: FormGroup<{
    id: FormControl<number | null>,
    title: FormControl<string>,
    modules: FormArray<FormGroup>
  }>

  get modules() {
    return this.form.controls.modules as FormArray<FormGroup>;
  }

  addModule() {
    this.modules.push(this.formService.moduleGroupFactory())
  }

  addLesson(moduleIndex: number) {
    (this.modules.at(moduleIndex).controls as any).lessons.push(this.formService.lessonGroupFactory())
  }

  removeModule(moduleIndex: number, beforeRemovingCallback?: () => void) {
    if (this.modules.length == 1) return;

    if (beforeRemovingCallback) beforeRemovingCallback()
    this.modules.removeAt(moduleIndex);
  }

  removeLesson(moduleIndex: number, lessonIndex: number, beforeRemovingCallback?: () => void) {
    const lessons = (this.modules.at(moduleIndex).controls as any).lessons

    if (lessons.length == 1) return;

    if (beforeRemovingCallback) beforeRemovingCallback()
    lessons.removeAt(lessonIndex)
  }

  onSubmit() {
    if (this.form.invalid) return;

    let courseForm = this.form.value as CourseForm
    courseForm = this.formService.replaceVideoLinksByIdsInCourseForm(courseForm)

    this.sendFormToServer(courseForm)
  }

  handleFormError(error: HttpErrorResponse): void {
    const messageByStatus: { [status: number]: string } = {
      0: error.message,
      401: "Você precisa estar logado(a) para criar um curso.",
      403: "Você precisa ser coordenador(a) para criar um curso.",
    }

    let message = messageByStatus[error.status]
    if (message == undefined) message = messageByStatus[0]

    this.alertService.error(message)
  }

  sendFormToServer(courseForm: CourseForm): void {};
}
