import { Injectable, inject } from '@angular/core';
import {
  Database,
  ref,
  get,
  set,
  update,
  remove,
  push,
  DataSnapshot,
} from '@angular/fire/database';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  private db = inject(Database);

  // Write or replace data at a given path
  saveData<T = any>(path: string, data: T): Promise<void> {
    return set(ref(this.db, path), data);
  }

  // Update one or more properties without overwriting the whole object
  updateData<T = any>(path: string, data: Partial<T>): Promise<void> {
    return update(ref(this.db, path), data);
  }

  // Delete data at a path
  deleteData(path: string): Promise<void> {
    return remove(ref(this.db, path));
  }

  // Read data from a path
  async getData<T = any>(path: string): Promise<T | null> {
    const snapshot: DataSnapshot = await get(ref(this.db, path));
    return snapshot.exists() ? (snapshot.val() as T) : null;
  }

  // Push new data to a list path and return the generated key
  async pushData<T = any>(path: string, data: T): Promise<string> {
    const newRef = await push(ref(this.db, path), data);
    return newRef.key as string;
  }

  // Get a single recipe by ID
  async getRecipeById(recipeId: string): Promise<any | null> {
    const data = await this.getData(`recipes/${recipeId}`);
    return data ? { id: recipeId, ...data } : null;
  }

  // Get all created recipes for a user
  async getUserRecipes(uid: string): Promise<any[]> {
    const data = await this.getData<Record<string, any>>(
      `users/${uid}/createdRecipes`
    );
    return data ? Object.values(data) : [];
  }

  // Get all favorite recipes for a user
  async getUserFavorites(uid: string): Promise<any[]> {
    const data = await this.getData<Record<string, any>>(
      `users/${uid}/favorites`
    );
    return data ? Object.values(data) : [];
  }

  // Remove one favorite recipe from a user
  async removeFromFavorites(uid: string, recipeId: string): Promise<void> {
    return this.deleteData(`users/${uid}/favorites/${recipeId}`);
  }
}
