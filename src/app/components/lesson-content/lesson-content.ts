import {Component, forwardRef, input} from '@angular/core';
import {DEFAULT_LESSON_TYPE, LessonType} from '../../interfaces/lesson';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-lesson-content',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './lesson-content.html',
  styleUrl: './lesson-content.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LessonContent),
      multi: true
    }
  ]
})
export class LessonContent implements ControlValueAccessor {
  value: string | null = null;
  isDisabled = false;

  moduleIndex = input<number>()
  lessonIndex = input<number>()
  formControl = input<FormControl>()

  private onChange: (value: string | null) => void = () => { };
  private onTouched: () => void = () => { };
  lessonType = input<LessonType>(DEFAULT_LESSON_TYPE);
  showErrors = input<boolean>(false);

  onChangeInputValue(event: Event) {
    const newValue = (event.target as HTMLInputElement).value
    this.value = newValue
    this.onChange(newValue)
    this.onTouched()
  }

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  protected readonly LessonType = LessonType;
}
