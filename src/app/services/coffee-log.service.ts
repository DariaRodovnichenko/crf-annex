import { Injectable } from '@angular/core';

export interface CoffeeLog {
  id: string;
  date: string;
  gramsUsed: number;
  cost: number;
  brewMethod: string;
}

@Injectable({
  providedIn: 'root',
})
export class CoffeeLogService {
  private coffeeLogs: CoffeeLog[] = [];

  getLogs(): CoffeeLog[] {
    return this.coffeeLogs;
  }

  addLog(log: CoffeeLog) {
    this.coffeeLogs.push(log);
    this.saveLogs();
  }

  deleteLog(id: string): void {
    this.coffeeLogs = this.coffeeLogs.filter((log) => log.id !== id);
    this.saveLogs();
  }

  private saveLogs(): void {
    localStorage.setItem('coffeeLogs', JSON.stringify(this.coffeeLogs));
  }

  private loadLogs(): void {
    const data = localStorage.getItem('coffeeLogs');
    if (data) {
      this.coffeeLogs = JSON.parse(data);
    }
  }
}
