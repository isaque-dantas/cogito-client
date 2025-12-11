import {FormControl, FormGroup} from '@angular/forms';
import {ModuleForm, ModuleNestedResponse} from './module';

export interface Lesson {
  id: number
  title: string
  position: number
  content?: string
  type: LessonType
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
  content?: string
  type: LessonType
  status: LessonStatus
}

export interface LessonNestedForm {
  title: string
  content: string
  type: LessonType
}

export interface LessonNestedFormWithIds {
  id: number
  title: string
  content: string,
  type: LessonType
  position: number
}

export interface LessonForm {
  title: string
  position: number
  content: string
  type: LessonType
}

export interface LessonUpdateForm {
  title: string | null
  position: number | null
  content: string | null
  type: LessonType
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
  content: FormControl<string | null>
  type: FormControl<LessonType | null>
}

export interface LessonFormGroupWithId {
  id: FormControl<number | null>,
  title: FormControl<string | null>,
  content: FormControl<string | null>,
  type: FormControl<LessonType | null>
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

export enum LessonType {
  VIDEO = "video",
  DOCUMENT = "document",
  FILE = "file",
}

export const DEFAULT_LESSON_TYPE = LessonType.VIDEO
