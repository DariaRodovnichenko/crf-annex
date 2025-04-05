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
  signInAnonymously,
  User,
} from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { DatabaseService } from '../data/database.service';
import { get, ref } from '@angular/fire/database';
import { Database } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private injector = inject(Injector);
  private dbService = inject(DatabaseService);
  private db = inject(Database);

  readonly authState$: Observable<User | null> = authState(this.auth);

  login(email: string, password: string) {
    return runInInjectionContext(this.injector, () => {
      return signInWithEmailAndPassword(this.auth, email, password);
    });
  }

  async loginAnonymously() {
    return runInInjectionContext(this.injector, async () => {
      const cred = await signInAnonymously(this.auth);
      const uid = cred.user.uid;

      // Check if user already exists in DB
      const userRef = ref(this.db, `users/${uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        await this.dbService.saveData(`users/${uid}`, {
          uid,
          role: 'guest',
          username: `guest-${uid.slice(0, 5)}`,
          email: null,
          createdAt: new Date().toISOString(),
        });
        console.log('👻 Guest user saved to DB');
      } else {
        console.log('👤 Guest already exists in DB');
      }

      // Also log Firebase Auth user data
      console.log('🧠 Firebase Anonymous User:', cred.user);

      return cred;
    });
  }

  async logout() {
    return runInInjectionContext(this.injector, async () => {
      await signOut(this.auth);
      console.log('🚪 Logged out');

      // Immediately create a new anonymous session
      await this.loginAnonymously();
    });
  }

  getUid(): Observable<string | null> {
    return this.authState$.pipe(map((user) => user?.uid ?? null));
  }
}
