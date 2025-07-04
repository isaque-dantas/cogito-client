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
import {Course, CourseForm, CourseFormGroup, CourseFormGroupWithId, CourseFormWithIds} from '../interfaces/course';
import {
  LessonForm,
  LessonFormGroup,
  LessonFormGroupWithId,
  LessonNestedForm, LessonNestedFormWithIds,
  LessonNestedResponse, LessonUpdateForm
} from '../interfaces/lesson';
import {
  Module, ModuleForm,
  ModuleFormGroup,
  ModuleFormGroupWithId,
  ModuleNestedForm,
  ModuleNestedFormWithIds,
  ModuleUpdateForm
} from '../interfaces/module';
import {CourseService} from './course.service';
import {AlertService} from './alert';

@Injectable({
  providedIn: 'root'
})
export class CourseFormService {
  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private alertService: AlertService
  ) {
  }

  courseCreationGroupFactory(quantityOfModules?: number, quantitiesOfLessons?: number[]) {
    return new FormGroup<CourseFormGroup>({
      title: new FormControl('', Validators.required),
      modules: this.modulesFactory(quantityOfModules, quantitiesOfLessons, false) as FormArray<FormGroup<ModuleFormGroup>>
    })
  }

  courseEditingGroupFactory(quantityOfModules?: number, quantitiesOfLessons?: number[]) {
    return new FormGroup<CourseFormGroupWithId>({
      id: new FormControl(null),
      title: new FormControl('', Validators.required),
      modules: this.modulesFactory(quantityOfModules, quantitiesOfLessons, true) as FormArray<FormGroup<ModuleFormGroupWithId>>
    })
  }

  getModulesGroups(quantityOfModules?: number, quantitiesOfLessons?: number[], shouldAddIdsControls: boolean = false) {
    if (!quantityOfModules && !quantitiesOfLessons) return [this.moduleGroupFactory(1, shouldAddIdsControls)]

    let modules: (FormGroup<ModuleFormGroupWithId> | FormGroup<ModuleFormGroup>)[] = []

    if (quantityOfModules && !quantitiesOfLessons) {
      for (let i = 0; i < quantityOfModules; i++) modules.push(this.moduleGroupFactory(1, shouldAddIdsControls))
      return modules
    }

    for (let quantity of quantitiesOfLessons!) modules.push(this.moduleGroupFactory(quantity, shouldAddIdsControls))
    return modules
  }

  modulesFactory(quantityOfModules?: number, quantitiesOfLessons?: number[], shouldAddIdsControls: boolean = false) {
    const modules = this.getModulesGroups(quantityOfModules, quantitiesOfLessons, shouldAddIdsControls)
    return new FormArray(modules, Validators.min(1))
  }

  moduleGroupFactory(quantityOfLessons?: number, shouldAddIdsControls: boolean = false) {
    let lessons = [this.lessonGroupFactory(shouldAddIdsControls)];
    if (quantityOfLessons) {
      for (let i = 1; i < quantityOfLessons; i++) lessons.push(this.lessonGroupFactory(shouldAddIdsControls))
    }

    if (!shouldAddIdsControls)
      return this.fb.group({
        title: ['', [Validators.required]],
        lessons: this.fb.array(lessons as FormGroup<LessonFormGroup>[], Validators.min(1))
      }) as FormGroup<ModuleFormGroup>

    return (
      new FormGroup<ModuleFormGroupWithId>({
        id: new FormControl(null),
        title: new FormControl('', Validators.required),
        lessons: new FormArray(lessons as FormGroup<LessonFormGroupWithId>[], Validators.min(1)),
        position: new FormControl(null)
      })
    )
  }

  lessonGroupFactory(shouldAddIdControl: boolean = false): FormGroup<LessonFormGroup> | FormGroup<LessonFormGroupWithId> {
    if (!shouldAddIdControl)
      return this.fb.group({
        title: ['', [Validators.required]],
        video_link: ['', {
          validators: [Validators.required],
          asyncValidators: [this.existentYoutubeVideoLinkValidator()]
        }]
      }) as FormGroup<LessonFormGroup>

    return new FormGroup<LessonFormGroupWithId>({
      id: new FormControl(null),
      title: new FormControl('', Validators.required),
      video_link: new FormControl('', {
        validators: [Validators.min(1)],
        asyncValidators: [this.existentYoutubeVideoLinkValidator()]
      }),
      position: new FormControl(null)
    })
  }

  getLessonsFromModule(module: FormGroup<ModuleFormGroup>) {
    return module.controls.lessons.controls as FormGroup<LessonFormGroup>[]
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

  getVideoIdFromRawUrl(url: string): string | null {
    const pattern = new RegExp(/v=[a-zA-Z\d_-]{11}$/)
    const patternLocalization = url.search(pattern)

    if (patternLocalization === -1) return null

    const videoIdLength = 11
    const videoIdPrefixLength = 2

    return url.slice(
      patternLocalization + videoIdPrefixLength,
      patternLocalization + videoIdPrefixLength + videoIdLength
    )
  }

  replaceVideoLinksByIdsInCourseForm(courseForm: CourseForm): CourseForm {
    const lessonMapper =
      (l: LessonNestedForm): LessonNestedForm => ({...l, video_link: this.getVideoIdFromRawUrl(l.video_link)!})
    const moduleMapper =
      (m: ModuleNestedForm): ModuleNestedForm => ({...m, lessons: m.lessons.map(lessonMapper)})

    return {
      ...courseForm,
      modules: courseForm.modules.map(moduleMapper)
    }
  }

  getFormFromInstance(course: Course): CourseFormWithIds {
    return {
      id: course.id,
      title: course.title,
      modules: course.modules.map(this.getModuleFormFromInstance.bind(this)),
    }
  }

  getModuleFormFromInstance(module: Module): ModuleNestedFormWithIds {
    return {
      id: module.id,
      title: module.title,
      lessons: module.lessons.map(this.getLessonFormFromInstance),
      position: module.position
    }
  }

  getLessonFormFromInstance(lesson: LessonNestedResponse): LessonNestedFormWithIds {
    return {
      id: lesson.id,
      title: lesson.title,
      video_link: lesson.video_link!,
      position: lesson.position
    }
  }

  addUrlPrefixToVideoIds(courseForm: CourseFormWithIds): CourseFormWithIds {
    const getVideoLinkFromId = (videoId: string): string => `https://www.youtube.com/watch?v=${videoId}`

    const lessonMapper =
      (l: LessonNestedFormWithIds): LessonNestedFormWithIds => ({...l, video_link: getVideoLinkFromId(l.video_link)!})
    const moduleMapper =
      (m: ModuleNestedFormWithIds): ModuleNestedFormWithIds => ({...m, lessons: m.lessons.map(lessonMapper)})

    return {
      ...courseForm,
      modules: courseForm.modules.map(moduleMapper)
    }
  }

  getEntitiesToBeUpdated(form: FormGroup<CourseFormGroupWithId>): {
    modules: { id: number, data: ModuleUpdateForm }[],
    lessons: { id: number, data: LessonUpdateForm }[],
  } {
    const allLessonGroups = this.getAllLessonsFromForm(form)

    return {
      modules: form.controls.modules.controls.filter(m => this.isModuleFormGroupDirty(m) && m.value.id !== null).map(m => ({
        id: m.value.id!,
        data: {title: (m.value.title as string | null), position: (m.value.position as number | null)}
      })),
      lessons: allLessonGroups.filter(l => this.isLessonFormGroupDirty(l) && l.value.id !== null).map(l => ({
        id: l.value.id!,
        data: {
          title: (l.value.title as string | null),
          video_link: this.getVideoIdFromRawUrl(l.value.video_link as string),
          position: (l.value.position as number | null)
        }
      }))
    }
  }

  isModuleFormGroupDirty(module: FormGroup<ModuleFormGroupWithId>): boolean {
    return module.controls.title.dirty || module.controls.position.dirty
  }

  isLessonFormGroupDirty(lesson: FormGroup<LessonFormGroupWithId>): boolean {
    return lesson.controls.title.dirty || lesson.controls.position.dirty || lesson.controls.video_link.dirty
  }

  updateCourseTitle(form: FormGroup<CourseFormGroupWithId>, titleValueToUpdate: string) {
    if (!form.controls.title.dirty) return;

    this.courseService.edit({title: titleValueToUpdate}, form.value.id!).subscribe({
      next: () => this.alertService.success(`O curso #${form.value.id} foi editado com sucesso.`),
      error: () => this.alertService.error(`Não foi possível editar o curso. Tente novamente.`),
    })
  }

  getEntitiesToBeAdded(form: FormGroup<CourseFormGroupWithId>): {
    modules: ModuleForm[],
    lessons: { moduleId: number, data: LessonForm }[]
  } {
    const lessonMapper = (l: FormGroup<LessonFormGroupWithId>, moduleId: number): { moduleId: number, data: LessonForm } => ({
      moduleId: moduleId,
      data: {
        title: l.value.title!,
        position: l.value.position!,
        video_link: this.getVideoIdFromRawUrl(l.value.video_link!)!
      }
    })

    const lessonNestedFormMapper = (l: FormGroup<LessonFormGroupWithId>): LessonNestedForm => ({
      title: l.value.title!,
      video_link: this.getVideoIdFromRawUrl(l.value.video_link!)!
    })

    const moduleMapper = (m: FormGroup<ModuleFormGroupWithId>): ModuleForm => ({
      title: m.value.title!,
      position: m.value.position!,
      lessons: m.controls.lessons!.controls.map(lessonNestedFormMapper)
    })

    const previouslyAddedModules = form.controls.modules.controls.filter(m => m.value.id !== null)
    let lessons: { moduleId: number, data: LessonForm }[] = []
    for (let module of previouslyAddedModules) {
      const addedLessonsForModule =
        module.controls.lessons.controls
          .filter(l => this.isLessonFormGroupDirty(l) && l.value.id === null)
          .map(l => lessonMapper(l, module.value.id!))

      lessons = lessons.concat(addedLessonsForModule)
    }

    return {
      modules: form.controls.modules.controls.filter(m => this.isModuleFormGroupDirty(m) && m.value.id === null).map(moduleMapper),
      lessons: lessons
    }
  }

  getAllLessonsFromForm(form: FormGroup<CourseFormGroupWithId>) {
    let allLessonGroups: FormGroup<LessonFormGroupWithId>[] = []
    for (let module of form.controls.modules.controls) {
      allLessonGroups = allLessonGroups.concat(module.controls.lessons.controls)
    }

    return allLessonGroups
  }

  fillPositionsInForm(form: FormGroup<CourseFormGroupWithId>): CourseFormWithIds {
    const lessonMapper =
      (l: LessonNestedFormWithIds, index: number): LessonNestedFormWithIds => ({...l, position: index})
    const moduleMapper =
      (m: ModuleNestedFormWithIds, index: number): ModuleNestedFormWithIds => ({...m, position: index, lessons: m.lessons.map(lessonMapper)})

    return {
      id: form.value.id!,
      title: form.value.title!,
      modules: (form.value.modules! as ModuleNestedFormWithIds[]).map(moduleMapper)
    }
  }
}
