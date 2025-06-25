import {Component, inject, OnInit} from '@angular/core';
import {Header} from '../../components/header/header';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CourseFormService} from '../../services/course-form-service';
import {CourseService} from '../../services/course.service';
import {Module} from '../../interfaces/module';
import {CourseForm} from '../../interfaces/course';
import {AlertService} from '../../services/alert';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-course-creation-page',
  imports: [
    Header,
    ReactiveFormsModule
  ],
  templateUrl: './course-creation-page.html',
  styleUrl: './course-creation-page.css'
})
export class CourseCreationPage implements OnInit {
  courseService = inject(CourseService)
  alertService = inject(AlertService)
  formService = inject(CourseFormService)
  fb = inject(FormBuilder)

  form = this.fb.group({
    title: ['', [Validators.required]],
    modules: this.fb.array([this.formService.moduleGroupFactory()], Validators.min(1))
  })


  get modules() {
    return this.form.controls.modules as FormArray<FormGroup>;
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      console.log(
        this.formService.getLessonsFromModule(this.modules.at(0)).at(0)!.get('video_link')!.errors
      )
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
    console.log("babab")
    const lessons = (this.modules.at(moduleIndex).controls as any).lessons

    if (lessons.length == 1) return;
    lessons.removeAt(lessonIndex)
  }

  onSubmit() {
    if (this.form.invalid) return;

    let courseForm = this.form.value as CourseForm
    courseForm = this.formService.replaceVideoLinksByIdsInCourseForm(courseForm)

    this.courseService.create(courseForm).subscribe({
      next: (course) => {
        this.alertService.success(`Curso '${course.title}' criado com sucesso.`)
        console.log(course)
        this.form.reset()
      },
      error: (error: HttpErrorResponse) => {
        const messageByStatus: {[status: number]: string} = {
          0: error.message,
          401: "Você precisa estar logado(a) para criar um curso.",
          403: "Você precisa ser coordenador(a) para criar um curso.",
        }

        let message = messageByStatus[error.status]
        if (message == undefined) message = messageByStatus[0]

        this.alertService.error(message)
      },
    })
  }
}
