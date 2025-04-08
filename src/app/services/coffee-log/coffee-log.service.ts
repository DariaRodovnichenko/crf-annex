import {
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import { CoffeeLog } from '../../interfaces/log.model';
import { Database, get, ref, remove, set } from '@angular/fire/database';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoffeeLogService {
  private readonly db = inject(Database);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  constructor() {}

  private async getUid(): Promise<string> {
    return await runInInjectionContext(this.injector, async () => {
      const uid = await firstValueFrom(this.authService.getUid());
      if (!uid) throw new Error('🚫 No UID found');
      return uid;
    });
  }

  async getUserLogs(): Promise<CoffeeLog[]> {
    const uid = await this.getUid();
    return runInInjectionContext(this.injector, async () => {
      const snapshot = await get(ref(this.db, `users/${uid}/coffeeLogs`));
      const logs: CoffeeLog[] = [];

      snapshot.forEach((childSnap) => {
        logs.push(childSnap.val() as CoffeeLog);
        return;
      });

      console.log('📥 Retrieved logs for user:', uid, logs);
      return logs;
    });
  }

  async addUserLog(log: CoffeeLog): Promise<void> {
    const uid = await this.getUid();
    log.id ||= crypto.randomUUID();

    const logPath = `users/${uid}/coffeeLogs/${log.id}`;

    await runInInjectionContext(this.injector, async () => {
      await set(ref(this.db, logPath), log);
      console.log('📤 Writing log to Firebase path:', logPath, log);
    });
  }

  async deleteUserLog(logId: string): Promise<void> {
    const uid = await this.getUid();
    const deletePath = `users/${uid}/coffeeLogs/${logId}`;

    await runInInjectionContext(this.injector, async () => {
      await remove(ref(this.db, deletePath));
      console.log('🗑️ Deleted log at:', deletePath);
    });
  }
}
