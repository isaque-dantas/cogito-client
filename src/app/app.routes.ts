import {Routes} from '@angular/router';
import {LoginPage} from './pages/login-page/login-page.component';
import {RegisterPage} from './pages/register-page/register-page.component';
import {HomePage} from './pages/home-page/home-page';
import {CourseDetailPage} from './pages/course-detail-page/course-detail-page';
import {LessonDetailPage} from './pages/lesson-detail-page/lesson-detail-page';
import {CourseEditingPage} from './pages/course-editing-page/course-editing-page';
import {CourseCreationPage} from './pages/course-creation-page/course-creation-page';
import {SearchPage} from './pages/search-page/search-page';
import {coordinatorOnlyGuard} from './auth/coordinator-only-guard';
import {AdminPanelPage} from './pages/admin-panel-page/admin-panel-page';

export const routes: Routes = [
  {path: '', component: HomePage},
  {path: 'cadastro', component: RegisterPage},
  {path: 'login', component: LoginPage},
  {path: 'painel-administrativo', component: AdminPanelPage},
  {path: 'curso/adicionar', component: CourseCreationPage, canActivate: [coordinatorOnlyGuard]},
  {path: 'curso/pesquisar', component: SearchPage},
  {path: 'curso/:id', component: CourseDetailPage},
  {path: 'curso/:id/editar', component: CourseEditingPage, canActivate: [coordinatorOnlyGuard]},
  {path: 'curso/:course_id/aula/:lesson_id', component: LessonDetailPage},
];
