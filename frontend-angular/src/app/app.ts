import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService, Note } from './notes.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

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

  summary = '';
  isSummarizing = false;

  email = '';
  password = '';
  isLoginMode = true;
  authError = '';

  constructor(
    private notesService: NotesService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.loadNotes();
    }
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  handleAuth(): void {
    this.authError = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.authError = 'Email and password are required.';
      return;
    }

    if (this.isLoginMode) {
      this.authService.login(this.email, this.password).subscribe({
        next: (res) => {
          this.authService.saveToken(res.access_token);
          this.email = '';
          this.password = '';
          this.loadNotes();
        },
        error: () => {
          this.authError = 'Invalid email or password.';
        }
      });
    } else {
      this.authService.register(this.email, this.password).subscribe({
        next: () => {
          this.isLoginMode = true;
          this.authError = 'Account created. You can now log in.';
        },
        error: () => {
          this.authError = 'Could not create account.';
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.notes = [];
    this.summary = '';
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

  getSummary(): void {
    this.isSummarizing = true;
    this.error = '';

    this.notesService.getSummary().subscribe({
      next: (res) => {
        this.summary = res.summary;
        this.isSummarizing = false;

        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Could not generate summary.';
        this.isSummarizing = false;

        this.cdr.detectChanges();
      }
    });
  }
}