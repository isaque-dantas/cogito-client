import {Component, EventEmitter, input, OnDestroy, OnInit, output, Output, signal} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
// import { LessonTypeFormComponent, LessonType } from './lesson-type-form';
import {LessonType} from '../../interfaces/lesson';
import {LessonContent} from '../lesson-content/lesson-content';
import {LessonTypeForm} from '../lesson-type-form/lesson-type-form';

@Component({
  selector: 'app-lesson-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LessonContent,
    LessonTypeForm
  ],
  templateUrl: './lesson-form.html',
  styleUrl: './lesson-form.css'
})
export class LessonForm implements OnInit, OnDestroy {
  showDeleteButton = input<boolean>(true)
  form = input<FormGroup>()
  lessonIndex = input<number>();
  moduleIndex = input<number>(0)

  currentLessonType = signal<LessonType>(LessonType.VIDEO);
  onDeleteCallback = output<{moduleIndex: number, lessonIndex: number}>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.form()!.controls['type'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((type: LessonType) => {
        this.currentLessonType.set(type);
        this.form()!.controls['content'].setValue('');
      });

    console.log(this.form())
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDelete() {
    this.onDeleteCallback.emit({
      moduleIndex: this.moduleIndex(),
      lessonIndex: this.lessonIndex()!
    })
  }

  getFormControl(control: AbstractControl) {
    return control as FormControl<any>
  }
}
