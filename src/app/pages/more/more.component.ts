import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonRow,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

const UIElements = [IonContent, IonGrid, IonRow, IonCol, IonButton, IonIcon];

@Component({
  selector: 'app-more',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ...UIElements,
    HeaderComponent,
    BottomToolbarComponent,
  ],
  templateUrl: './more.component.html',
  styleUrls: ['./more.component.css'],
})
export class MoreComponent {
  allFeatures = [{ id: 1, name: 'Name', icon: 'add-outline', route: '/' }];
}
