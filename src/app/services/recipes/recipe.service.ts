import { Injectable } from '@angular/core';
import { DatabaseService } from '../data/database.service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor(private dbService: DatabaseService) {}

  getUserRecipes(uid: string) {
    return this.dbService.getUserRecipes(uid);
  }

  getUserFavorites(uid: string) {
    return this.dbService.getUserFavorites(uid);
  }

  removeFromFavorites(uid: string, recipeId: string) {
    return this.dbService.removeFromFavorites(uid, recipeId);
  }

  async getWorldRecipes(): Promise<any[]> {
    const data = await this.dbService.getData('recipes');
    if (!data) return [];
    return Object.keys(data).map((id) => ({ id, ...data[id] }));
  }
}
