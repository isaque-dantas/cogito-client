import {Component} from '@angular/core';
import {Header} from '../../components/header/header';
import {ReactiveFormsModule} from '@angular/forms';
import {CourseForm} from '../../interfaces/course';
import {CourseFormBasePage} from '../../components/course-form-base-page/course-form-base-page';

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
