import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { BottomToolbarComponent } from './components/bottom-toolbar/bottom-toolbar.component';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    BottomToolbarComponent,
    HeaderComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.authState$.pipe(take(1)).subscribe((user) => {
      if (!user) {
        console.log('🔐 No user detected – logging in anonymously...');
        this.authService
          .loginAnonymously()
          .then(() => console.log('✅ Anonymous login success'))
          .catch((err) => console.error('❌ Anonymous login failed', err));
      }
    });
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
