import {LessonNestedForm, LessonForm, LessonNestedResponse, LessonNestedFormWithIds} from './lesson';
import {FormArray, FormControl, FormGroup, UntypedFormGroup} from '@angular/forms';
import {LessonFormGroup, LessonFormGroupWithId} from './lesson';

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

export interface ModuleNestedFormWithIds {
  id: number
  title: string
  lessons: LessonNestedFormWithIds[]
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

export interface ModuleFormGroup {
  title: FormControl<string | null>,
  lessons: FormArray<FormGroup<LessonFormGroup>>
}

export interface ModuleFormGroupWithId {
  id: FormControl<number | null>,
  title: FormControl<string | null>,
  lessons: FormArray<FormGroup<LessonFormGroupWithId>>
}
