import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

// Angular Material Standalone Components
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
import { CurrencyConverterService } from '../../services/currency-converter.service';

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
  title: string = '';
  amount: number | null = null;
  category: 'Beans' | 'Equipment' | 'Accessories' | 'Other' = 'Beans';
  date: string = '';
  currency: string = 'CHF';
  preferredCurrency: string = 'CHF';
  currencies: string[] = ['€', '$', 'CHF', '£'];
  exchangeRates: { [key: string]: number } = {};
  availableCurrencies: string[] = [];

  expenses: Expense[] = [];
  logs: CoffeeLog[] = [];

  // Filtering
  filteredExpenses: Expense[] = [];
  filterCategory: string = '';
  filterStartDate: Date | null = null;
  filterEndDate: Date | null = null;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private currencyService: CurrencyConverterService
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadLogs();

    this.currencyService.getAvailableCurrencies().subscribe((currencies) => {
      if (currencies.length > 0) {
        this.availableCurrencies = currencies;
        this.currency = this.preferredCurrency; // default selection

        // ✅ Fetch exchange rates only after currencies are loaded
        this.currencyService
          .fetchExchangeRates(this.preferredCurrency)
          .subscribe((rates) => {
            this.exchangeRates = rates;
          });
      } else {
        console.error('No currencies available from API');
      }
    });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadLogs();
        this.cdr.detectChanges();
      });
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

  addExpense(): void {
    if (!this.title || !this.amount || !this.date || !this.currency) return;

    this.currencyService
      .convert(this.currency, this.preferredCurrency, this.amount)
      .subscribe((convertedAmount) => {
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
      });
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
  }

  // Totals
  get totalManualExpenses(): number {
    return this.expenses.reduce(
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

  // Filters
  applyFilters(): void {
    this.filteredExpenses = this.expenses.filter((exp) => {
      const matchesCategory = this.filterCategory
        ? exp.category === this.filterCategory
        : true;
      const matchesStartDate = this.filterStartDate
        ? new Date(exp.date) >= new Date(this.filterStartDate)
        : true;
      const matchesEndDate = this.filterEndDate
        ? new Date(exp.date) <= new Date(this.filterEndDate)
        : true;
      return matchesCategory && matchesStartDate && matchesEndDate;
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

    const header = 'Title,Price,Category,Date\n';
    const rows = this.filteredExpenses
      .map(
        (exp) => `"${exp.title}",${exp.amount},${exp.category},"${exp.date}"`
      )
      .join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'filtered_expenses.csv');
    link.click();
  }
}
