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
  EmailAuthProvider,
  linkWithCredential,
} from '@angular/fire/auth';
import { map, Observable } from 'rxjs';
import { DatabaseService } from '../data/database.service';
import { get, ref } from '@angular/fire/database';
import { Database } from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(Injector);
  private readonly dbService = inject(DatabaseService);
  private readonly db = inject(Database);

  readonly authState$: Observable<User | null> = authState(this.auth);

  login(email: string, password: string) {
    return runInInjectionContext(this.injector, () =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  async loginAnonymously() {
    return runInInjectionContext(this.injector, async () => {
      const cred = await signInAnonymously(this.auth);
      const user = cred.user;

      if (!user) throw new Error('Anonymous sign-in failed.');

      const uid = user.uid;
      const snapshot = await get(ref(this.db, `users/${uid}`));

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

      console.log('🧠 Firebase Anonymous UID:', uid);
      console.log('🧠 Is Anonymous:', user.isAnonymous);
      console.log('🧠 Email:', user.email);

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
    return this.authState$.pipe(
      map((user) => {
        console.log('🧠 getUid(): Current Firebase UID:', user?.uid);
        return user?.uid ?? null;
      })
    );
  }

  async upgradeAnonymousAccount(
    email: string,
    password: string
  ): Promise<void> {
    return runInInjectionContext(this.injector, async () => {
      const user = this.auth.currentUser;

      if (!user?.isAnonymous) {
        throw new Error('No anonymous user to upgrade.');
      }

      const credential = EmailAuthProvider.credential(email, password);

      try {
        const result = await linkWithCredential(user, credential);
        console.log('✅ Anonymous account upgraded to:', result.user);

        await this.dbService.updateData(`users/${user.uid}`, {
          email: result.user.email,
          role: 'registered',
        });

        console.log('📦 DB user info updated.');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          console.warn('🔁 Email already in use. Attempting regular login...');
          await this.login(email, password);
          console.log('✅ Logged in as existing user'); // ← more accurate log
        } else {
          throw error;
        }
      }
    });
  }
}
