import {
  Injectable,
  inject,
  Injector,
  runInInjectionContext,
} from '@angular/core';
import {
  Database,
  ref,
  get,
  set,
  update,
  remove,
  push,
} from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db = inject(Database);
  private injector = inject(Injector);

  // Save any data to a specific path
  async saveData(path: string, data: any): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const dataRef = ref(this.db, path);
      return set(dataRef, data);
    });
  }

  // Update data without overwriting entire object
  async updateData(path: string, data: any): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const dataRef = ref(this.db, path);
      return update(dataRef, data);
    });
  }

  // Delete data at a specific path
  async deleteData(path: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const dataRef = ref(this.db, path);
      return remove(dataRef);
    });
  }

  // Get data from a specific path
  async getData(path: string): Promise<any> {
    return runInInjectionContext(this.injector, async () => {
      const dataRef = ref(this.db, path);
      const snapshot = await get(dataRef);
      return snapshot.exists() ? snapshot.val() : null;
    });
  }

  async pushData(path: string, data: any): Promise<any> {
    return runInInjectionContext(this.injector, () => {
      const listRef = ref(this.db, path);
      return push(listRef, data);
    });
  }

  // Get recipe by ID from /recipes
  async getRecipeById(recipeId: string): Promise<any> {
    return runInInjectionContext(this.injector, async () => {
      const recipeRef = ref(this.db, `recipes/${recipeId}`);
      const snapshot = await get(recipeRef);
      return snapshot.exists() ? { id: recipeId, ...snapshot.val() } : null;
    });
  }

  // Get user's created recipes
  async getUserRecipes(uid: string): Promise<any[]> {
    return runInInjectionContext(this.injector, async () => {
      const recipesRef = ref(this.db, `users/${uid}/createdRecipes`);
      const snapshot = await get(recipesRef);
      return snapshot.exists() ? Object.values(snapshot.val()) : [];
    });
  }

  // Get full recipe objects from user favorites
  async getUserFavorites(uid: string): Promise<any[]> {
    return runInInjectionContext(this.injector, async () => {
      const favRef = ref(this.db, `users/${uid}/favorites`);
      const snapshot = await get(favRef);
      return snapshot.exists() ? Object.values(snapshot.val()) : [];
    });
  }

  async removeFromFavorites(uid: string, recipeId: string): Promise<void> {
    return runInInjectionContext(this.injector, () => {
      const path = `users/${uid}/favorites/${recipeId}`;
      return remove(ref(this.db, path));
    });
  }
}
