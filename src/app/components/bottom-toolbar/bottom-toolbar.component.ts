import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-bottom-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './bottom-toolbar.component.html',
  styleUrl: './bottom-toolbar.component.css',
})
export class BottomToolbarComponent {
  navLinks = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/dashboard', icon: 'analytics', label: 'Extraction' },
    { path: '/visuals', icon: 'bar_chart', label: 'Visuals' },
    { path: '/expenses', icon: 'payments', label: 'Expenses' },
    { path: '/more', icon: 'grid_view', label: 'More' },
  ];
}
