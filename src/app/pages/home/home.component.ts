import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  of,
  switchMap,
  tap,
} from 'rxjs';

import { DatabaseService } from '../../services/data/database.service';
import { AuthService } from '../../services/auth/auth.service';

import {
  IonCard,
  IonCardContent,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonReorderGroup,
  IonReorder,
  ItemReorderEventDetail,
} from '@ionic/angular/standalone';

import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonCard,
    IonCardContent,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonReorderGroup,
    IonReorder,
    HeaderComponent,
    BottomToolbarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  defaultFeatures = [
    { id: 1, name: 'Scan TDS', icon: 'camera', route: '/tds-scan' },
    { id: 2, name: 'Extraction', icon: 'flask', route: '/dashboard' },
    {
      id: 3,
      name: 'Grinder Converter',
      icon: 'swap-horizontal',
      route: '/converter',
    },
    { id: 4, name: 'Expenses', icon: 'cash', route: '/expenses' },
    { id: 5, name: 'Saved Recipes', icon: 'heart', route: '/favorites' },
    { id: 6, name: 'More', icon: 'apps', route: '/more' },
  ];

  features$ = new BehaviorSubject<any[]>([]);
  isReordering = false;

  constructor(
    private router: Router,
    private db: DatabaseService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  goToRoute(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    this.authService.authState$
      .pipe(
        switchMap((user) => {
          if (!user?.uid) {
            this.features$.next(this.defaultFeatures);
            return of(null);
          }

          const userPath = `users/${user.uid}/features`;

          return from(this.db.getData(userPath)).pipe(
            tap(async (data) => {
              const features = data ?? this.defaultFeatures;
              this.features$.next(features);

              if (!data) {
                await this.db.saveData(userPath, this.defaultFeatures);
              }
            })
          );
        })
      )
      .subscribe();
  }

  async saveUserFeatures(updatedFeatures: any[]) {
    const user = await firstValueFrom(this.authService.authState$);
    if (user?.uid) {
      await this.db.saveData(`users/${user.uid}/features`, updatedFeatures);
    }
  }

  async doReorder(event: CustomEvent<ItemReorderEventDetail>) {
    const from = event.detail.from;
    const to = event.detail.to;

    const updated = [...this.features$.value];
    const moved = updated.splice(from, 1)[0];
    updated.splice(to, 0, moved);

    this.features$.next(updated);
    event.detail.complete();

    await this.saveUserFeatures(updated);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.activeElement as HTMLElement;
      if (el?.blur) el.blur();

      setTimeout(() => {
        const safeEl = document.querySelector('body') as HTMLElement;
        safeEl?.focus?.();
      }, 10);
    }
  }
}
