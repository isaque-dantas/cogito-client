import {Injectable} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {catchError, from, map, Observable, of} from 'rxjs';
import {CourseForm} from '../interfaces/course';
import {LessonForm} from '../interfaces/lesson';
import {ModuleForm} from '../interfaces/module';

@Injectable({
  providedIn: 'root'
})
export class CourseFormService {
  constructor(private fb: FormBuilder) {
  }

  moduleGroupFactory(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      lessons: this.fb.array([this.lessonGroupFactory()], [Validators.min(1)])
    })
  }

  lessonGroupFactory(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required]],
      video_link: ['', {
        validators: [Validators.required],
        asyncValidators: [this.existentYoutubeVideoLinkValidator()]
      }]
    })
  }

  getLessonsFromModule(module: FormGroup): FormGroup[] {
    return (module as any).controls.lessons.controls as FormGroup[]
  }

  existentYoutubeVideoLinkValidator() {
    return (control: FormControl<string>): Observable<ValidationErrors | null> => {
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

  replaceVideoLinksByIdsInCourseForm(courseForm: CourseForm): CourseForm {
    const lessonMapper = (l: LessonForm) => ({...l, video_link: this.getVideoIdFromRawUrl(l.video_link)!})
    const moduleMapper = (m: ModuleForm) => ({...m, lessons: m.lessons.map(lessonMapper)})

    return {
      ...courseForm,
      modules: courseForm.modules.map(moduleMapper)
    }
  }
}
