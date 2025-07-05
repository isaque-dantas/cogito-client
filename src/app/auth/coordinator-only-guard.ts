import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {AlertService} from '../services/alert';

export const coordinatorOnlyGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const alert = inject(AlertService)

  if (!auth.isLoggedUserCoordinator()) {
    router.navigateByUrl('')
      .then(() => alert.error("Você não tem permissão para acessar essa página. Faça login e tente novamente."))
    return false
  }

  return true
};
