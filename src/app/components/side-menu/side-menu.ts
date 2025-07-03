import {Component, Input} from '@angular/core';
import {Course} from '../../interfaces/course';
import {LessonStatus} from '../../interfaces/lesson';
import {LessonTitlePipe} from '../../pipes/lesson-title-pipe';
import {ModuleTitlePipe} from '../../pipes/module-title-pipe';

@Component({
  selector: 'app-side-menu',
  imports: [
    LessonTitlePipe,
    ModuleTitlePipe
  ],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenu {
  @Input() course!: Course;

  protected readonly LessonStatus = LessonStatus;
}
