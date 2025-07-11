import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {Header} from '../../components/header/header';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CourseForm, CourseFormGroupWithId, CourseFormWithIds} from '../../interfaces/course';
import {ModuleFormGroupWithId} from '../../interfaces/module';
import {LessonFormGroupWithId} from '../../interfaces/lesson';
import {ModuleFormService} from '../../services/module-form-service';
import {LessonFormService} from '../../services/lesson-form-service';
import {CourseFormBasePage} from '../../components/course-form-base-page/course-form-base-page';
import {HttpErrorResponse} from '@angular/common/http';
import {BreadcrumbLister} from '../../components/breadcumb-lister/breadcrumb-lister.component';
import {Breadcrumb} from '../../interfaces/breadcrumb';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-course-editing-page',
  imports: [
    Header,
    ReactiveFormsModule,
    BreadcrumbLister,
    RouterLink
  ],
  templateUrl: '../../components/course-form-base-page/course-form-base-page.html',
  styleUrl: '../../components/course-form-base-page/course-form-base-page.css',
})
export class CourseEditingPage extends CourseFormBasePage implements OnInit {
  override formTitle = 'Editar curso'
  override submitButtonLabel = 'Salvar alterações'

  private courseBeingEditedId: number | null = null;
  private entitiesToDelete: { modules: number[], lessons: number[] } = {
    modules: [],
    lessons: []
  }

  declare form: FormGroup<CourseFormGroupWithId>
  override breadcrumbs: Breadcrumb[] = [{'label': 'Início', 'url': '/'}, {'label': 'Painel Administrativo', 'url': '/painel-administrativo'}, {'label': this.formTitle}]

  moduleFormService = inject(ModuleFormService)
  lessonFormService = inject(LessonFormService)

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (!params.hasOwnProperty("id")) return;
      this.courseBeingEditedId = params['id'] as number;

      this.courseService.getById(this.courseBeingEditedId).subscribe({
        next: course => {
          let courseForm: CourseFormWithIds = this.formService.getFormFromInstance(course)
          courseForm = this.formService.addUrlPrefixToVideoIds(courseForm)

          this.form = this.formService.courseEditingGroupFactory(
            course.modules.length,
            course.modules.map(m => m.lessons.length)
          )

          this.form.setValue(courseForm)
          this.form.markAsPristine()

          this.form.valueChanges.subscribe(() => {
            // console.log(this.form.controls.modules.controls[0]!.controls.lessons.controls.map(control => control.dirty))
            // console.log(this.form.controls.modules.controls[0]!.controls.lessons.controls.map(control => control.value.title))
            console.log(this.form)
          })
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            this.alertService.error(`Não foi encontrado um curso com o ID ${this.courseBeingEditedId}.`)
            this.router.navigateByUrl("/").then()
          }
        }
      })
    })
  }

  override addModule() {
    this.form.controls.modules.push(
      this.formService.moduleGroupFactory(1, true) as FormGroup<ModuleFormGroupWithId>
    )
  }

  override addLesson(moduleIndex: number) {
    this.form.controls.modules.at(moduleIndex).controls.lessons.push(
      this.formService.lessonGroupFactory(true) as FormGroup<LessonFormGroupWithId>
    )
  }

  override sendFormToServer(courseForm: CourseForm) {
    if (!this.courseBeingEditedId) return;

    const formWithFilledPositions = this.formService.fillPositionsInForm(this.form)
    this.form.setValue(formWithFilledPositions)

    const entitiesToAdd = this.formService.getEntitiesToBeAdded(this.form)
    entitiesToAdd.modules.forEach((moduleData) => this.moduleFormService.handleAdd(moduleData))
    entitiesToAdd.lessons.forEach((lessonData) => this.lessonFormService.handleAdd(lessonData))

    const entitiesToUpdate = this.formService.getEntitiesToBeUpdated(this.form)
    entitiesToUpdate.modules.forEach((moduleData) => this.moduleFormService.handleUpdate(moduleData))
    entitiesToUpdate.lessons.forEach((lessonData) => this.lessonFormService.handleUpdate(lessonData))

    this.entitiesToDelete.modules.forEach(moduleId => this.moduleFormService.handleDelete(moduleId))
    this.entitiesToDelete.lessons.forEach(lessonId => this.lessonFormService.handleDelete(lessonId))

    this.formService.updateCourseTitle(this.form, courseForm.title)

    if (!this.areThereAnyPendingChanges()) {
      this.alertService.info("Não há alterações a serem aplicadas.")
    }

    this.entitiesToDelete.modules = []
    this.entitiesToDelete.lessons = []
  }

  override beforeRemovingModule(moduleIndex: number) {
    const moduleBeingRemoved = this.form.controls.modules.at(moduleIndex)
    if (!moduleBeingRemoved.value.id) return;

    this.entitiesToDelete.modules.push(moduleBeingRemoved.value.id)
  }

  override beforeRemovingLesson(moduleIndex: number, lessonIndex: number) {
    const lessonBeingRemoved = this.form.controls.modules.at(moduleIndex).controls.lessons.at(lessonIndex)
    if (!lessonBeingRemoved.value.id) return;

    this.entitiesToDelete.lessons.push(lessonBeingRemoved.value.id)
  }

  override areThereAnyPendingChanges(): boolean {
    return (
      this.form.dirty
      ||
      this.entitiesToDelete.modules.length >= 1
      ||
      this.entitiesToDelete.lessons.length >= 1
    )
  }

  override getUrlForCourseView(): string {
    return `/curso/${this.courseBeingEditedId}`
  }
}
