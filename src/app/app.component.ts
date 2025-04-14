import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router, NavigationStart } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { filter, firstValueFrom } from 'rxjs';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private appRef = inject(ApplicationRef);
  private router = inject(Router);

  constructor() {
    // Auto-blur focused element on every route transition
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        setTimeout(() => {
          const el = document.activeElement as HTMLElement;
          if (el && typeof el.blur === 'function') {
            el.blur();
            console.log('👁️‍🗨️ Blurred during route transition:', el);
          }

          const body = document.querySelector('body') as HTMLElement;
          if (body && typeof body.focus === 'function') {
            body.focus();
          }
        }, 0);
      });
  }

  async ngOnInit() {
    // Wait until Angular is fully bootstrapped
    await firstValueFrom(this.appRef.isStable.pipe(filter((stable) => stable)));

    const user = await firstValueFrom(this.authService.authState$);
    if (!user) {
      console.log('🔐 No user detected – logging in anonymously...');
      try {
        await this.authService.loginAnonymously();
        console.log('✅ Anonymous login success');
      } catch (err) {
        console.error('❌ Anonymous login failed', err);
      }
    }
  }

  isHomePage(): boolean {
    return this.router.url === '/';
  }
}
