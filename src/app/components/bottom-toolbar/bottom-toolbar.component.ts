import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

// Ionic
import {
  IonFooter,
  IonIcon,
  IonTabBar,
  IonTabButton,
} from '@ionic/angular/standalone';

const UIElements = [IonFooter, IonTabBar, IonTabButton, IonIcon];

@Component({
  selector: 'app-bottom-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ...UIElements],
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.css'],
})
export class BottomToolbarComponent {

  navLinks = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/timer', icon: 'timer', label: 'Brewing Timer' },
    { path: '/logs', icon: 'document-text', label: 'Brew Logs' },
    { path: '/visuals', icon: 'stats-chart', label: 'Brew Visuals' },
  ];
}
