import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth.service';
import {AlertService} from '../../services/alert';
import {HttpErrorResponse} from '@angular/common/http';

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

  constructor(private auth: AuthService, private alertService: AlertService, private router: Router) {
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: _ => {
        this.alertService.success("O login foi realizado com sucesso!")
        this.router.navigateByUrl("")
      },
      error: error => {
        let msg: string | null = null

        if (error.status === 401) msg = "E-mail e/ou senha incorretos."
        else if (this.isErrorFromEmail(error)) msg = "O formato de e-mail é inválido."

        if (msg) this.alertService.error(msg)
      },
    })
  }

  isErrorFromEmail(error: HttpErrorResponse) {
    return error.status === 422 && (error.error.detail[0].loc as string[]).includes('email')
  }
}
