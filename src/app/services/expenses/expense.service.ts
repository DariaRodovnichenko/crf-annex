import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../../interfaces/expense.model';
import { DatabaseService } from '../data/database.service';
import { AuthService } from '../auth/auth.service';
import { CoffeeLog } from '../../interfaces/log.model';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private db: DatabaseService, private auth: AuthService) {}

  async loadExpenses(): Promise<Expense[]> {
    const uid = await this.auth.getUidValue();

    let expenses: Expense[] = [];

    if (uid === null) {
      // Guest mode
      const local = localStorage.getItem('guestExpenses');
      expenses = local ? JSON.parse(local) : [];
    } else {
      // Authenticated user
      const data = await this.db.getData(`users/${uid}/expenses`);
      expenses = data ? Object.values(data) : [];
    }

    this.expensesSubject.next(expenses);
    return expenses;
  }

  async addExpense(expense: Expense): Promise<Expense[]> {
    const uid = await this.auth.getUidValue();

    let current = [expense, ...this.expensesSubject.value];

    if (uid === null) {
      // Guest: save locally
      localStorage.setItem('guestExpenses', JSON.stringify(current));
      console.log('💾 Expense saved locally for guest');
    } else {
      // Authenticated: save to Firebase
      await this.db.saveData(`users/${uid}/expenses/${expense.id}`, expense);
    }

    this.expensesSubject.next(current);
    return current;
  }

  async deleteExpense(id: string): Promise<void> {
    const uid = await this.auth.getUidValue();

    const updated = this.expensesSubject.value.filter((e) => e.id !== id);

    if (uid === null) {
      // Guest: delete from local storage
      localStorage.setItem('guestExpenses', JSON.stringify(updated));
    } else {
      // Authenticated: delete from Firebase
      await this.db.deleteData(`users/${uid}/expenses/${id}`);
    }

    this.expensesSubject.next(updated);
  }

  getTotalFor(expenses: Expense[]): number {
    const raw = expenses.reduce((sum, e) => sum + e.convertedAmount, 0);
    return Math.round(raw * 100) / 100;
  }

  getCoffeeShopTotal(logs: CoffeeLog[]): number {
    return logs
      .filter((l) => l.source === 'Coffee Shop' && l.cost > 0)
      .reduce((sum, l) => sum + l.cost, 0);
  }

  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  async clearAllExpenses(): Promise<void> {
    const uid = await this.auth.getUidValue();

    if (uid === null) {
      localStorage.removeItem('guestExpenses');
    } else {
      await this.db.deleteData(`users/${uid}/expenses`);
    }

    this.expensesSubject.next([]);
  }
}
