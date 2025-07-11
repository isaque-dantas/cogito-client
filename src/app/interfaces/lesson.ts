import {FormControl, FormGroup} from '@angular/forms';
import {ModuleForm, ModuleNestedResponse} from './module';

export interface Lesson {
  id: number
  title: string
  position: number
  video_link?: string
  status: LessonStatus
  parent_module: ModuleNestedResponse
  parent_course_title: string
  position_related_to_course: string
  previous_lesson_id?: number
  next_lesson_id?: number
}

export interface LessonNestedResponse {
  id: number
  title: string
  position: number
  video_link?: string
  status: LessonStatus
}

export interface LessonNestedForm {
  title: string
  video_link: string
}

export interface LessonNestedFormWithIds {
  id: number
  title: string
  video_link: string,
  position: number
}

export interface LessonForm {
  title: string
  position: number
  video_link: string
}

export interface LessonUpdateForm {
  title: string | null
  position: number | null
  video_link: string | null
}


export enum LessonStatus {
  LOCKED = "LOCKED",
  ACCESSIBLE = "ACCESSIBLE",
  ACCESSED = "ACCESSED"
}

export enum LessonPositionRelatedToCourse {
  FIRST = "first",
  MIDDLE = "middle",
  LAST = "last",
}

export interface LessonFormGroup {
  title: FormControl<string | null>,
  video_link: FormControl<string | null>
}

export interface LessonFormGroupWithId {
  id: FormControl<number | null>,
  title: FormControl<string | null>,
  video_link: FormControl<string | null>,
  position: FormControl<number | null>
}

export interface LessonUpdateData {
  id: number
  data: LessonUpdateForm
  formGroup: FormGroup<LessonFormGroupWithId>
}

export interface LessonCreationData {
  moduleId: number
  data: LessonForm
  formGroup: FormGroup<LessonFormGroupWithId>
}
