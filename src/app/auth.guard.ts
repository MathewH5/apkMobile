import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

export const authGuard = async () => {
  const auth = inject(Auth);
  const router = inject(Router);
  const u = auth.currentUser ?? await new Promise(r => {
    const off = auth.onAuthStateChanged(x => { off(); r(x); });
  });
  if (!u) {
    router.navigateByUrl('/login');
    return false;
  }
  return true;
};
