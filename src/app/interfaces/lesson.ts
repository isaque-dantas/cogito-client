export interface Lesson {
  id: number
  title: string
  position: number
  video_link?: string
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
