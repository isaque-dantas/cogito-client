import {Module, ModuleForm, ModuleNestedForm} from './module';
import {User} from './user';

export interface Course {
  id: number
  title: string
  modules: Module[]
  user_who_created: User
  is_subscribed: boolean
  progress_level_percentage?: number
  has_user_finished?: boolean
}

export interface CourseForm {
  title: string
  modules: ModuleNestedForm[]
}

export interface CoursePatchForm {
  title: string
}
