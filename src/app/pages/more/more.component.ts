import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './more.component.html',
  styleUrl: './more.component.css',
})
export class MoreComponent {
  allFeatures = [{ id: 1, name: 'Name', icon: 'icon', route: '/' },];
}
