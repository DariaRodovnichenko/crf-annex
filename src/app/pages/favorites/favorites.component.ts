import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '@angular/fire/auth';

// Services
import { AuthService } from '../../services/auth/auth.service';
import { RecipeService } from '../../services/recipes/recipe.service';
import { ToastrService } from 'ngx-toastr';

// Components
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

//Ionic
import {
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  IonModal,
  IonCardHeader,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonListHeader,
} from '@ionic/angular/standalone';

const UIElements = [
  IonContent,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonModal,
  IonCardHeader,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonListHeader,
];

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule,
    ...UIElements,
    HeaderComponent,
    BottomToolbarComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css'],
})
export class FavoritesComponent implements OnInit {
  userRecipes: any[] = [];
  favoriteRecipes: any[] = [];
  selectedRecipe: any = null;
  userUid: string | null = null;

  constructor(
    private recipeService: RecipeService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    const user: User | null = await firstValueFrom(this.authService.authState$);

    console.log('Current user:', user);

    if (!user) {
      console.error('No user found - Firebase auth issue');
      this.toastr.error('Authentication error. Please try reloading the app.');
      return;
    }

    if (!user?.email) {
      console.log('👻 Anonymous user!');
      this.toastr.info(
        "You're browsing as a guest. Full recipe list is disabled.",
        'Guest Mode',
        {
          timeOut: 5000,
          closeButton: true,
          progressBar: true,
        }
      );
    }

    this.userUid = user.uid;

    // Load recipes
    try {
      this.userRecipes = await this.recipeService.getUserRecipes(this.userUid);
      this.favoriteRecipes = await this.recipeService.getUserFavorites(
        this.userUid
      );
      console.log('📖 Created Recipes:', this.userRecipes);
      console.log('⭐ Favorite Recipes:', this.favoriteRecipes);
    } catch (error) {
      console.error('🔥 Failed to load recipes:', error);
      this.toastr.error('Could not load recipes. Please try again later.');
    }
  }

  viewRecipe(recipe: any): void {
    console.log('👀 Viewing recipe:', recipe);
    this.selectedRecipe = recipe;
  }

  closeModal(): void {
    this.selectedRecipe = null;
  }

  removeFromFavorites(recipe: any): void {
    if (!this.userUid || !recipe.id) return;

    this.recipeService.removeFromFavorites(this.userUid, recipe.id).then(() => {
      this.favoriteRecipes = this.favoriteRecipes.filter(
        (r) => r.id !== recipe.id
      );
      this.closeModal();
    });
  }
}
