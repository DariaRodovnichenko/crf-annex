import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Components
import { HeaderComponent } from './../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import { TDSGraphComponent } from '../../components/tds-graph/tds-graph.component';

// Ionic
import {
  IonButton,
  IonImg,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonLabel,
  IonCardContent,
  IonText,
  IonItem,
  IonInput,
} from '@ionic/angular/standalone';

// Services
import { OcrService } from '../../services/ocr/ocr.service';
import { AuthService } from '../../services/auth/auth.service';
import { DatabaseService } from '../../services/data/database.service';

import { TDSService } from '../../services/tds/tds.service';

const UIElements = [
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonLabel,
  IonButton,
  IonImg,
  IonText,
  IonItem,
  IonInput,
];

@Component({
  selector: 'app-TDS-scan',
  standalone: true,
  imports: [
    RouterModule,
    ...UIElements,
    HeaderComponent,
    BottomToolbarComponent,
    TDSGraphComponent,
    FormsModule,
  ],
  templateUrl: './tds-scan.component.html',
  styleUrls: ['./tds-scan.component.css'],
})
export class TDSScanComponent {
  photo?: string;
  recognizedText?: string;
  TDSValue: number | null = null;
  extractionYield: number = 18;
  showGraph = false;
  manualTDSValue: number | null = null;

  constructor(
    private ocr: OcrService,
    private authService: AuthService,
    private dbService: DatabaseService,
    private router: Router,
    private tdsService: TDSService
  ) {}

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        quality: 100,
      });

      this.photo = image.dataUrl;

      if (this.photo) {
        this.recognizedText = await this.ocr.recognizeText(this.photo);
        const candidates = this.recognizedText
          .match(/(\d{1,2}[.,]\d{1,2})/g)
          ?.map((val) => parseFloat(val.replace(',', '.')))
          .filter((num) => num > 0.5 && num < 25);

        if (candidates?.length) {
          this.TDSValue = Math.max(...candidates);
          this.showGraph = true;
          console.log('📊 Graph Ready:', this.extractionYield, this.TDSValue);
          await this.tdsService.saveTDSValue(
            this.TDSValue,
            this.extractionYield
          );
        } else {
          this.TDSValue = null;
          this.showGraph = false;
          console.warn('⚠️ No valid TDS values found in OCR result.');
        }

        this.photo = undefined;
      }
    } catch (err) {
      console.error('Camera error:', err);
    }
  }

  async applyManualTDS() {
    if (
      this.manualTDSValue !== null &&
      this.manualTDSValue >= 0.5 &&
      this.manualTDSValue <= 25
    ) {
      this.TDSValue = this.manualTDSValue;
      this.showGraph = true;
      console.log('✅ Manual TDS applied:', this.TDSValue);
      await this.tdsService.saveTDSValue(this.TDSValue, this.extractionYield);
    }
  }

  navigateToVisuals() {
    this.router.navigate(['/visuals']);
  }
}
