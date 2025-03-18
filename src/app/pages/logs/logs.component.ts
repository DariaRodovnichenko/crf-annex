import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoffeeLogService, CoffeeLog } from '../../services/coffee-log.service';

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent {
  logs: CoffeeLog[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];

  newLog: CoffeeLog = {
    id: '',
    date: this.selectedDate,
    gramsUsed: 0,
    cost: 0,
    brewMethod: '',
    source: 'Home',
  };

  constructor(private coffeeLogService: CoffeeLogService) {
    this.loadLogs();
  }

  loadLogs() {
    const allLogs = this.coffeeLogService.getLogs();
    this.logs = allLogs.filter((log) => log.date === this.selectedDate);
  }

  resetForm() {
    this.newLog = {
      id: '',
      date: this.selectedDate,
      gramsUsed: 0,
      cost: 0,
      brewMethod: '',
      source: 'Home',
    };
  }

  addLog() {
    if (
      !this.newLog.date ||
      this.newLog.gramsUsed <= 0 ||
      (this.newLog.source === 'Coffee Shop' && this.newLog.cost <= 0)
    ) {
      alert('Please enter valid data!');
      return;
    }

    if (this.newLog.source !== 'Coffee Shop') {
      this.newLog.cost = 0;
    }

    this.newLog.id = Math.random().toString(36).substr(2, 9);
    this.coffeeLogService.addLog({ ...this.newLog });
    this.loadLogs();
    this.resetForm();
  }

  deleteLog(id: string) {
    this.coffeeLogService.deleteLog(id);
    this.loadLogs();
  }
}
