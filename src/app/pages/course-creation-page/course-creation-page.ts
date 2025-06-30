import {Component} from '@angular/core';
import {Header} from '../../components/header/header';
import {CourseForm} from '../../interfaces/course';
import {CourseFormBasePage} from '../../components/course-form-base-page/course-form-base-page';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-course-creation-page',
  imports: [
    Header,
    ReactiveFormsModule
  ],
  templateUrl: '../../components/course-form-base-page/course-form-base-page.html',
  styleUrls: [
    '../../components/course-form-base-page/course-form-base-page.css',
    './course-creation-page.css'
  ]
})
export class CourseCreationPage extends CourseFormBasePage {
  override formTitle = 'Adicionar curso'
  override submitButtonLabel = 'Enviar'

  declare form: FormGroup<{
    title: FormControl<string>,
    modules: FormArray<FormGroup<{
      title: FormControl<string>,
      lessons: FormArray<FormGroup<{
        title: FormControl<string>,
        video_link: FormControl<string>
      }>>
    }>>
  }>

  constructor() {
    super();
    this.form = this.formService.courseGroupFactory(1, [1]) as FormGroup
  }

  override sendFormToServer(courseForm: CourseForm) {
    this.courseService.create(courseForm).subscribe({
      next: (course) => {
        this.alertService.success(`Curso '${course.title}' criado com sucesso.`)
        this.form.reset()
      },
      error: this.handleFormError.bind(this),
    })
  }
}
