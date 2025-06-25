import {Component, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {UserForm} from '../../interfaces/user';
import {isCPF} from 'validation-br';
import {AlertService} from '../../services/alert';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPage {
  fb = inject(FormBuilder)

  form = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', [Validators.required, this.cpfValidator]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  constructor(private userService: UserService, private alertService: AlertService, private router: Router) { }

  onSubmit() {
    if (this.form.invalid) return;

    this.userService.register(this.form.value as UserForm).subscribe({
      next: data => {
        this.alertService.success(`Usuário '${data.name}' criado com sucesso.`)
        this.router.navigateByUrl("/login")
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.error(error.error.detail)
      }
    })
  }

  cpfValidator(formControl: FormControl): ValidationErrors | null {
    if (!isCPF(formControl.value)) return {invalidFormat: true}
    return null
  }
}
