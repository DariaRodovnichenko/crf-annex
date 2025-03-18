import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  defaultFeatures = [
    { id: 1, name: 'Extraction', icon: 'analytics', route: '/dashboard' },
    { id: 2, name: 'Visuals', icon: 'bar_chart', route: '/visuals' },
    { id: 3, name: 'Scan TDS', icon: 'camera', route: '/scan' },
    { id: 4, name: 'Expenses', icon: 'payments', route: '/expenses' },
  ];

  features =
    JSON.parse(localStorage.getItem('userFeatures') || 'null') ||
    this.defaultFeatures;

  moreFeatures = [
    { id: 5, name: 'Brew Timer', icon: 'timer', route: '/timer' },
    { id: 6, name: 'Saved Brews', icon: 'save', route: '/saved-brews' },
    { id: 7, name: 'Settings', icon: 'settings', route: '/settings' },
  ];

  saveUserFeatures() {
    localStorage.setItem('userFeatures', JSON.stringify(this.features));
  }
}
