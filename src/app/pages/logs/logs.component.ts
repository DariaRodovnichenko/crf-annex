import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoffeeLogService } from '../../services/coffee-log/coffee-log.service';
import { CoffeeLog } from '../../interfaces/log.model';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { BehaviorSubject } from 'rxjs';

const UIElements = [
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButton,
  IonList,
  IonIcon,
];

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    BottomToolbarComponent,
    ...UIElements,
  ],
  host: { ngSkipHydration: '' },
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {
  private readonly logService = inject(CoffeeLogService);

  logs$ = new BehaviorSubject<CoffeeLog[]>([]);
  selectedDate: string = new Date().toISOString().split('T')[0];

  newLog: CoffeeLog = {
    id: '',
    date: this.selectedDate,
    gramsUsed: 0,
    cost: 0,
    brewMethod: '',
    source: 'Home',
  };

  async ngOnInit() {
    await this.loadLogs();
  }

  async loadLogs() {
    try {
      const allLogs = await this.logService.getUserLogs();
      const filtered = allLogs.filter((log) => log.date === this.selectedDate);
      this.logs$.next(filtered);
    } catch (error) {
      console.error('⚠️ Failed to load logs:', error);
    }
  }

  updateNewLog(field: keyof CoffeeLog, value: any) {
    this.newLog = { ...this.newLog, [field]: value };
  }

  async onSubmit() {
    console.log('📤 Attempting to submit new log:', this.newLog);

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

    this.newLog.id = crypto.randomUUID();

    try {
      await this.logService.addUserLog(this.newLog);
      console.log('✅ Log submitted:', this.newLog);
      await this.loadLogs();
      this.resetForm();
    } catch (err) {
      console.error('❌ Failed to write log to Firebase:', err);
    }
  }

  async onDeleteLog(log: CoffeeLog) {
    try {
      await this.logService.deleteUserLog(log.id);
      await this.loadLogs();
    } catch (error) {
      console.error('❌ Failed to delete log:', error);
    }
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

  setSelectedDate(date: string) {
    this.selectedDate = date;
    this.loadLogs();
  }
}
