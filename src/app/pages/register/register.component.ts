import {Component, inject} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {UserForm} from '../../interfaces/user';
import {isCPF} from 'validation-br';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  fb = inject(FormBuilder)

  form = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', [Validators.required, this.cpfValidator]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  constructor(private userService: UserService) { }

  onSubmit() {
    if (this.form.invalid) return;

    this.userService.register(this.form.value as UserForm).subscribe({
      next: data => console.log("Usuário criado com sucesso!", data),
      error: error => {
      }
    })
  }

  cpfValidator(formControl: FormControl): ValidationErrors | null {
    if (!isCPF(formControl.value)) return {invalidFormat: true}
    return null
  }
}
