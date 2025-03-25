import { Injectable } from '@angular/core';
import { CoffeeLog } from '../interfaces/log.model'; // ✅ adjust if your path is different

@Injectable({
  providedIn: 'root',
})
export class CoffeeLogService {
  private coffeeLogs: CoffeeLog[] = [];

  constructor() {
    this.loadLogs();
  }

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
    const savedLogs = localStorage.getItem('coffeeLogs');
    if (savedLogs) {
      this.coffeeLogs = JSON.parse(savedLogs);
    }
  }
}
