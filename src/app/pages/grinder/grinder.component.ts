// src/app/pages/grinder/grinder.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GrinderSpec } from '../../interfaces/grinder.model';
import { GrindConverterService } from '../../services/grinder/grind-converter.service';
import { HttpClient } from '@angular/common/http';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

const UIElements = [
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
];

@Component({
  selector: 'app-grinder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ...UIElements,
    HeaderComponent,
    BottomToolbarComponent,
  ],
  templateUrl: './grinder.component.html',
  styleUrls: ['./grinder.component.css'],
})
export class GrinderComponent implements OnInit {
  grinders: GrinderSpec[] = [];

  fromGrinder!: GrinderSpec;
  toGrinder!: GrinderSpec;
  fromValue: number = 0;
  result: number | null = null;
  micronValue: number | null = null;

  constructor(
    private http: HttpClient,
    private converter: GrindConverterService
  ) {}

  ngOnInit(): void {
    this.http.get<GrinderSpec[]>('/data/grinders.json').subscribe((data) => {
      this.grinders = data;

      // Set default values
      this.fromGrinder = this.grinders[0]; 
      this.toGrinder = this.grinders[2] ?? this.grinders[0];

      // Optionally prefill a starting value
      this.fromValue = 10;
    });
  }

  convert(): void {
    if (this.fromGrinder && this.toGrinder && this.fromValue > 0) {
      this.result = this.converter.convertGrindSetting(
        this.fromValue,
        this.fromGrinder,
        this.toGrinder
      );
      this.micronValue = this.converter.getMicronValue(
        this.fromValue,
        this.fromGrinder
      );
    }
  }
}
