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
import { SyncService } from '../sync/sync.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(Injector);
  private readonly dbService = inject(DatabaseService);
  private readonly syncService = inject(SyncService);

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

      // Skip writing to Firebase for guests
      console.log('👻 Guest session started (local only)');
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
      if (!user?.isAnonymous) throw new Error('No anonymous user to upgrade.');

      const credential = EmailAuthProvider.credential(email, password);
      try {
        const result = await linkWithCredential(user, credential);
        await this.dbService.updateData(`users/${user.uid}`, {
          email: result.user.email,
          role: 'registered',
        });
        console.log('📦 DB user info updated.');

        // Sync
        await this.syncService.syncLocalDataToFirebase(result.user.uid);

        console.log('📦 DB user info updated & guest data synced');
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          await this.login(email, password);
          const currentUser = this.auth.currentUser;
          if (currentUser) {
            await this.syncService.syncLocalDataToFirebase(currentUser.uid);
            console.log('✅ Logged in and synced to existing user');
          }
        } else {
          throw error;
        }
      }
    });
  }
}
