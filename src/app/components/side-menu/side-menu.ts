import {Component, Input} from '@angular/core';
import {Course} from '../../interfaces/course';
import {LessonStatus} from '../../interfaces/lesson';

@Component({
  selector: 'app-side-menu',
  imports: [],
  templateUrl: './side-menu.html',
  styleUrl: './side-menu.css'
})
export class SideMenu {
  @Input() course!: Course;

  protected readonly LessonStatus = LessonStatus;
}
