import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
  IonText,
} from '@ionic/angular/standalone';

const UIElements = [
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonCard,
  IonCardContent,
  IonIcon,
  IonText
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    BottomToolbarComponent,
    ...UIElements,
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
    { id: 6, name: 'Recipes', icon: 'list', route: '/recipes' },
    { id: 7, name: 'Notes', icon: 'pencil', route: '/notepad' },
    { id: 8, name: 'More', icon: 'apps', route: '/more' },
  ];

  // Use a BehaviorSubject so the template can subscribe to it
  features$ = new BehaviorSubject<any[]>(this.defaultFeatures);

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  goToRoute(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit(): void {
    // We no longer interact with the Database or AuthService for feature order.
    // Every user simply gets the default layout:
    this.features$.next(this.defaultFeatures);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      const el = document.activeElement as HTMLElement;
      if (el?.blur) {
        el.blur();
      }
      setTimeout(() => {
        const safeEl = document.querySelector('body') as HTMLElement;
        safeEl?.focus?.();
      }, 10);
    }
  }
}
