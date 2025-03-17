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
  newLog: CoffeeLog = {
    id: '',
    date: '',
    gramsUsed: 0,
    cost: 0,
    brewMethod: '',
  };

  constructor(private coffeeLogService: CoffeeLogService) {
    this.loadLogs();
  }

  loadLogs() {
    this.logs = this.logs = [...this.coffeeLogService.getLogs()];
  }

  addLog() {
    if (
      !this.newLog.date ||
      this.newLog.gramsUsed <= 0 ||
      this.newLog.cost <= 0
    ) {
      alert('Please enter valid data!');
      return;
    }

    this.newLog.id = Math.random().toString(36).substr(2, 9);
    this.coffeeLogService.addLog(this.newLog);
    this.loadLogs(); // ✅ Refresh the list
    this.newLog = { id: '', date: '', gramsUsed: 0, cost: 0, brewMethod: '' }; // ✅ Reset form
  }

  deleteLog(id: string) {
    this.coffeeLogService.deleteLog(id);
    this.loadLogs();
  }
}