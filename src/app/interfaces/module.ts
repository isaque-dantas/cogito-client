import {LessonNestedForm, LessonForm, LessonNestedResponse} from './lesson';

export interface Module {
  id: number
  title: string
  position: number
  lessons: LessonNestedResponse[]
}

export interface ModuleNestedForm {
  title: string
  lessons: LessonNestedForm[]
}

export interface ModuleForm {
  title: string
  position: number
  lessons: LessonForm[]
}

export interface ModuleUpdateForm {
  title: string
  position: number
}
