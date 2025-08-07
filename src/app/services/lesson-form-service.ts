import {inject, Injectable} from '@angular/core';
import {LessonService} from './lesson-service';
import {
  LessonCreationData,
  LessonForm,
  LessonFormGroup,
  LessonFormGroupWithId,
  LessonNestedForm, LessonNestedFormWithIds, LessonType,
  LessonUpdateData,
  LessonUpdateForm
} from '../interfaces/lesson';
import {HttpErrorResponse} from '@angular/common/http';
import {AlertService} from './alert';
import {
  AbstractControl, AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {from, map, Observable, of} from 'rxjs';
import {CourseForm, CourseFormWithIds} from '../interfaces/course';
import {ModuleNestedForm, ModuleNestedFormWithIds} from '../interfaces/module';

@Injectable({
  providedIn: 'root'
})
export class LessonFormService {
  private lessonService = inject(LessonService)
  private alertService = inject(AlertService)
  private fb = inject(FormBuilder)

  handleUpdate(lessonData: LessonUpdateData) {
    this.lessonService.update(lessonData.id, lessonData.data).subscribe({
      next: () => {
        this.alertService.success(`A aula #${lessonData.id} foi editada com sucesso.`)
        lessonData.formGroup.markAsPristine()
      },
      error: () => this.alertService.error(`Ocorreu um erro ao editar a aula #${lessonData.id}. Tente novamente.`),
    })
  }

  handleAdd(lessonData: LessonCreationData) {
    this.lessonService.create(lessonData.data, lessonData.moduleId).subscribe({
      next: (lesson) => {
        this.alertService.success(`A aula '${lessonData.data.title}' foi adicionada com sucesso.`)
        lessonData.formGroup.markAsPristine()
        lessonData.formGroup.controls.id.setValue(lesson.id)
      },
      error: () => this.alertService.error(`Ocorreu um erro ao adicionar a aula '${lessonData.data.title}'. Tente novamente.`)
    })
  }

  handleDelete(id: number) {
    this.lessonService.delete(id).subscribe({
      next: () => this.alertService.success(`A aula #${id} foi excluída com sucesso.`),
      error: () => this.alertService.error(`Ocorreu um erro ao excluir a aula #${id}. Tente novamente`),
    })
  }

  existentYoutubeVideoLinkValidator() {
    return (control: AbstractControl<string>): Observable<ValidationErrors | null> => {
      const videoId = this.getVideoIdFromRawUrl(control.value)
      if (videoId == null) return of({hasNoVideoId: true})

      const encodedVideoUrl = encodeURIComponent(`https://youtu.be/${videoId}`)
      const requestUrl = 'https://www.youtube.com/oembed?url=' + encodedVideoUrl

      return from(fetch(requestUrl))
        .pipe(
          map(response => {
            if (response.ok) return null
            return {doesNotExist: true}
          })
        )
    }
  }

  getVideoIdFromRawUrl(url: string): string | null {
    const pattern = new RegExp(/v=[a-zA-Z\d_-]{11}[&\s]|v=[a-zA-Z\d_-]{11}$/)
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
      (l: LessonNestedForm): LessonNestedForm => ({...l, content: this.getVideoIdFromRawUrl(l.content)!})
    const moduleMapper =
      (m: ModuleNestedForm): ModuleNestedForm => ({...m, lessons: m.lessons.map(lessonMapper)})

    return {
      ...courseForm,
      modules: courseForm.modules.map(moduleMapper)
    }
  }

  addUrlPrefixToVideoIds(courseForm: CourseFormWithIds): CourseFormWithIds {
    const getVideoLinkFromId = (videoId: string): string => `https://www.youtube.com/watch?v=${videoId}`

    const lessonMapper =
      (l: LessonNestedFormWithIds): LessonNestedFormWithIds => ({...l, content: getVideoLinkFromId(l.content)!})
    const moduleMapper =
      (m: ModuleNestedFormWithIds): ModuleNestedFormWithIds => ({...m, lessons: m.lessons.map(lessonMapper)})

    return {
      ...courseForm,
      modules: courseForm.modules.map(moduleMapper)
    }
  }

  defaultLessonType() {
    return LessonType.VIDEO
  }

  lessonGroupFactory(shouldAddIdControl: boolean = false): FormGroup<LessonFormGroup> | FormGroup<LessonFormGroupWithId> {
    let group!: FormGroup

    if (!shouldAddIdControl)
      group = this.fb.group({
        title: ['', Validators.required],
        content: ['', {
          validators: [Validators.required],
          asyncValidators: [this.existentYoutubeVideoLinkValidator()]
        }],
        type: [LessonType.VIDEO, Validators.required]
      }) as FormGroup<LessonFormGroup>

    group = new FormGroup<LessonFormGroupWithId>({
      id: new FormControl(null),
      title: new FormControl('', Validators.required),
      content: new FormControl('', {
        validators: [Validators.required],
        asyncValidators: [this.existentYoutubeVideoLinkValidator()]
      }),
      position: new FormControl(null, Validators.required),
      type: new FormControl(LessonType.VIDEO, Validators.required)
    })

    group.get('type')!.valueChanges.subscribe(
      (newType: LessonType) => this.updateContentValidatorsBasedOnType(newType, group)
    )

    return group
  }

  updateContentValidatorsBasedOnType(newType: LessonType, lessonFormGroup: FormGroup) {
    lessonFormGroup.get('content')!.clearValidators()
    lessonFormGroup.get('content')!.clearAsyncValidators()
    lessonFormGroup.get('content')!.markAsPristine()

    const newValidators = this.getContentValidatorsByType(newType)
    lessonFormGroup.get('content')!.setValidators(newValidators.validators)

    if (newValidators.asyncValidators) {
      lessonFormGroup.get('content')!.setAsyncValidators(newValidators.asyncValidators)
    }

    lessonFormGroup.get('content')!.reset()
  }

  getContentValidatorsByType(type: LessonType): { validators: ValidatorFn[], asyncValidators?: AsyncValidatorFn[] } {
    const validatorsByLessonType = new Map([
      [
        LessonType.VIDEO,
        {
          validators: [Validators.required],
          asyncValidators: [this.existentYoutubeVideoLinkValidator()]
        }
      ],
      [LessonType.DOCUMENT, {validators: [Validators.required]}],
      [LessonType.FILE, {validators: [Validators.required]}],
    ])

    return validatorsByLessonType.get(type)!
  }
}
