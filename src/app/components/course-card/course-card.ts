import {Component, Input} from '@angular/core';
import {Course} from '../../interfaces/course';
import {RouterLink} from '@angular/router';
import {PercentagePipe} from '../../pipes/percentage-pipe';

@Component({
  selector: 'app-course-card',
  imports: [
    RouterLink,
    PercentagePipe
  ],
  templateUrl: './course-card.html',
})
export class CourseCard {
  @Input() course!: Course
}
