import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense } from '../../interfaces/expense.model';
import { CoffeeLog } from '../../interfaces/log.model';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  private baseUrl = 'https://api.currencyapi.com/v3';
  private apiKey = environment.currencyApiKey;

  constructor(private http: HttpClient) {}

  // Convert a value from one currency to another
  convert(
    from: string | undefined,
    to: string | undefined,
    amount: number
  ): Observable<number> {
    if (!from || !to) {
      console.warn('⚠️ Missing currency for conversion:', { from, to });
      return of(amount);
    }

    return this.fetchExchangeRates(from).pipe(
      map((rates) => {
        const rate = rates[to];
        return rate ? amount * rate : amount;
      }),
      catchError((err) => {
        console.error('❌ Currency conversion error:', err);
        return of(amount);
      })
    );
  }

  // Get available currency symbols
  getAvailableCurrencies(): Observable<string[]> {
    return this.http
      .get<any>(`${this.baseUrl}/currencies?apikey=${this.apiKey}`)
      .pipe(
        map((res) => Object.keys(res.data || {})),
        catchError((err) => {
          console.error('❌ Failed to load currencies:', err);
          return of([]);
        })
      );
  }

  // Fetch exchange rates using base currency
  fetchExchangeRates(
    base: string | undefined
  ): Observable<{ [key: string]: number }> {
    if (!base) {
      console.warn('⚠️ No base currency provided to fetchExchangeRates');
      return of({});
    }

    return this.http
      .get<any>(
        `${this.baseUrl}/latest?apikey=${this.apiKey}&base_currency=${base}`
      )
      .pipe(
        map((res) => (res.data ? this.mapRates(res.data) : {})),
        catchError((err) => {
          console.error('❌ Failed to fetch rates:', err);
          return of({});
        })
      );
  }

  // Flatten API response to { [currencyCode]: rate }
  private mapRates(data: any): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    for (const key in data) {
      result[key] = data[key].value;
    }
    return result;
  }

  // Recalculate all expenses for a new preferred currency
  async recalculateExpenses(
    expenses: Expense[],
    preferredCurrency: string
  ): Promise<Expense[]> {
    return await Promise.all(
      expenses.map(async (exp) => {
        const convertedAmount =
          exp.originalCurrency === preferredCurrency
            ? exp.amount
            : await firstValueFrom(
                this.convert(
                  exp.originalCurrency,
                  preferredCurrency,
                  exp.amount
                )
              );

        return {
          ...exp,
          convertedAmount,
          convertedCurrency: preferredCurrency,
        };
      })
    );
  }

  // Recalculate Coffee Logs
  async recalculateLogCosts(
    logs: CoffeeLog[],
    preferredCurrency: string
  ): Promise<CoffeeLog[]> {
    return await Promise.all(
      logs.map(async (log) => {
        const fromCurrency = log.currency || 'USD';
        const converted =
          fromCurrency === preferredCurrency
            ? log.cost
            : await firstValueFrom(
                this.convert(fromCurrency, preferredCurrency, log.cost)
              );

        return {
          ...log,
          cost: Math.round(converted * 100) / 100,
          currency: preferredCurrency,
        };
      })
    );
  }
}
