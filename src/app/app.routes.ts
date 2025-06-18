import {Routes} from '@angular/router';
import {LoginPage} from './pages/login-page/login-page.component';
import {RegisterPage} from './pages/register-page/register-page.component';
import {HomePage} from './pages/home-page/home-page';

export const routes: Routes = [
  {path: '', component: HomePage},
  {path: 'cadastro', component: RegisterPage},
  {path: 'login', component: LoginPage},
];
