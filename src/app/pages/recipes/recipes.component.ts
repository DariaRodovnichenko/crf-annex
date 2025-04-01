import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/data/database.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { User } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  userRecipes: any[] = [];
  favoriteRecipes: any[] = [];
  selectedRecipe: any = null;
  userUid: string | null = null;

  constructor(
    private dbService: DatabaseService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit(): Promise<void> {
    const user: User | null = await firstValueFrom(this.authService.authState$);

    if (!user) {
      console.warn('User not logged in');
      this.router.navigate(['/']);
      return;
    }

    if (user.isAnonymous) {
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

    // ✅ Load recipes
    this.userRecipes = await this.dbService.getUserRecipes(this.userUid);
    this.favoriteRecipes = await this.dbService.getUserFavorites(this.userUid);

    console.log('📖 Created Recipes:', this.userRecipes);
    console.log('⭐ Favorite Recipes:', this.favoriteRecipes);
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

    this.dbService.removeFromFavorites(this.userUid, recipe.id).then(() => {
      this.favoriteRecipes = this.favoriteRecipes.filter(
        (r) => r.id !== recipe.id
      );
      this.closeModal();
    });
  }
}
