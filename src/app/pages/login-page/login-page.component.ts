import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {AuthService} from '../../services/auth.service';

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

  constructor(private authService: AuthService) { }

  onSubmit() {
    if (this.form.invalid) return;

    this.authService.login(this.form.value.email!, this.form.value.password!).subscribe({
      next: result => console.log(result),
      error: error => console.error(error),
    })
  }
}
