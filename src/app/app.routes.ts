import {Routes} from '@angular/router';
import {LoginPage} from './pages/login-page/login-page.component';
import {RegisterPage} from './pages/register-page/register-page.component';
import {HomePage} from './pages/home-page/home-page';
import {CourseDetailPage} from './pages/course-detail-page/course-detail-page';
import {LessonDetailPage} from './pages/lesson-detail-page/lesson-detail-page';
import {CourseEditingPage} from './pages/course-editing-page/course-editing-page';
import {CourseCreationPage} from './pages/course-creation-page/course-creation-page';
import {SearchPage} from './pages/search-page/search-page';

export const routes: Routes = [
  {path: '', component: HomePage},
  {path: 'cadastro', component: RegisterPage},
  {path: 'login', component: LoginPage},
  {path: 'curso/adicionar', component: CourseCreationPage},
  {path: 'curso/pesquisar', component: SearchPage},
  {path: 'curso/:id', component: CourseDetailPage},
  {path: 'curso/:id/editar', component: CourseEditingPage},
  {path: 'curso/:course_id/aula/:lesson_id', component: LessonDetailPage},
];
