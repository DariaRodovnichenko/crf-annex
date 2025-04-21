import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { AuthService } from '../../services/auth/auth.service';
import { DatabaseService } from '../../services/data/database.service';
import { firstValueFrom } from 'rxjs';

import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import { CommonModule } from '@angular/common';
import { TDSGraphComponent } from '../../components/tds-graph/tds-graph.component';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonLabel,
  IonSpinner,
} from '@ionic/angular/standalone';

const UIElements = [
  IonContent,
  IonCardContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonSpinner,
  IonLabel,
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
  brewData: { tds: number; yield: number; timestamp: string }[] = [];

  constructor(private auth: AuthService, private db: DatabaseService) {}

  async ngOnInit() {
    const user = await firstValueFrom(this.auth.authState$);
    if (!user) return;

    const snapshot = await this.db.getData(`users/${user.uid}/tdsValues`);
    const values = snapshot
      ? Object.values(snapshot).sort(
          (a: any, b: any) =>
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        )
      : [];

    this.brewData = values.map((entry: any) => ({
      tds: entry?.value ?? 0,
      yield: entry?.yield ?? 18, // fallback if no yield recorded
      timestamp: new Date(entry.timestamp).toLocaleString(),
    }));

    this.isLoading = false;
  }
}
