import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CurrencyConverterService {
  private baseUrl = 'https://api.exchangerate.host';

  constructor(private http: HttpClient) {}

  // Fetches all exchange rates from base (e.g. CHF)
  fetchExchangeRates(base: string): Observable<{ [key: string]: number }> {
    return this.http
      .get<any>(`${this.baseUrl}/latest?base=${base}`)
      .pipe(map((res) => res.rates));
  }

  // Convert from one currency to another
  convert(from: string, to: string, amount: number): Observable<number> {
    return this.http
      .get<any>(
        `${this.baseUrl}/convert?from=${from}&to=${to}&amount=${amount}`
      )
      .pipe(map((res) => res.result));
  }

  // Optional: Get all exchange rates relative to base
  getRates(base: string = 'CHF'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/latest?base=${base}`);
  }

  // Get list of supported currency symbols
  getAvailableCurrencies(): Observable<string[]> {
    return this.http.get<any>('https://api.exchangerate.host/symbols').pipe(
      map((res) => {
        if (res && res.symbols) {
          return Object.keys(res.symbols); // 💡 Get currency codes like "USD", "EUR", etc.
        } else {
          console.error('Invalid symbols response:', res);
          return [];
        }
      }),
      catchError((err) => {
        console.error('Failed to fetch symbols', err);
        return of([]);
      })
    );
  }
}
