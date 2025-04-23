import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AuthService } from '../../services/auth/auth.service';
import { DatabaseService } from '../../services/data/database.service';
import { filter, firstValueFrom } from 'rxjs';

import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import { CommonModule } from '@angular/common';
import { TDSGraphComponent } from '../../components/tds-graph/tds-graph.component';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';
import { NavigationEnd, Router } from '@angular/router';

const UIElements = [
  IonContent,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSpinner,
  IonLabel,
  IonButton,
];

@Component({
  selector: 'app-visuals',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    BottomToolbarComponent,
    TDSGraphComponent,
    ...UIElements,
  ],
  templateUrl: './visuals.component.html',
  styleUrls: ['./visuals.component.css'],
})
export class VisualsComponent implements OnInit {
  isLoading = true;
  brewData: { tds: number; yield: number; timestamp: string; key: string }[] =
    [];

  constructor(
    private auth: AuthService,
    private db: DatabaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.loadData();
      });

    await this.loadData();
  }

  async loadData() {
    this.isLoading = true;
    const user = await firstValueFrom(this.auth.authState$);
    if (!user) return;

    const snapshot = await this.db.getData(`users/${user.uid}/TDSValues`);
    const values = snapshot ?? {};

    this.brewData = Object.entries(values)
      .map(([key, entry]: [string, any]) => ({
        tds: entry?.value ?? 0,
        yield: entry?.yield ?? 18,
        timestamp: new Date(entry.timestamp).toLocaleString(),
        key,
      }))
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

    this.isLoading = false;
  }

  async removeBrew(key: string) {
    const user = await firstValueFrom(this.auth.authState$);
    if (!user) return;

    await this.db.deleteData(`users/${user.uid}/TDSValues/${key}`);
    this.brewData = this.brewData.filter((b) => b.key !== key);
    console.log(`🗑️ Removed brew entry with key: ${key}`);
  }
}
