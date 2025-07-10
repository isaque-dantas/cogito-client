import {Component} from '@angular/core';
import {Header} from '../../components/header/header';
import {CourseForm, CourseFormGroup} from '../../interfaces/course';
import {CourseFormBasePage} from '../../components/course-form-base-page/course-form-base-page';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-course-creation-page',
  imports: [
    Header,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: '../../components/course-form-base-page/course-form-base-page.html',
  styleUrl: '../../components/course-form-base-page/course-form-base-page.css',
})
export class CourseCreationPage extends CourseFormBasePage {
  override formTitle = 'Adicionar curso'
  override submitButtonLabel = 'Enviar'

  declare form: FormGroup<CourseFormGroup>

  constructor() {
    super();
    this.form = this.formService.courseCreationGroupFactory(1, [1]) as FormGroup
  }

  override sendFormToServer(courseForm: CourseForm) {
    this.courseService.create(courseForm).subscribe({
      next: (course) => {
        this.alertService.success(`Curso '${course.title}' criado com sucesso.`)
        this.router.navigateByUrl(`curso/${course.id}`);
      },
      error: this.handleFormError.bind(this),
    })
  }
}
