// src/app/pages/grinder/grinder.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { GrinderSpec } from '../../interfaces/grinder.model';
import { GrindConverterService } from '../../services/grind-converter.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-grinder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
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
