import { Component, effect, inject } from '@angular/core';
import {Header} from '../../components/header/header';
import {SideMenu} from '../../components/side-menu/side-menu';
import {ActivatedRoute, Router} from '@angular/router';
import {Course} from '../../interfaces/course';
import {CourseService} from '../../services/course.service';
import {AlertService} from '../../services/alert';
import {Observable} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-course-detail-page',
  imports: [
    Header,
    SideMenu,
    AsyncPipe
  ],
  templateUrl: './course-detail-page.html',
  styleUrl: './course-detail-page.css'
})
export class CourseDetailPage {
  private activatedRoute = inject(ActivatedRoute);
  private courseService = inject(CourseService);
  private alertService = inject(AlertService);
  private router = inject(Router);
  course$?: Observable<Course>

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      const courseId = params['id']

      if (!courseId) {
        this.alertService.error('É preciso informar o ID do curso.')
        this.router.navigateByUrl('/')
        return;
      }

      effect(() => this.course$ = this.courseService.getById(params['id']))
    });
  }
}
