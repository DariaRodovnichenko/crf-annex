import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ApplicationRef } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { IonicModule } from '@ionic/angular';
import { filter, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  private authService = inject(AuthService);
  private appRef = inject(ApplicationRef);
  private router = inject(Router);

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
