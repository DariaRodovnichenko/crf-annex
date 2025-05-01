import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  authState,
  EmailAuthProvider,
  linkWithCredential,
  User,
} from '@angular/fire/auth';
import { Observable, firstValueFrom, map } from 'rxjs';
import { DatabaseService } from '../data/database.service';
import { SyncService } from '../sync/sync.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private db = inject(DatabaseService);
  private sync = inject(SyncService);

  readonly authState$: Observable<User | null> = authState(this.auth);

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginAnonymously() {
    const cred = await signInAnonymously(this.auth);
    const user = cred.user;
    if (!user) throw new Error('Anonymous sign-in failed.');
    console.log('👻 Guest session started');
    return user;
  }

  async logout() {
    await signOut(this.auth);
    console.log('🚪 Logged out');
    await this.loginAnonymously();
  }

  async getUidValue(): Promise<string | null> {
    const user = await firstValueFrom(this.authState$);
    return user?.uid ?? null;
  }

  async getCurrentUser(): Promise<User | null> {
    return firstValueFrom(this.authState$);
  }

  async upgradeAnonymousAccount(
    email: string,
    password: string
  ): Promise<void> {
    const user = this.auth.currentUser;
    if (!user?.isAnonymous) throw new Error('No anonymous user to upgrade.');

    const credential = EmailAuthProvider.credential(email, password);
    try {
      const result = await linkWithCredential(user, credential);
      console.log('✅ Upgraded anonymous user:', result.user);

      await this.db.updateData(`users/${user.uid}`, {
        email: result.user.email,
        role: 'user',
      });

      await this.sync.syncLocalDataToFirebase(user.uid);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.warn('🔁 Email already in use. Trying fallback login...');
        try {
          await this.login(email, password);
          const uid = (await firstValueFrom(this.authState$))?.uid;
          if (uid) await this.sync.syncLocalDataToFirebase(uid);
        } catch (loginErr) {
          console.error('❌ Fallback login failed', loginErr);
          throw loginErr;
        }
      } else {
        console.error('❌ Upgrade failed:', error);
        throw error;
      }
    }
  }
}
