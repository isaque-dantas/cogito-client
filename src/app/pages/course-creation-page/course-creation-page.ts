import {Component} from '@angular/core';
import {Header} from '../../components/header/header';
import {CourseForm, CourseFormGroup} from '../../interfaces/course';
import {CourseFormBasePage} from '../../components/course-form-base-page/course-form-base-page';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {Breadcrumb} from '../../interfaces/breadcrumb';
import {BreadcrumbLister} from '../../components/breadcumb-lister/breadcrumb-lister.component';
import {RouterLink} from '@angular/router';
import {LessonContent} from '../../components/lesson-content/lesson-content';

@Component({
  selector: 'app-course-creation-page',
  imports: [
    Header,
    ReactiveFormsModule,
    BreadcrumbLister,
    RouterLink,
    LessonContent
  ],
  templateUrl: '../../components/course-form-base-page/course-form-base-page.html',
  styleUrl: '../../components/course-form-base-page/course-form-base-page.css',
})
export class CourseCreationPage extends CourseFormBasePage {
  override formTitle = 'Adicionar curso'
  override submitButtonLabel = 'Enviar'

  declare form: FormGroup<CourseFormGroup>
  override breadcrumbs: Breadcrumb[] = [{'label': 'Início', 'url': '/'}, {
    'label': 'Painel Administrativo',
    'url': '/painel-administrativo'
  }, {'label': this.formTitle}]

  constructor() {
    super();
    this.form = this.formService.courseCreationGroupFactory(1, [1]) as FormGroup

    this.form.valueChanges.subscribe((value) => {
      console.log(
        value.title,
        value.modules!.map(m => m.lessons!.map(l => {
          let content = ""
          try {
            content =  (l.content as any)!["content"][0]["content"][0]["text"]
          } catch (e) {
            content = l.content ?? ""
          }

          return `c: '${content}'; t: '${l.type}'`
        })))
    })
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
