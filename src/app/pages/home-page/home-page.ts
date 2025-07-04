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

@Component({
  selector: 'app-home-page',
  imports: [
    Header,
    CourseCard,
    AsyncPipe,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  courses$!: Observable<Course[]>
  courseService = inject(CourseService)
  authService = inject(AuthService)
  router = inject(Router)

  courseSearchFormControl!: FormControl<string | null>

  ngOnInit() {
    this.courseSearchFormControl = new FormControl('', Validators.required)

    this.courses$ = this.courseService.getAll()
    this.courseSearchFormControl.valueChanges.subscribe(console.log)
    console.log(this.courseSearchFormControl.value)
  }

  isUserStillDoingInAtLeastOneCourse(courses: Course[]) {
    return courses.some(c => c.is_subscribed && !c.has_user_finished)
  }

  hasUserFinishedAtLeastOneCourse(courses: Course[]) {
    return courses.some(c => c.has_user_finished)
  }

  searchCoursesMatching(value: string | null) {
    if (!value) return;
    this.router.navigate(["curso", "pesquisar"], {queryParams: {'q': value}})
  }
}
