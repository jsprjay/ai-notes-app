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

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.loadNotes();
  }

  loadNotes(): void {
    this.notesService.getNotes().subscribe({
      next: (data) => {
        this.notes = data;
      },
      error: () => {
        this.error = 'Could not load notes.';
      }
    });
  }

  addNote(): void {
    const title = this.noteTitle.trim();

    if (!title) {
      this.error = 'Note cannot be empty.';
      return;
    }

    this.notesService.addNote(title).subscribe({
      next: () => {
        this.noteTitle = '';
        this.error = '';
        this.loadNotes();
      },
      error: () => {
        this.error = 'Could not add note.';
      }
    });
  }

  deleteNote(id: number): void {
    this.notesService.deleteNote(id).subscribe({
      next: () => {
        this.loadNotes();
      },
      error: () => {
        this.error = 'Could not delete note.';
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

  this.notesService.updateNote(id, title).subscribe({
    next: () => {
      this.editingNoteId = null;
      this.editedTitle = '';
      this.error = '';
      this.loadNotes();
    },
    error: () => {
      this.error = 'Could not update note.';
    }
  });
}
}