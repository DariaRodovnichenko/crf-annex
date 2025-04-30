import { Component } from '@angular/core';
import { NotesService } from '../../services/notepad/notepad.service';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonInput,
  IonText,
  IonTextarea,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { FormsModule } from '@angular/forms';
import { Note } from '../../interfaces/notes.model';
import { HeaderComponent } from '../../components/header/header.component';
import { BottomToolbarComponent } from '../../components/bottom-toolbar/bottom-toolbar.component';

const UIElements = [
  CommonModule,
  FormsModule,
  IonContent,
  IonText,
  IonTextarea,
  IonTitle,
  IonList,
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardContent,
];

@Component({
  selector: 'app-notepad',
  standalone: true,
  imports: [...UIElements, HeaderComponent, BottomToolbarComponent],
  templateUrl: './notepad.component.html',
  styleUrls: ['./notepad.component.css'],
})
export class NotepadComponent {
  notes: Note[] = [];
  newTitle = '';
  newContent = '';
  addingNote = false;

  constructor(private notesService: NotesService) {
    this.loadNotes();
  }

  async loadNotes(): Promise<void> {
    this.notes = await this.notesService.getNotes();
  }

  startAdding(): void {
    this.addingNote = true;
    this.newTitle = '';
    this.newContent = '';
  }

  cancelAdding(): void {
    this.addingNote = false;
  }

  async saveNote(): Promise<void> {
    const newNote: Note = {
      id: uuidv4(),
      title: this.newTitle.trim() || 'Untitled',
      content: this.newContent.trim(),
      date: new Date().toISOString(),
    };

    await this.notesService.saveNote(newNote);
    await this.loadNotes();
    this.addingNote = false;
  }

  async deleteNote(id: string): Promise<void> {
    await this.notesService.deleteNote(id);
    await this.loadNotes();
  }
}
