import {Injectable} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {catchError, from, map, Observable, of} from 'rxjs';
import {Course, CourseForm} from '../interfaces/course';
import {LessonForm, LessonNestedForm, LessonNestedResponse} from '../interfaces/lesson';
import {Module, ModuleNestedForm, ModuleUpdateForm} from '../interfaces/module';

@Injectable({
  providedIn: 'root'
})
export class CourseFormService {
  constructor(private fb: FormBuilder) {
  }

  courseGroupFactory(quantityOfModules?: number, quantitiesOfLessons?: number[], shouldAddIdsControls: boolean = false) {
    if (!shouldAddIdsControls) {
      return this.fb.group({
        title: ['', [Validators.required]],
        modules: this.modulesFactory(quantityOfModules, quantitiesOfLessons)
      })
    }

    return new FormGroup({
      id: new FormControl<number | null>(null),
      title: new FormControl<string>('', Validators.required),
      modules: this.modulesFactory(quantityOfModules, quantitiesOfLessons, true)
    })
  }

  courseEditingGroupFactory(quantityOfModules?: number, quantitiesOfLessons?: number[]) {
    return this.courseGroupFactory(quantityOfModules, quantitiesOfLessons, true)
  }

  getModulesGroups(quantityOfModules?: number, quantitiesOfLessons?: number[], shouldAddIdsControls: boolean = false) {
    if (!quantityOfModules && !quantitiesOfLessons) return [this.moduleGroupFactory(1, shouldAddIdsControls)]

    let modules = []

    if (quantityOfModules && !quantitiesOfLessons) {
      for (let i = 0; i < quantityOfModules; i++) modules.push(this.moduleGroupFactory(1, shouldAddIdsControls))
      return modules
    }

    for (let quantity of quantitiesOfLessons!) modules.push(this.moduleGroupFactory(quantity, shouldAddIdsControls))
    return modules
  }

  modulesFactory(quantityOfModules?: number, quantitiesOfLessons?: number[], shouldAddIdsControls: boolean = false) {
    const modules = this.getModulesGroups(quantityOfModules, quantitiesOfLessons, shouldAddIdsControls)
    return this.fb.array(modules, Validators.min(1))
  }

  moduleGroupFactory(quantityOfLessons?: number, shouldAddIdsControls: boolean = false): FormGroup {
    let lessons = [this.lessonGroupFactory(shouldAddIdsControls)];
    if (quantityOfLessons) {
      for (let i = 1; i < quantityOfLessons; i++) lessons.push(this.lessonGroupFactory(shouldAddIdsControls))
    }

    if (!shouldAddIdsControls)
      return this.fb.group({
        title: ['', [Validators.required]],
        lessons: this.fb.array(lessons, Validators.min(1))
      })

    return new FormGroup({
      id: new FormControl<number | null>(null),
      title: new FormControl<string>('', Validators.required),
      lessons: new FormArray(lessons, Validators.min(1))
    })
  }

  lessonGroupFactory(shouldAddIdControl: boolean = false): FormGroup {
    if (!shouldAddIdControl)
      return this.fb.group({
        title: ['', [Validators.required]],
        video_link: ['', {
          validators: [Validators.required],
          asyncValidators: [this.existentYoutubeVideoLinkValidator()]
        }]
      })

    return new FormGroup({
      id: new FormControl<number | null>(null),
      title: new FormControl<string>('', Validators.required),
      video_link: new FormControl('', {
        validators: [Validators.min(1)],
        asyncValidators: [this.existentYoutubeVideoLinkValidator()]
      })
    })
  }

  getLessonsFromModule(module: FormGroup):
    FormGroup[] {
    return (module as any).controls.lessons.controls as FormGroup[]
  }

  existentYoutubeVideoLinkValidator() {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      const videoId = this.getVideoIdFromRawUrl(control.value)
      if (videoId == null) return of({hasNoVideoId: true})

      const encodedVideoUrl = encodeURIComponent(`https://youtu.be/${videoId}`)
      const requestUrl = 'https://www.youtube.com/oembed?url=' + encodedVideoUrl

      return from(fetch(requestUrl)).pipe(
        map(() => null),
        catchError(() => of({doesNotExist: true})),
      )
    }
  }

  getVideoIdFromRawUrl(url: string):
    string | null {
    const pattern = new RegExp(/v=[a-zA-Z\d]{11}$/)
    const patternLocalization = url.search(pattern)

    if (patternLocalization === -1) return null

    const videoIdLength = 11
    const videoIdPrefixLength = 2

    return url.slice(
      patternLocalization + videoIdPrefixLength,
      patternLocalization + videoIdPrefixLength + videoIdLength
    )
  }

  replaceVideoLinksByIdsInCourseForm(courseForm: CourseForm):
    CourseForm {
    return this.applyMapForCourseLessons(
      courseForm,
      l => ({...l, video_link: this.getVideoIdFromRawUrl(l.video_link)!})
    )
  }

  getFormFromInstance(course: Course):
    CourseForm {
    return {
      title: course.title,
      modules: course.modules.map(this.getModuleFormFromInstance.bind(this))
    };
  }

  getModuleFormFromInstance(module: Module):
    ModuleNestedForm {
    return {
      title: module.title,
      lessons: module.lessons.map(this.getLessonFormFromInstance)
    }
  }

  getLessonFormFromInstance(lesson: LessonNestedResponse):
    LessonNestedForm {
    return {
      title: lesson.title,
      video_link: lesson.video_link!
    }
  }

  addUrlPrefixToVideoIds(course: CourseForm):
    CourseForm {
    const getVideoLinkFromId = (videoId: string): string => `https://www.youtube.com/watch?v=${videoId}`

    return this.applyMapForCourseLessons(
      course,
      l => ({...l, video_link: getVideoLinkFromId(l.video_link!)})
    )
  }

  applyMapForCourseLessons(course: CourseForm, callback: (lesson: LessonNestedForm) => LessonNestedForm):
    CourseForm {
    return {
      ...course,
      modules: course.modules.map(m =>
        ({
          ...m,
          lessons: m.lessons.map(callback)
        })
      )
    }
  }

  getEntitiesToBeUpdated(form: FormGroup<{
    title: FormControl<string>,
    modules: FormArray<FormGroup<{
      title: FormControl<string>,
      lessons: FormArray<FormGroup<{
        title: FormControl<string>,
        video_link: FormControl<string>
      }>>
    }>>
  }>):
    {
      course?: { title: string },
      modules: { id: number, data: ModuleUpdateForm }[],
      lessons:
        { id: number, data: LessonForm }[],
    } {
    let data: any = {modules: [], lessons: []}
    data.modules = form.controls.modules.controls.filter(m => m.dirty).map(m => ({}))

    for (let control of form.controls.modules.controls) {


      data.modules.push()
    }

    return data
  }
}


// FormGroup<{
//     title: FormControl<string>,
//     modules: FormArray<FormGroup<{
//       title: FormControl<string>,
//       lessons: FormArray<FormGroup<{ title: FormControl<string>, video_link: FormControl<string> }>>
//     }>>
//   }>
