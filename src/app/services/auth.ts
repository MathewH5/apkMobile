import { Injectable, inject } from '@angular/core';
import {
  Auth, authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut, User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private users = inject(UserService);

  user$: Observable<User | null> = authState(this.auth);

  currentUser(): User | null {
    return this.auth.currentUser;
  }

  async register({ email, password }: { email: string; password: string; }) {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await this.users.ensureUser(cred.user.uid, {
      email: cred.user.email ?? undefined,
      displayName: cred.user.displayName ?? undefined,
      ...(cred.user.photoURL ? { photoURL: cred.user.photoURL } : {})

    });
    return cred.user;
  }

  async login({ email, password }: { email: string; password: string; }) {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    await this.users.ensureUser(cred.user.uid, {
    email: cred.user.email ?? undefined,
    displayName: cred.user.displayName ?? undefined,
    ...(cred.user.photoURL ? { photoURL: cred.user.photoURL } : {})
    });
    return cred.user;
  }

  logout() {
    return signOut(this.auth);
  }
}
