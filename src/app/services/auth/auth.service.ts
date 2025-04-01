import {
  Injectable,
  inject,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  signOut,
  User,
} from '@angular/fire/auth';
import { signInAnonymously } from 'firebase/auth';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector);

  readonly authState$: Observable<User | null> = authState(this.auth);

  login(email: string, password: string) {
    return runInInjectionContext(this.injector, () => {
      return signInWithEmailAndPassword(this.auth, email, password);
    });
  }

  loginAnonymously() {
    return signInAnonymously(this.auth);
  }

  logout() {
    return runInInjectionContext(this.injector, () => {
      return signOut(this.auth);
    });
  }

  getUid(): Observable<string | null> {
    return this.authState$.pipe(map((user) => user?.uid ?? null));
  }
}
