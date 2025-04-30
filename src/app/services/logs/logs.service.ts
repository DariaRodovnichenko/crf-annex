import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../data/database.service';
import { CoffeeLog } from '../../interfaces/log.model';

@Injectable({ providedIn: 'root' })
export class LogService {
  private auth = inject(AuthService);
  private db = inject(DatabaseService);
  private storageKey = 'coffeeLogs';

  async addLog(log: CoffeeLog): Promise<void> {
    const user = await this.auth.getCurrentUser();
    log.id ||= crypto.randomUUID(); // ensure ID

    if (user?.isAnonymous) {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      logs.push(log);
      localStorage.setItem(this.storageKey, JSON.stringify(logs));
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
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }

    const data = await this.db.getData(`users/${user.uid}/logs`);
    return data ? Object.values(data) : [];
  }

  async deleteUserLog(id: string): Promise<void> {
    const user = await this.auth.getCurrentUser();

    if (user?.isAnonymous) {
      const logs = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      const updated = logs.filter((log: CoffeeLog) => log.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
      console.log('🗑️ Log deleted locally (guest)');
    } else if (user) {
      const path = `users/${user.uid}/logs/${id}`;
      await this.db.deleteData(path);
      console.log('🗑️ Log deleted from Firebase');
    }
  }
}
