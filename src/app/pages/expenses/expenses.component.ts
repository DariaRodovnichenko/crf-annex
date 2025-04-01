import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Interfaces
import { CoffeeLog } from '../../interfaces/log.model';
import { Expense } from '../../interfaces/expense.model';

// Services
import { CurrencyConverterService } from '../../services/currencyApi/currency-converter.service';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButton,
    MatSelectModule,
    MatIcon,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css'],
})
export class ExpensesComponent implements OnInit {
  // Form fields
  title: string = '';
  amount: number | null = null;
  category: 'Beans' | 'Equipment' | 'Accessories' | 'Other' = 'Beans';
  date: string = '';
  currency: string = 'CHF';

  // Currency
  preferredCurrency: string = 'CHF';
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
    private router: Router,
    private cdr: ChangeDetectorRef,
    private currencyService: CurrencyConverterService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadExpenses();
    this.loadLogs();

    try {
      const rates = await firstValueFrom(
        this.currencyService.fetchExchangeRates(this.preferredCurrency)
      );
      this.exchangeRates = rates;

      const symbols = await firstValueFrom(
        this.currencyService.getAvailableCurrencies()
      );
      this.availableCurrencies = symbols;
    } catch (error) {
      console.error('Currency API error:', error);
    }

   await firstValueFrom(
     this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
   );
   this.loadLogs();
   this.cdr.detectChanges();
  }

  loadLogs(): void {
    this.logs = JSON.parse(localStorage.getItem('coffeeLogs') || '[]');
  }

  loadExpenses(): void {
    const stored = localStorage.getItem('expenses');
    this.expenses = stored ? JSON.parse(stored) : [];
    this.filteredExpenses = [...this.expenses];
  }

  saveExpenses(): void {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
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

    this.expenses.unshift(newExpense);
    this.saveExpenses();
    this.resetForm();
    this.applyFilters();
  }

  deleteExpense(id: string): void {
    this.expenses = this.expenses.filter((exp) => exp.id !== id);
    this.saveExpenses();
    this.applyFilters();
  }

  resetForm(): void {
    this.title = '';
    this.amount = null;
    this.date = '';
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
