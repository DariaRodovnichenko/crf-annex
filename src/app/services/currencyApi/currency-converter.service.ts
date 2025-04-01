import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  private baseUrl = 'https://api.currencyapi.com/v3';
  private apiKey = environment.currencyApiKey;

  constructor(private http: HttpClient) {}

  // ✅ Fetch all exchange rates from base currency
  fetchExchangeRates(base: string): Observable<{ [key: string]: number }> {
    return this.http
      .get<any>(
        `${this.baseUrl}/latest?apikey=${this.apiKey}&base_currency=${base}`
      )
      .pipe(
        map((res) => (res.data ? this.mapRates(res.data) : {})),
        catchError((err) => {
          console.error('Failed to fetch exchange rates:', err);
          return of({});
        })
      );
  }

  // 🔄 Convert from one currency to another manually (not using /convert, since CurrencyAPI doesn’t offer direct conversion in free plan)
  convert(from: string, to: string, amount: number): Observable<number> {
    return this.fetchExchangeRates(from).pipe(
      map((rates) => {
        const rate = rates[to];
        return rate ? amount * rate : amount;
      }),
      catchError((err) => {
        console.error('Conversion error:', err);
        return of(amount);
      })
    );
  }

  // ✅ Get available currencies (symbols)
  getAvailableCurrencies(): Observable<string[]> {
    return this.http
      .get<any>(`${this.baseUrl}/currencies?apikey=${this.apiKey}`)
      .pipe(
        map((res) => Object.keys(res.data || {})),
        catchError((err) => {
          console.error('Failed to fetch currencies:', err);
          return of([]);
        })
      );
  }

  // 🔧 Helper: Flatten rates
  private mapRates(data: any): { [key: string]: number } {
    const result: { [key: string]: number } = {};
    for (const key in data) {
      result[key] = data[key].value;
    }
    return result;
  }
}
