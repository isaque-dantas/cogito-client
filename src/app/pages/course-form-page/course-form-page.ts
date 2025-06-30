import {Component, inject, OnInit} from '@angular/core';
import {Header} from '../../components/header/header';
import {FormArray, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CourseFormService} from '../../services/course-form-service';
import {CourseService} from '../../services/course.service';
import {CourseForm} from '../../interfaces/course';
import {AlertService} from '../../services/alert';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {ModuleUpdateForm} from '../../interfaces/module';
import {LessonForm} from '../../interfaces/lesson';
import {ModuleFormService} from '../../services/module-form-service';
import {LessonFormService} from '../../services/lesson-form-service';

@Component({
  selector: 'app-course-form-page',
  imports: [
    Header,
    ReactiveFormsModule
  ],
  templateUrl: './course-form-page.html',
  styleUrl: './course-form-page.css'
})
export class CourseFormPage implements OnInit {
  private activatedRoute = inject(ActivatedRoute);
  private courseService = inject(CourseService)
  private alertService = inject(AlertService)
  private router = inject(Router)

  isEditing: boolean = false;
  private courseBeingEditedId: number | null = null;

  private entitiesToBeUpdated!: {
    course?: { title: string },
    modules: { id: number, data: ModuleUpdateForm }[],
    lessons: { id: number, data: LessonForm }[],
  }

  formService = inject(CourseFormService)
  form = this.formService.courseGroupFactory()

  moduleFormService = inject(ModuleFormService)
  lessonFormService = inject(LessonFormService)

  get modules() {
    return this.form.controls.modules as FormArray<FormGroup>;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (!params.hasOwnProperty("id")) return;

      this.isEditing = true;
      this.courseBeingEditedId = params['id'] as number;

      this.courseService.getById(this.courseBeingEditedId).subscribe({
        next: course => {
          let courseForm: CourseForm = this.formService.getFormFromInstance(course)
          courseForm = this.formService.addUrlPrefixToVideoIds(courseForm)

          this.form = this.formService.courseGroupFactory(
            course.modules.length,
            course.modules.map(m => m.lessons.length)
          )
          this.form.setValue(courseForm)
        }
      })
    })
  }

  addModule() {
    this.modules.push(this.formService.moduleGroupFactory())
  }

  addLesson(moduleIndex: number) {
    (this.modules.at(moduleIndex).controls as any).lessons.push(this.formService.lessonGroupFactory())
  }

  removeModule(moduleIndex: number) {
    if (this.modules.length == 1) return;


    this.modules.removeAt(moduleIndex);
  }

  removeLesson(moduleIndex: number, lessonIndex: number) {
    const lessons = (this.modules.at(moduleIndex).controls as any).lessons

    if (lessons.length == 1) return;
    lessons.removeAt(lessonIndex)
  }

  onSubmit() {
    if (this.form.invalid) return;

    let courseForm = this.form.value as CourseForm
    courseForm = this.formService.replaceVideoLinksByIdsInCourseForm(courseForm)

    if (this.isEditing) this.edit(courseForm)
    else this.create(courseForm)
  }

  edit(courseForm: CourseForm) {
    if (!this.courseBeingEditedId) return;

    // this.entitiesToBeUpdated = this.formService.getEntitiesToBeUpdated(this.form as FormGroup)

    // this.entitiesToBeUpdated.modules.forEach((m) => this.moduleFormService.sendUpdateRequestAndAlertAccordingToResponse(m))
    // this.entitiesToBeUpdated.lessons.forEach((l) => this.lessonFormService.sendUpdateRequestAndAlertAccordingToResponse(l))

    this.courseService.edit(courseForm, this.courseBeingEditedId).subscribe({
      next: () => {
        this.alertService.success(`Curso editado com sucesso.`)
        this.router.navigateByUrl('/')
      },
      error: this.handleFormError.bind(this),
    })
  }

  create(courseForm: CourseForm) {
    this.courseService.create(courseForm).subscribe({
      next: (course) => {
        this.alertService.success(`Curso '${course.title}' criado com sucesso.`)
        this.form.reset()
      },
      error: this.handleFormError.bind(this),
    })
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
}
