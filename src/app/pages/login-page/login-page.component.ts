import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth.service';
import {AlertService} from '../../services/alert';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPage {
  fb = inject(FormBuilder)

  form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
  })

  constructor(private auth: AuthService, private alert: AlertService) { }

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: result => this.alert.success("O login foi realizado com sucesso!"),
      error: error => {
        if (error.status === 401) this.alert.error("E-mail e/ou senha incorretos.")
        else if (error.status === 500) this.alert.error("Houve um erro inesperado. Contate o administrador do sistema.")
      },
    })
  }
}
