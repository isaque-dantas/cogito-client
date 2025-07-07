import {Component, effect, inject} from '@angular/core';
import {Header} from '../../components/header/header';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {Course, CourseWithCoordinatorInfo} from '../../interfaces/course';
import {CourseService} from '../../services/course.service';

@Component({
  selector: 'app-admin-panel-page',
  imports: [
    Header,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './admin-panel-page.html',
  styleUrl: './admin-panel-page.css'
})
export class AdminPanelPage {
  private courseService = inject(CourseService);
  courses$?: Observable<CourseWithCoordinatorInfo[]>;

  constructor() {
    effect(() => this.courses$ = this.courseService.getAllWithCoordinatorInfo())
  }
}
