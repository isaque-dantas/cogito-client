import {Module, ModuleForm} from './module';
import {User} from './user';

export interface Course {
  id: number
  title: string
  modules: Module[]
  user_who_created: User
  is_subscribed: boolean
}

export interface CourseForm {
  title: string
  modules: ModuleForm[]
}
