import {Module, ModuleFormGroup, ModuleFormGroupWithId, ModuleNestedForm, ModuleNestedFormWithIds} from './module';
import {User} from './user';
import {FormArray, FormControl, FormGroup, UntypedFormGroup} from '@angular/forms';

export interface Course {
  id: number
  title: string
  modules: Module[]
  user_who_created: User
  is_subscribed: boolean
  progress_level_percentage?: number
  has_user_finished?: boolean
}

export interface CourseWithCoordinatorInfo {
  id: number;
  title: string;
  not_subscribed_students: number;
  subscribed_students: number;
  students_who_finished: number;
}

export interface CourseForm {
  title: string
  modules: ModuleNestedForm[]
}

export interface CoursePatchForm {
  title: string
}

export interface CourseFormWithIds {
  id: number
  title: string
  modules: ModuleNestedFormWithIds[]
}

export interface CourseFormGroup {
  title: FormControl<string | null>,
  modules: FormArray<FormGroup<ModuleFormGroup>>
}

export interface CourseFormGroupWithId {
  id: FormControl<number | null>,
  title: FormControl<string | null>,
  modules: FormArray<FormGroup<ModuleFormGroupWithId>>
}
