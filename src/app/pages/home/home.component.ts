import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../../services/data/database.service';
import { AuthService } from '../../services/auth/auth.service';
import {
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import {
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';

const UIElements = [
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ...UIElements,
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

  features$!: Observable<any[]>;

  constructor(private db: DatabaseService, private authService: AuthService) {}

  ngOnInit(): void {
    this.features$ = this.authService.authState$.pipe(
      switchMap((user) => {
        if (!user?.uid) return of(this.defaultFeatures);

        const userPath = `users/${user.uid}/features`;

        return from(this.db.getData(userPath)).pipe(
          map((data) => data ?? this.defaultFeatures),
          tap(async (data) => {
            if (!data) {
              await this.db.saveData(userPath, this.defaultFeatures);
            }
          })
        );
      })
    );
  }

  async saveUserFeatures(updatedFeatures: any[]) {
    const user = await firstValueFrom(this.authService.authState$);
    if (!user?.uid) return;

    await this.db.saveData(`users/${user.uid}/features`, updatedFeatures);
  }
}
