import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { BottomToolbarComponent } from "./components/bottom-toolbar/bottom-toolbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, BottomToolbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  constructor(private router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
