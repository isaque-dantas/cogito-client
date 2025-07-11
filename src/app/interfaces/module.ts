import {LessonNestedForm, LessonForm, LessonNestedResponse, LessonNestedFormWithIds, LessonUpdateForm} from './lesson';
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

export interface ModuleNestedResponse {
  id: number
  title: string
  position: number
}

export interface ModuleNestedFormWithIds {
  id: number
  title: string
  lessons: LessonNestedFormWithIds[],
  position: number
}

export interface ModuleForm {
  title: string
  position: number
  lessons: LessonNestedForm[]
}

export interface ModuleUpdateForm {
  title: string | null
  position: number | null
}

export interface ModuleFormGroup {
  title: FormControl<string | null>,
  lessons: FormArray<FormGroup<LessonFormGroup>>
}

export interface ModuleFormGroupWithId {
  id: FormControl<number | null>,
  title: FormControl<string | null>,
  lessons: FormArray<FormGroup<LessonFormGroupWithId>>,
  position: FormControl<number | null>
}

export interface ModuleUpdateData {
  id: number
  data: ModuleUpdateForm
  formGroup: FormGroup<ModuleFormGroupWithId>
}

export interface ModuleCreationData {
  courseId: number
  data: ModuleForm
  formGroup: FormGroup<ModuleFormGroupWithId>
}
