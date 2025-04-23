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
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

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
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css'],
})
export class LogsComponent implements OnInit {
  private readonly logService = inject(CoffeeLogService);
  private readonly authService = inject(AuthService);

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
      const user = await firstValueFrom(this.authService.authState$);
      let allLogs: CoffeeLog[] = [];

      if (user?.isAnonymous) {
        const localLogs = JSON.parse(
          localStorage.getItem('guest-logs') || '[]'
        );
        allLogs = localLogs;
        console.log('📄 Loaded logs from localStorage (guest)');
      } else {
        allLogs = await this.logService.getUserLogs();
        console.log('📄 Loaded logs from Firebase');
      }

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
      const user = await firstValueFrom(this.authService.authState$);
      if (user?.isAnonymous) {
        const localLogs = JSON.parse(
          localStorage.getItem('guest-logs') || '[]'
        );
        localLogs.push(this.newLog);
        localStorage.setItem('guest-logs', JSON.stringify(localLogs));
        console.log('💾 Guest log saved locally');
      } else {
        await this.logService.addUserLog(this.newLog);
        console.log('✅ Log saved to Firebase');
      }

      await this.loadLogs();
      this.resetForm();
    } catch (err) {
      console.error('❌ Failed to save log:', err);
    }
  }

  async onDeleteLog(log: CoffeeLog) {
    try {
      const user = await firstValueFrom(this.authService.authState$);
      if (user?.isAnonymous) {
        const logs = JSON.parse(localStorage.getItem('guest-logs') || '[]');
        const updated = logs.filter((l: CoffeeLog) => l.id !== log.id);
        localStorage.setItem('guest-logs', JSON.stringify(updated));
        console.log('🗑️ Guest log removed locally');
      } else {
        await this.logService.deleteUserLog(log.id);
        console.log('🗑️ Log removed from Firebase');
      }

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
