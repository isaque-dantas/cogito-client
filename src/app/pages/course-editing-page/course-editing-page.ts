import {Component, inject, OnInit} from '@angular/core';
import {Header} from '../../components/header/header';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CourseForm, CourseFormGroupWithId, CourseFormWithIds} from '../../interfaces/course';
import {ModuleUpdateForm} from '../../interfaces/module';
import {LessonForm} from '../../interfaces/lesson';
import {ModuleFormService} from '../../services/module-form-service';
import {LessonFormService} from '../../services/lesson-form-service';
import {CourseFormBasePage} from '../../components/course-form-base-page/course-form-base-page';

@Component({
  selector: 'app-course-editing-page',
  imports: [
    Header,
    ReactiveFormsModule
  ],
  templateUrl: '../../components/course-form-base-page/course-form-base-page.html',
  styleUrls: [
    '../../components/course-form-base-page/course-form-base-page.css',
    './course-editing-page.css'
  ]
})
export class CourseEditingPage extends CourseFormBasePage implements OnInit{
  override formTitle = 'Editar curso'
  override submitButtonLabel = 'Confirmar alterações'

  private courseBeingEditedId: number | null = null;

  private entitiesToBeUpdated!: {
    course?: { title: string },
    modules: { id: number, data: ModuleUpdateForm }[],
    lessons: { id: number, data: LessonForm }[],
  }

  declare form: FormGroup<CourseFormGroupWithId>

  moduleFormService = inject(ModuleFormService)
  lessonFormService = inject(LessonFormService)

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (!params.hasOwnProperty("id")) return;
      this.courseBeingEditedId = params['id'] as number;

      this.courseService.getById(this.courseBeingEditedId).subscribe({
        next: course => {
          let courseForm: CourseFormWithIds = this.formService.getFormFromInstance(course)
          console.log(courseForm)
          courseForm = this.formService.addUrlPrefixToVideoIds(courseForm)

          this.form = this.formService.courseEditingGroupFactory(
            course.modules.length,
            course.modules.map(m => m.lessons.length)
          )

          this.form.setValue(courseForm)
        }
      })
    })
  }

  override sendFormToServer(courseForm: CourseForm) {
    if (!this.courseBeingEditedId) return;

    // this.entitiesToBeUpdated = this.formService.getEntitiesToBeUpdated(this.form as FormGroup)
    //
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
}
