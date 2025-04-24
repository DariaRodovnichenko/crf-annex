import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../data/database.service';
import { CoffeeLog } from '../../interfaces/log.model';

@Injectable({ providedIn: 'root' })
export class LogService {
  private auth = inject(AuthService);
  private db = inject(DatabaseService);

  async addLog(log: CoffeeLog): Promise<void> {
    const user = await firstValueFrom(this.auth.authState$);

    if (user?.isAnonymous) {
      const logs = JSON.parse(localStorage.getItem('coffeeLogs') || '[]');
      logs.push(log);
      localStorage.setItem('coffeeLogs', JSON.stringify(logs));
    } else if (user) {
      await this.db.saveData(`users/${user.uid}/logs/${log.id}`, log);
    }
  }

  async getUserLogs(): Promise<CoffeeLog[]> {
    const user = await firstValueFrom(this.auth.authState$);
    if (!user) return [];

    if (user.isAnonymous) {
      return JSON.parse(localStorage.getItem('coffeeLogs') || '[]');
    }

    const data = await this.db.getData(`users/${user.uid}/logs`);
    return data ? Object.values(data) : [];
  }

  async deleteUserLog(id: string): Promise<void> {
    const user = await firstValueFrom(this.auth.authState$);

    if (user?.isAnonymous) {
      const logs = JSON.parse(localStorage.getItem('coffeeLogs') || '[]');
      const updated = logs.filter((log: CoffeeLog) => log.id !== id);
      localStorage.setItem('coffeeLogs', JSON.stringify(updated));
    } else if (user) {
      await this.db.deleteData(`users/${user.uid}/logs/${id}`);
    }
  }
}

