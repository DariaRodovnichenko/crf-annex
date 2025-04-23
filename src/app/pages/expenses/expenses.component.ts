import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// Interfaces
import { CoffeeLog } from '../../interfaces/log.model';
import { Expense } from '../../interfaces/expense.model';

// Services
import { CurrencyConverterService } from '../../services/currencyApi/currency-converter.service';
import { ExpenseService } from '../../services/expenses/expense.service';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

// Ionic UI Components
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';

const UIElements = [
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonButton,
  IonSelectOption,
];

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BottomToolbarComponent,
    ...UIElements,
  ],

  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  // Form fields
  title: string = '';
  amount: number | null = null;
  category: 'Beans' | 'Equipment' | 'Accessories' | 'Other' = 'Beans';
  date: string = new Date().toISOString().split('T')[0];
  currency: string = 'USD';

  // Currency
  preferredCurrency: string = 'USD';
  exchangeRates: { [key: string]: number } = {};
  availableCurrencies: string[] = [];

  // Expense data
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  logs: CoffeeLog[] = [];

  // Filtering
  filterCategory: string = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private currencyService: CurrencyConverterService,
    private expenseService: ExpenseService
  ) {}

  async ngOnInit(): Promise<void> {
    // Subscribe to expense updates
    this.expenseService.expenses$.subscribe((expenses) => {
      this.expenses = expenses;
      this.applyFilters();
    });

    // Load expenses from Firebase
    await this.expenseService.loadExpenses();

    // Load logs from localStorage
    this.loadLogs();

    // Load exchange rates
    try {
      const rates = await firstValueFrom(
        this.currencyService.fetchExchangeRates(this.preferredCurrency)
      );
      this.exchangeRates = rates;

      const symbols = await firstValueFrom(
        this.currencyService.getAvailableCurrencies()
      );
      this.availableCurrencies = symbols;

      // Ensure preferredCurrency (CHF) is in the list
      if (!this.availableCurrencies.includes(this.preferredCurrency)) {
        this.availableCurrencies.unshift(this.preferredCurrency);
      }
    } catch (error) {
      console.error('Currency API error:', error);
    }

    // Force change detection if needed (especially after async ops)
    this.cdr.detectChanges();
  }

  loadLogs(): void {
    this.logs = JSON.parse(localStorage.getItem('coffeeLogs') || '[]');
  }

  async addExpense(): Promise<void> {
    if (!this.title || !this.amount || !this.date || !this.currency) return;

    let convertedAmount = this.amount;
    if (this.currency !== this.preferredCurrency) {
      try {
        convertedAmount = await firstValueFrom(
          this.currencyService.convert(
            this.currency,
            this.preferredCurrency,
            this.amount
          )
        );
      } catch (error) {
        console.error('Conversion failed. Using original amount.');
      }
    }

    const newExpense: Expense = {
      id: uuidv4(),
      title: this.title,
      amount: this.amount!,
      category: this.category,
      date: this.date,
      originalCurrency: this.currency,
      convertedAmount,
      convertedCurrency: this.preferredCurrency,
    };

    await this.expenseService.addExpense(newExpense);
    this.resetForm();
    this.applyFilters();
  }

  async deleteExpense(id: string): Promise<void> {
    await this.expenseService.deleteExpense(id);
    this.applyFilters();
  }

  resetForm(): void {
    this.title = '';
    this.amount = null;
    this.date = new Date().toISOString().split('T')[0];
    this.category = 'Beans';
    this.currency = this.preferredCurrency;
  }

  // Totals
  get totalManualExpenses(): number {
    return this.filteredExpenses.reduce(
      (acc, exp) => acc + (exp.convertedAmount ?? exp.amount),
      0
    );
  }

  get totalCoffeeShopCost(): number {
    return this.logs
      .filter((log) => log.source === 'Coffee Shop' && log.cost > 0)
      .reduce((acc, log) => acc + log.cost, 0);
  }

  get grandTotal(): number {
    return this.totalManualExpenses + this.totalCoffeeShopCost;
  }

  // Filtering
  applyFilters(): void {
    this.filteredExpenses = this.expenses.filter((exp) => {
      const matchesCategory = this.filterCategory
        ? exp.category === this.filterCategory
        : true;
      const matchesStart = this.filterStartDate
        ? new Date(exp.date) >= new Date(this.filterStartDate)
        : true;
      const matchesEnd = this.filterEndDate
        ? new Date(exp.date) <= new Date(this.filterEndDate)
        : true;
      return matchesCategory && matchesStart && matchesEnd;
    });
  }

  resetFilters(): void {
    this.filterCategory = '';
    this.filterStartDate = null;
    this.filterEndDate = null;
    this.filteredExpenses = [...this.expenses];
  }

  exportToCSV(): void {
    if (this.filteredExpenses.length === 0) {
      alert('No expenses to export.');
      return;
    }

    const header = 'Title,Price,Category,Date,Converted,OriginalCurrency\n';
    const rows = this.filteredExpenses
      .map(
        (exp) =>
          `"${exp.title}",${exp.amount},${exp.category},"${exp.date}",${exp.convertedAmount},${exp.originalCurrency}`
      )
      .join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'filtered_expenses.csv';
    link.click();
  }
}
