import {Component, effect, inject, OnInit} from '@angular/core';
import {Header} from '../../components/header/header';
import {CourseCard} from '../../components/course-card/course-card';
import {Course} from '../../interfaces/course';
import {CourseService as CourseService} from '../../services/course.service';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {SearchForm} from '../../components/search-form/search-form';

@Component({
  selector: 'app-home-page',
  imports: [
    Header,
    CourseCard,
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule,
    SearchForm
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  courses$!: Observable<Course[]>
  courseService = inject(CourseService)
  authService = inject(AuthService)
  router = inject(Router)

  ngOnInit() {
    this.courses$ = this.courseService.getAll()
  }

  isUserStillDoingInAtLeastOneCourse(courses: Course[]) {
    return courses.some(c => c.is_subscribed && !c.has_user_finished)
  }

  hasUserFinishedAtLeastOneCourse(courses: Course[]) {
    return courses.some(c => c.has_user_finished)
  }

  goToSearchPageWithSearchQuery(searchQuery: string) {
    this.router.navigate(['curso', 'pesquisar'], {queryParams: {q: searchQuery}})
  }
}
