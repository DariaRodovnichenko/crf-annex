import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../data/database.service';
import { CoffeeLog } from '../../interfaces/log.model';
import { LocalStorageService } from '../local-storage/local-storage.service';

@Injectable({ providedIn: 'root' })
export class LogService {
  private auth = inject(AuthService);
  private db = inject(DatabaseService);
  private local = inject(LocalStorageService);
  private storageKey = 'coffeeLogs';

  async addLog(log: CoffeeLog): Promise<void> {
    const user = await this.auth.getCurrentUser();
    log.id ||= crypto.randomUUID(); // ensure ID

    if (user?.isAnonymous) {
      const logs = (await this.local.get<CoffeeLog[]>(this.storageKey)) || [];
      logs.push(log);
      await this.local.save(this.storageKey, logs);
      console.log('📦 Log saved locally (guest)');
    } else if (user) {
      const path = `users/${user.uid}/logs/${log.id}`;
      await this.db.saveData(path, log);
      console.log('☁️ Log saved to Firebase');
    }
  }

  async getUserLogs(): Promise<CoffeeLog[]> {
    const user = await this.auth.getCurrentUser();
    if (!user) return [];

    if (user.isAnonymous) {
       return (await this.local.get<CoffeeLog[]>(this.storageKey)) || [];
    }

    return await this.db.getUserLogs(user.uid);
  }

  async deleteUserLog(id: string): Promise<void> {
    const user = await this.auth.getCurrentUser();

    if (user?.isAnonymous) {
       const logs = (await this.local.get<CoffeeLog[]>(this.storageKey)) || [];
       const updated = logs.filter((log) => log.id !== id);
       await this.local.save(this.storageKey, updated);
       console.log('🗑️ Log deleted locally (guest)');
    } else if (user) {
      const path = `users/${user.uid}/logs/${id}`;
      await this.db.deleteData(path);
      console.log('🗑️ Log deleted from Firebase');
    }
  }
}
