import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { Expense } from '../../interfaces/expense.model';
import { CoffeeLog } from '../../interfaces/log.model';

import { CurrencyConverterService } from '../../services/currencyApi/currency-converter.service';
import { ExpenseService } from '../../services/expenses/expense.service';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
} from '@ionic/angular/standalone';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { LogService } from '../../services/logs/logs.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BottomToolbarComponent,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonButton,
    IonSelectOption,
    IonText,
    IonList,
  ],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  // Form
  title = '';
  amount: number | null = null;
  category: 'Beans' | 'Equipment' | 'Accessories' | 'Other' = 'Beans';
  currency = 'USD';
  availableCurrencies: string[] = [];
  date = new Date().toISOString().split('T')[0];

  // Preferences
  preferredCurrency = 'USD';

  // Data
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  logs: CoffeeLog[] = [];

  // Filter
  periodFilter: 'all' | 'thisMonth' | 'last7days' | 'custom' = 'all';
  filterCategory = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;

  constructor(
    private expenseService: ExpenseService,
    private currencyService: CurrencyConverterService,
    private local: LocalStorageService,
    private logService: LogService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    // Load preferred currency from LocalStorage
    this.preferredCurrency =
      (await this.local.get<string>('preferredCurrency')) || 'USD';

    // Load all available currencies
    const symbols = await firstValueFrom(
      this.currencyService.getAvailableCurrencies()
    );
    this.availableCurrencies = symbols.includes(this.preferredCurrency)
      ? symbols
      : [this.preferredCurrency, ...symbols];

    // Load user expenses
    await this.expenseService.loadExpenses();

    // Load logs (coffee consumption)
    this.logs = await this.logService.getUserLogs();

    // Convert log costs to preferredCurrency
    this.logs = await this.currencyService.recalculateLogCosts(
      this.logs,
      this.preferredCurrency
    );

    // Apply conversion and filtering
    await this.reloadExpensesWithConversion();

    // Trigger change detection
    this.cdr.detectChanges();
  }

  async addExpense(): Promise<void> {
    if (!this.title || !this.amount || !this.currency || !this.date) return;

    const convertedAmount =
      this.currency === this.preferredCurrency
        ? this.amount
        : await firstValueFrom(
            this.currencyService.convert(
              this.currency,
              this.preferredCurrency,
              this.amount!
            )
          );

    const newExpense: Expense = {
      id: uuidv4(),
      title: this.title,
      amount: this.amount,
      category: this.category,
      date: this.date,
      originalCurrency: this.currency,
      convertedAmount,
      convertedCurrency: this.preferredCurrency,
    };

    await this.expenseService.addExpense(newExpense);
    this.resetForm();

    await this.reloadExpensesWithConversion();
    this.cdr.detectChanges();
  }

  async deleteExpense(id: string): Promise<void> {
    await this.expenseService.deleteExpense(id);
    await this.reloadExpensesWithConversion();
  }

  async onPreferredCurrencyChange(): Promise<void> {
    await this.local.save('preferredCurrency', this.preferredCurrency);
    await this.reloadExpensesWithConversion();
  }

  resetForm(): void {
    this.title = '';
    this.amount = null;
    this.currency = this.preferredCurrency;
    this.category = 'Beans';
    this.date = new Date().toISOString().split('T')[0];
  }

  applyFilters(): void {
    const now = new Date();

    if (this.periodFilter === 'thisMonth') {
      this.filterStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      this.filterEndDate = now;
    } else if (this.periodFilter === 'last7days') {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      this.filterStartDate = d;
      this.filterEndDate = now;
    } else if (this.periodFilter !== 'custom') {
      this.filterStartDate = null;
      this.filterEndDate = null;
    }

    this.filteredExpenses = this.expenses.filter((e) => {
      const date = new Date(e.date);
      return (
        (!this.filterCategory || e.category === this.filterCategory) &&
        (!this.filterStartDate || date >= this.filterStartDate) &&
        (!this.filterEndDate || date <= this.filterEndDate)
      );
    });
  }

  resetFilters(): void {
    this.filterCategory = '';
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.filteredExpenses = [...this.expenses];
  }

  private async mergeLogsIntoExpenses(): Promise<Expense[]> {
    const logsToConvert = this.logs
      .filter((log) => log.source === 'Coffee Shop' && log.cost > 0)
      .map((log) => {
        return {
          id: `log-${log.id}`, // prefix to avoid conflict with real expense IDs
          title: '☕ Coffee Shop',
          amount: log.cost,
          category: 'Other',
          date: log.date,
          originalCurrency: log.currency || this.preferredCurrency,
          convertedAmount: log.cost, // placeholder; will be updated
          convertedCurrency: this.preferredCurrency,
        } as Expense;
      });

    return this.currencyService.recalculateExpenses(
      logsToConvert,
      this.preferredCurrency
    );
  }

  get totalManualExpenses(): number {
    return (
      Math.round(this.expenseService.getTotalFor(this.filteredExpenses) * 100) /
      100
    );
  }

  get grandTotal(): number {
    return this.totalManualExpenses;
  }

  exportToCSV(): void {
    if (!this.filteredExpenses.length) return alert('No expenses to export.');

    const header = 'Title,Price,Category,Date,Converted,OriginalCurrency\n';
    const rows = this.filteredExpenses
      .map(
        (e) =>
          `"${e.title}",${e.amount},${e.category},"${e.date}",${e.convertedAmount},${e.originalCurrency}`
      )
      .join('\n');

    const csv = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csv);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered_expenses.csv';
    link.click();
  }

  private async reloadExpensesWithConversion(): Promise<void> {
    const baseExpenses = this.expenseService.getExpenses();
    const convertedExpenses = await this.currencyService.recalculateExpenses(
      baseExpenses,
      this.preferredCurrency
    );

    const logExpenses = await this.mergeLogsIntoExpenses();

    this.expenses = [...convertedExpenses, ...logExpenses];
    this.applyFilters();
  }
}
