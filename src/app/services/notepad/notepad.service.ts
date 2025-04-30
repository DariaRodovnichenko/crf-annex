import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { DatabaseService } from '../data/database.service';
import { User } from '@angular/fire/auth';
import { Note } from '../../interfaces/notes.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private storageKey = 'baristaNotes';

  private authService = inject(AuthService);
  private dbService = inject(DatabaseService);

  constructor() {}

  async getNotes(): Promise<Note[]> {
    const user: User | null = await this.authService.getCurrentUser();
    if (user && !user.isAnonymous) {
      const notesData = await this.dbService.getData(`users/${user.uid}/notes`);
      return notesData ? Object.values(notesData) : [];
    } else {
      const notesJson = localStorage.getItem(this.storageKey);
      return notesJson ? JSON.parse(notesJson) : [];
    }
  }

  async saveNote(note: Note): Promise<void> {
    const user: User | null = await this.authService.getCurrentUser();
    if (user && !user.isAnonymous) {
      await this.dbService.updateData(
        `users/${user.uid}/notes/${note.id}`,
        note
      );
    } else {
      const notes = await this.getNotes(); // ✅ getNotes has no parameters
      notes.unshift(note);
      localStorage.setItem(this.storageKey, JSON.stringify(notes));
    }
  }

  async deleteNote(id: string): Promise<void> {
    const user: User | null = await this.authService.getCurrentUser();
    if (user && !user.isAnonymous) {
      await this.dbService.deleteData(`users/${user.uid}/notes/${id}`);
    } else {
      const notes = await this.getNotes();
      const filtered = notes.filter((n) => n.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    }
  }
}
