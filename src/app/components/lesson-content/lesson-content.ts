import {Component, computed, effect, forwardRef, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {LessonType} from '../../interfaces/lesson';
import {LessonFormService} from '../../services/lesson-form-service';
import {NgxEditorComponent, Editor, NgxEditorMenuComponent, Toolbar, toHTML} from 'ngx-editor';

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
  lessonAsDocumentContent = signal<Record<string, unknown> | null>(null)

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
    [{ heading: ['h1', 'h2', 'h3'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  constructor() {
    effect(() => this.onChanged(this.lessonAsDocumentContent()));
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.editor.valueChanges.subscribe((value) => this.lessonAsDocumentContent.set(value));
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onChanged: Function = () => { };
  onTouched: Function = () => { };

  registerOnChange(fn: Function) {
    this.onChanged = fn;
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  writeValue(_: any): void {
  }

  writeValueFromEvent(event: Event) {
    const changedValue = (event.target as HTMLInputElement).value
    this.onChanged(changedValue)
  }

  protected readonly LessonType = LessonType;
}
