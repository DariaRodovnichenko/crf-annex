import { Injectable, inject } from '@angular/core';
import { DatabaseService } from '../data/database.service';
import { CoffeeLog } from '../../interfaces/log.model';
import { Expense } from '../../interfaces/expense.model';

@Injectable({ providedIn: 'root' })
export class SyncService {
  private dbService = inject(DatabaseService);

  async syncLocalDataToFirebase(uid: string): Promise<void> {
    // TDS sync
    const tdsData = localStorage.getItem('guestTDS');
    if (tdsData) {
      const entries = JSON.parse(tdsData);
      for (const entry of entries) {
        await this.dbService.pushData(`users/${uid}/TDSValues`, entry);
      }
      localStorage.removeItem('guestTDS');
      console.log('☁️ TDS synced to Firebase');
    }

    // Expenses sync
    const expensesData = localStorage.getItem('guestExpenses');
    if (expensesData) {
      const entries: Expense[] = JSON.parse(expensesData);
      for (const exp of entries) {
        await this.dbService.saveData(`users/${uid}/expenses/${exp.id}`, exp);
      }
      localStorage.removeItem('guestExpenses');
      console.log('💰 Expenses synced to Firebase');
    }

    // Logs sync
    const logsData = localStorage.getItem('coffeeLogs');
    if (logsData) {
      const logs: CoffeeLog[] = JSON.parse(logsData);
      for (const log of logs) {
        await this.dbService.saveData(`users/${uid}/logs/${log.id}`, log);
      }
      localStorage.removeItem('coffeeLogs');
      console.log('📘 Logs synced to Firebase');
    }
  }
}
