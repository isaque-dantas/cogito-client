export interface Lesson {
  id: number
  title: string
  position: number
  video_link?: string
  status: LessonStatus
  parent_module_title: string
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

export interface LessonForm {
  title: string
  position: number
  video_link: string
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
