import { Component, Input } from '@angular/core';

import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

const UIElements = [
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
]

@Component({
  selector: 'app-recipe-modal',
  standalone: true,
  imports: [...UIElements],
  templateUrl: './recipe-modal.component.html',
  styleUrls: ['./recipe-modal.component.scss'],
})
export class RecipeModalComponent {
  @Input() recipe: any;

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss(); 
  }

  follow() {
    this.modalCtrl.dismiss(this.recipe, 'follow'); 
  }
}
