import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService, Note } from './notes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],  
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  notes: Note[] = [];
  noteTitle = '';
  error = '';

  editingNoteId: number | null = null;
  editedTitle = '';

  isLoading = false;
  isSaving = false;
  isDeletingId: number | null = null;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.isLoading = true;
    this.error = '';

    this.notesService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Could not load notes. Please check if the backend is running.';
        this.isLoading = false;
      }
    });
  }

  addNote(): void {
    const title = this.noteTitle.trim();

    if (!title) {
      this.error = 'Note cannot be empty.';
      return;
    }

    this.isSaving = true;
    this.error = '';

    this.notesService.addNote(title).subscribe({
      next: () => {
        this.noteTitle = '';
        this.isSaving = false;
        this.loadNotes();
      },
      error: () => {
        this.error = 'Could not add note. Please try again.';
        this.isSaving = false;
      }
    });
  }

  deleteNote(id: number): void {
    this.isDeletingId = id;
    this.error = '';

    this.notesService.deleteNote(id).subscribe({
      next: () => {
        this.isDeletingId = null;
        this.loadNotes();
      },
      error: () => {
        this.error = 'Could not delete note. Please try again.';
        this.isDeletingId = null;
      }
    });
  }

  startEditing(note: Note): void {
    this.editingNoteId = note.id;
    this.editedTitle = note.title;
  }

  cancelEditing(): void {
    this.editingNoteId = null;
    this.editedTitle = '';
  }

  saveEdit(id: number): void {
    const title = this.editedTitle.trim();

    if (!title) {
      this.error = 'Note cannot be empty.';
      return;
    }

    this.isSaving = true;
    this.error = '';

    this.notesService.updateNote(id, title).subscribe({
      next: () => {
        this.editingNoteId = null;
        this.editedTitle = '';
        this.isSaving = false;
        this.loadNotes();
      },
      error: () => {
        this.error = 'Could not update note. Please try again.';
        this.isSaving = false;
      }
    });
  }
}