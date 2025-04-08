import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonButton, IonContent, IonHeader, IonTitle } from '@ionic/angular/standalone';
import { BottomToolbarComponent } from "../../components/bottom-toolbar/bottom-toolbar.component";
import { HeaderComponent } from '../../components/header/header.component';

const UIElements = [
  IonContent,
  IonButton
]

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, RouterModule, ...UIElements, BottomToolbarComponent, HeaderComponent, BottomToolbarComponent],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  time = 0;
  intervalId: any = null;
  isRunning = false;
  isPaused = false;

  get formattedTime(): string {
    const totalSeconds = Math.floor(this.time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((this.time % 1000) / 100);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds}`;
  }

  startTimer() {
    this.isRunning = true;
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      this.time += 10;
    }, 10);
  }

  pauseTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isPaused = true;
  }

  resumeTimer() {
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      this.time += 10;
    }, 10);
  }

  stopTimer() {
    this.resetTimer();
  }

  resetTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.time = 0;
    this.isRunning = false;
    this.isPaused = false;
  }
}
