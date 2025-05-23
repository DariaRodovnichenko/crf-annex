import { RecipeService } from './../../services/recipes/recipe.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonList,
  IonText,
  ModalController,
} from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';
import { RecipeModalComponent } from '../../components/recipe-modal/recipe-modal.component';

const UIElements = [
  IonContent,
  IonList,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
];

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [...UIElements, HeaderComponent, BottomToolbarComponent],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  worldRecipes: any[] = [];
  favoriteRecipes: any[] = [];
  selectedRecipe: any = null;
  userUid: string | null = null;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      this.worldRecipes = await this.recipeService.getWorldRecipes();
      console.log('🌍 World Recipes:', this.worldRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  }

  async viewRecipe(recipe: any) {
    const modal = await this.modalCtrl.create({
      component: RecipeModalComponent,
      componentProps: { recipe },
      showBackdrop: true,
      backdropDismiss: true,
    });

    await modal.present();

    const { data, role } = await modal.onDidDismiss();

    if (role === 'follow' && data) {
      this.router.navigate(['/timer'], {
        state: { recipe: data },
      });
    }
  }

  closeModal(): void {
    this.selectedRecipe = null;
  }

  followSelectedRecipe(): void {
    const selected = this.selectedRecipe;
    this.closeModal();

    setTimeout(() => {
      this.router.navigate(['/timer'], {
        state: { recipe: selected },
      });
    }, 300);
  }
}
