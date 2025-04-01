import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Expense } from '../../interfaces/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  addExpense(expense: Expense): void {
    const current = this.expensesSubject.value;
    this.expensesSubject.next([...current, expense]);
  }

  deleteExpense(id: string): void {
    const updated = this.expensesSubject.value.filter((e) => e.id !== id);
    this.expensesSubject.next(updated);
  }

  getTotal(): number {
    return this.expensesSubject.value.reduce((sum, e) => sum + e.amount, 0);
  }

  getExpenses(): Expense[] {
    return this.expensesSubject.value;
  }
}
