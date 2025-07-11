import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Header} from '../../components/header/header';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {AlertService} from '../../services/alert';
import {SearchForm} from '../../components/search-form/search-form';
import {Observable} from 'rxjs';
import {Course} from '../../interfaces/course';
import {CourseService} from '../../services/course.service';
import {AsyncPipe} from '@angular/common';
import {CourseCard} from '../../components/course-card/course-card';
import {BreadcrumbLister} from '../../components/breadcumb-lister/breadcrumb-lister.component';

@Component({
  selector: 'app-search-page',
  imports: [
    Header,
    SearchForm,
    AsyncPipe,
    CourseCard,
    BreadcrumbLister
  ],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css'
})
export class SearchPage implements OnInit {
  private courseService = inject(CourseService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  searchQuery = signal<string>('')
  courses$!: Observable<Course[]>

  breadcrumbs = [{label: 'Início', url: '/'}, {label: 'Pesquisar'}]

  constructor() {
    effect(() => {
      const navigationOptions: NavigationExtras = {
        queryParams: {"q": this.searchQuery()},
        onSameUrlNavigation: 'ignore'
      }
      this.router.navigate(['curso', 'pesquisar'], navigationOptions)

      this.courses$ = this.courseService.searchByTitle(this.searchQuery())
    })
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => this.searchQuery.set(params["q"]))
  }

  searchCourses(searchQuery: string) {
    this.searchQuery.set(searchQuery)
  }
}
