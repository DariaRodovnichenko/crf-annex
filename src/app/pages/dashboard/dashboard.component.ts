import { BottomToolbarComponent } from './../../components/bottom-toolbar/bottom-toolbar.component';
import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';

const UIElements = [
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonCardSubtitle,
];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ...UIElements,
    HeaderComponent,
    BottomToolbarComponent,
  ],
 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  dose: number = 0;
  yield: number = 0;
  tds: number = 0;
  result: number | null = null;

  calculate() {
    if (this.dose && this.yield && this.tds) {
      this.result = (this.tds * this.yield) / this.dose;
    } else {
      this.result = null;
    }
  }

  getFeedback(): { text: string; color: string } {
    if (this.result === null) return { text: '', color: '' };

    if (this.result < 18) {
      return { text: 'Under-extracted 😕', color: 'blue' };
    } else if (this.result >= 18 && this.result <= 22) {
      return { text: 'Ideal Extraction 😍', color: 'green' };
    } else {
      return { text: 'Over-extracted 😬', color: 'red' };
    }
  }
}
