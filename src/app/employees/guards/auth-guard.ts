import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const isAuthorized = sessionStorage.getItem('canManageEmployees') === 'true';

  if(isAuthorized){
    return true;
  }

  return router.createUrlTree(['/access-denied'])
  
};
