import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CoffeeLog } from '../../interfaces/log.model';
import { Expense } from '../../interfaces/expense.model';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { v4 as uuidv4 } from 'uuid';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  title: string = '';
  amount: number | null = null;
  category: 'Beans' | 'Equipment' | 'Accessories' | 'Other' = 'Beans';
  date: string = '';
  currency: string = '€';
  currencies: string[] = ['€', '$', 'CHF', '£'];
  logs: CoffeeLog[] = [];
  expenses: Expense[] = [];

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  loadLogs(): void {
    this.logs = JSON.parse(localStorage.getItem('coffeeLogs') || '[]');
  }

  ngOnInit(): void {
    this.loadExpenses();
    this.loadLogs();
    // Re-load logs whenever we navigate back to this component
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadLogs();
        // ✅ Force view to re-calculate totals
        this.cdr.detectChanges();
      });
  }

  addExpense(): void {
    if (!this.title || !this.amount || !this.date) return;

    const newExpense: Expense = {
      id: uuidv4(),
      title: this.title,
      amount: this.amount,
      category: this.category,
      date: this.date,
    };

    this.expenses.unshift(newExpense);
    this.saveExpenses();
    this.resetForm();
  }

  deleteExpense(id: string): void {
    this.expenses = this.expenses.filter((exp) => exp.id !== id);
    this.saveExpenses();
  }

  saveExpenses(): void {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }

  loadExpenses(): void {
    this.expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
  }

  resetForm(): void {
    this.title = '';
    this.amount = null;
    this.date = '';
    this.category = 'Beans';
  }

  get totalCoffeeShopCost(): number {
    return this.logs
      .filter((log) => log.source === 'Coffee Shop' && log.cost > 0)
      .reduce((acc, log) => acc + log.cost, 0);
  }

  get totalManualExpenses(): number {
    return this.expenses.reduce((acc, exp) => acc + exp.amount, 0);
  }

  get grandTotal(): number {
    return this.totalManualExpenses + this.totalCoffeeShopCost;
  }
}
