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
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  defaultFeatures = [
    { id: 1, name: 'Scan TDS', icon: 'camera', route: '/tds-scan' },
    { id: 2, name: 'Extraction', icon: 'bar_chart', route: '/dashboard' },
    { id: 3, name: 'Grinder Converter', icon: 'settings', route: '/converter' },
    { id: 4, name: 'Expenses', icon: 'payments', route: '/expenses' },
    { id: 5, name: 'Saved Recipes', icon: 'favorite', route: '/favorites' },
    { id: 6, name: 'More', icon: 'grid_view', route: '/more' },
  ];

  features =
    JSON.parse(localStorage.getItem('userFeatures') || 'null') ||
    this.defaultFeatures;

  saveUserFeatures() {
    localStorage.setItem('userFeatures', JSON.stringify(this.features));
  }
}
