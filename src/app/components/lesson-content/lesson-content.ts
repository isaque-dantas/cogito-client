import {Component, computed, ElementRef, forwardRef, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {LessonType} from '../../interfaces/lesson';
import {LessonFormService} from '../../services/lesson-form-service';
import {Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar} from 'ngx-editor';

@Component({
  selector: 'app-lesson-content',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgxEditorComponent,
    NgxEditorMenuComponent
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LessonContent),
      multi: true
    }
  ],
  templateUrl: './lesson-content.html',
  styleUrl: './lesson-content.css',
})
export class LessonContent implements ControlValueAccessor, OnInit, OnDestroy {
  lessonFormService = inject(LessonFormService)

  selectedModuleIndex = input<number>(0)
  lessonIndex = input<number>(0)
  validationErrors = input<ValidationErrors | null>(null);
  type = input<LessonType>(this.lessonFormService.defaultLessonType());

  content = signal<Record<string, unknown> | null | string>(null)
  lessonId = computed(() => `lesson-content-${this.selectedModuleIndex()}-${this.lessonIndex()}`)
  labelByType = computed(() => {
    let labelsByTypes = new Map([
      [LessonType.VIDEO, "Link do vídeo"],
      [LessonType.DOCUMENT, "Conteúdo da aula"],
      [LessonType.FILE, "Arquivo da aula"],
    ])

    return labelsByTypes.get(this.type())
  });

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{heading: ['h1', 'h2', 'h3']}],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  protected readonly LessonType = LessonType;

  ngOnInit(): void {
    console.log(`ngOnInit: ${this.lessonId()}`)

    this.editor = new Editor();
    this.editor.valueChanges.subscribe((value) => {
      if (this.type() !== LessonType.DOCUMENT) return;

      console.log(`editor changed: ${this.lessonId()}`, value)

      this.content.set(value)
      this.onChanged(value)
    });
  }

  ngOnDestroy(): void {
    if (this.editor) this.editor.destroy();
  }

  onChanged: Function = () => { };
  onTouched: Function = () => { };

  registerOnChange(fn: Function) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  writeValue(value: string | null): void {
    const actionByType = new Map([
      [
        LessonType.VIDEO,
        () => this.content.set(value)
      ],

      [
        LessonType.DOCUMENT,
        () => {
          console.log(`in writeValue DOCUMENT: ${this.lessonId()}; '${value}'`, value)
          this.content.set(value)
          this.editor.setContent(value)
        }
      ],

      [
        LessonType.FILE,
        () => console.log("TODO!")
      ],
    ])

    actionByType.get(this.type())!()
  }

  writeValueFromEvent(event: Event) {
    const changedValue = (event.target as HTMLInputElement).value
    this.content.set(changedValue)
    this.onChanged(changedValue)
  }
}
