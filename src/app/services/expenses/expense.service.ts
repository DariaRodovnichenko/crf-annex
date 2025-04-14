import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../../interfaces/expense.model';
import { DatabaseService } from '../data/database.service';
import { AuthService } from '../auth/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private db: DatabaseService, private auth: AuthService) {}

  async loadExpenses(): Promise<Expense[]> {
    const uid = await firstValueFrom(this.auth.getUid());
    const data = await this.db.getData(`users/${uid}/expenses`);
    const expenses = data ? (Object.values(data) as Expense[]) : [];
    this.expensesSubject.next(expenses);
    return expenses;
  }

  async addExpense(expense: Expense): Promise<Expense[]> {
    const uid = await firstValueFrom(this.auth.getUid());
    await this.db.saveData(`users/${uid}/expenses/${expense.id}`, expense);
    const current = [expense, ...this.expensesSubject.value];
    this.expensesSubject.next(current);
    return current;
  }

  async deleteExpense(id: string): Promise<void> {
    const uid = await firstValueFrom(this.auth.getUid());
    await this.db.deleteData(`users/${uid}/expenses/${id}`);
    const updated = this.expensesSubject.value.filter((e) => e.id !== id);
    this.expensesSubject.next(updated);
  }

  getTotal(): number {
    return this.expensesSubject.value.reduce(
      (sum, e) => sum + (e.convertedAmount ?? e.amount),
      0
    );
  }

  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }

  async clearAllExpenses(): Promise<void> {
    const uid = await firstValueFrom(this.auth.getUid());
    await this.db.deleteData(`users/${uid}/expenses`);
    this.expensesSubject.next([]);
  }
}
