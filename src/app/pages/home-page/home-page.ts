import {Component, effect, inject} from '@angular/core';
import {Header} from '../../components/header/header';
import {CourseCard} from '../../components/course-card/course-card';
import {Course} from '../../interfaces/course';
import {CourseService as CourseService} from '../../services/course.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [
    Header,
    CourseCard,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {
  courses$!: Observable<Course[]>
  courseService = inject(CourseService)

  constructor() {
    effect(() => {
      this.courses$ = this.courseService.getAll()
    });
  }

  isUserSubscribedInAtLeastOneCourse(courses: Course[]) {
    return courses.some(c => c.is_subscribed)
  }
}
