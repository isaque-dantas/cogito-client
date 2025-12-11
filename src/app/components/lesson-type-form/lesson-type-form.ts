import {AfterViewInit, Component, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {DEFAULT_LESSON_TYPE} from '../../interfaces/lesson';

export enum LessonType {
  VIDEO = "video",
  DOCUMENT = "document",
  FILE = "file",
}

@Component({
  selector: 'app-lesson-type-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'lesson-type-form.html',
  styleUrl: 'lesson-type-form.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LessonTypeForm),
      multi: true
    }
  ]
})
export class LessonTypeForm implements ControlValueAccessor, AfterViewInit {
  value: LessonType = DEFAULT_LESSON_TYPE;
  isDisabled = false;

  lessonTypes = [
    { value: LessonType.VIDEO, label: 'Vídeo', icon: 'videocam' },
    { value: LessonType.DOCUMENT, label: 'Documento', icon: 'article' },
    { value: LessonType.FILE, label: 'Arquivo', icon: 'attach_file' }
  ];

  private onChange: (value: LessonType | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit() {
    this.onTypeChange(DEFAULT_LESSON_TYPE)
  }

  onTypeChange(type: LessonType) {
    if (this.isDisabled) return;

    this.value = type;
    this.onChange(type);
    this.onTouched();
  }

  writeValue(value: LessonType): void {
    this.value = value;
  }

  registerOnChange(fn: (value: LessonType | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  isSelected(lessonType: LessonType) {
    return lessonType === this.value
  }
}
