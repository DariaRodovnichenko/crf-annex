import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
} from '@ionic/angular/standalone';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { BrewStep } from '../../interfaces/brew-steps.model';

const UIElements = [
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
];

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ...UIElements,
    BottomToolbarComponent,
    HeaderComponent,
  ],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent {
  time = 0;
  intervalId: any = null;
  isRunning = false;
  isPaused = false;
  hasStarted = false;
  brewStarted = false;
  recipe: any;
  preBrewTips: string[] = [];
  brewSteps: BrewStep[] = [];
  currentStepIndex = 0;
  currentInstruction = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.recipe = nav?.extras?.state?.['recipe'];

    if (this.recipe?.steps) {
      this.brewSteps = this.parseSteps(this.recipe.steps);
      this.currentInstruction = this.brewSteps[0]?.text ?? '';
    }
  }

  parseSteps(raw: string): BrewStep[] {
    const lines = raw.split(',').map((line) => line.trim());
    let lastTimeMs = 0;
    const steps: BrewStep[] = [];
    this.preBrewTips = [];

    for (const line of lines) {
      const match = line.match(/(\d+)\s*min\s*(\d+)?|(\d+)\s*min|(\d+)\s*sec/i);
      let timeMs = 0;

      if (match) {
        const min = parseInt(match[1] || match[3] || '0', 10);
        const sec = parseInt(match[2] || match[4] || '0', 10);
        timeMs = (min * 60 + sec) * 1000;
        steps.push({ text: line, timeMs });
        lastTimeMs = timeMs;
      } else {
        this.preBrewTips.push(line); // separate untimed prep tips
      }
    }

    return steps;
  }

  startBrew() {
    this.hasStarted = true;
    this.brewStarted = true;
    this.startTimer();
  }

  startTimer() {
    this.isRunning = true;
    this.isPaused = false;

    this.intervalId = setInterval(() => {
      this.time += 100;

      const nextStep = this.brewSteps[this.currentStepIndex + 1];

      if (nextStep && this.time >= nextStep.timeMs) {
        this.currentStepIndex++;
        this.currentInstruction = this.brewSteps[this.currentStepIndex].text;
      }
    }, 100);
  }

  pauseTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isPaused = true;
  }

  resumeTimer() {
    this.isPaused = false;
    this.intervalId = setInterval(() => {
      this.time += 100;
    }, 100);
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
    this.currentStepIndex = 0;
    this.currentInstruction = this.brewSteps[0]?.text ?? '';
  }

  nextStep() {
    if (this.currentStepIndex < this.brewSteps.length - 1) {
      this.currentStepIndex++;
      this.currentInstruction = this.brewSteps[this.currentStepIndex].text;
    } else {
      this.currentInstruction = '✅ Brew complete!';
    }
  }

  get formattedTime(): string {
    const totalSeconds = Math.floor(this.time / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((this.time % 1000) / 100);

    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${milliseconds}`;
  }
}
