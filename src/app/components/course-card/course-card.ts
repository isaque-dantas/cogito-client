import {Component, Input} from '@angular/core';
import {Course} from '../../interfaces/course';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-course-card',
  imports: [
    RouterLink
  ],
  templateUrl: './course-card.html',
  styleUrl: './course-card.css'
})
export class CourseCard {
  @Input() course!: Course
}
