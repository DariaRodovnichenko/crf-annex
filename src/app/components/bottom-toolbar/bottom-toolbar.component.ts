import { Component} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bottom-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './bottom-toolbar.component.html',
  styleUrls: ['./bottom-toolbar.component.css'],
})
export class BottomToolbarComponent {
  navLinks = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/timer', icon: 'timer', label: 'Brewing Timer' },
    { path: '/logs', icon: 'add_box', label: 'Brew Logs' },
    { path: '/visuals', icon: 'insights', label: 'Brew Visuals' },
    { path: '/settings', icon: 'settings', label: 'Settings' },
  ];
}
