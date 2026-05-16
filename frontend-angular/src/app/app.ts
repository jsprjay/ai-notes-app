import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotesService, Note } from './notes.service';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

interface RequestConfig<T> {
  request: Observable<T>;
  onSuccess: (response: T) => void;
  errorMessage: string;
  beforeRequest?: () => void;
  afterRequest?: () => void;
}

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

  searchTerm = '';
  sortOption = 'newest';

  noteCategory = 'General';
  noteTags = '';

  editedCategory = 'General';
  editedTags = '';

  categoryFilter = 'all';

  private clearError(): void {
    this.error = '';
  }

  private setError(message: string): void {
    this.error = message;
  }

  private runRequest<T>(config: RequestConfig<T>): void {
    this.clearError();
    config.beforeRequest?.();

    config.request.subscribe({
      next: (response) => {
        config.onSuccess(response);
        config.afterRequest?.();
        this.clearError();
        this.cdr.detectChanges();
      },
      error: () => {
        config.afterRequest?.();
        this.setError(config.errorMessage);
        this.cdr.detectChanges();
      }
    });
  }

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

  get categories(): string[] {
    return [...new Set(this.notes.map(note => note.category || 'General'))];
  }

  get filteredNotes(): Note[] {
    let filtered = this.notes
    .filter(note =>
      note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      note.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      note.tags.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
    .filter(note =>
      this.categoryFilter === 'all' || note.category === this.categoryFilter
    )
    .slice();

    if (this.sortOption === 'az') {
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (this.sortOption === 'za') {
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    if (this.sortOption === 'newest') {
      filtered = filtered.sort((a, b) => b.id - a.id);
    }

    if (this.sortOption === 'oldest') {
      filtered = filtered.sort((a, b) => a.id - b.id);
    }

    return filtered;
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
          this.authError = '';
          this.loadNotes();
          this.cdr.detectChanges();
        },
        error: () => {
          this.authError = 'Invalid email or password.';
          this.cdr.detectChanges();
        }
      });
    } else {
      this.authService.register(this.email, this.password).subscribe({
        next: () => {
          this.isLoginMode = true;
          this.authError = 'Account created. You can now log in.';
          this.cdr.detectChanges();
        },
        error: () => {
          this.authError = 'Could not create account.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.notes = [];
    this.summary = '';
    this.error = '';
    this.authError = '';
    this.noteTitle = '';
    this.editingNoteId = null;
    this.editedTitle = '';
    this.cdr.detectChanges();
  }

  loadNotes(): void {
    this.runRequest({
      request: this.notesService.getNotes(),
      beforeRequest: () => {
        this.isLoading = true;
      },
      afterRequest: () => {
        this.isLoading = false;
      },
      onSuccess: (data) => {
        this.notes = data;
      },
      errorMessage: 'Could not load notes. Please check if the backend is running.'
    });
  }

  addNote(): void {
    const title = this.noteTitle.trim();

    if (!title) {
      this.setError('Note cannot be empty.');
      this.cdr.detectChanges();
      return;
    }

    this.runRequest({
      request: this.notesService.addNote(title, this.noteCategory, this.noteTags),
      beforeRequest: () => {
        this.isSaving = true;
      },
      afterRequest: () => {
        this.isSaving = false;
      },
      onSuccess: () => {
        this.noteTitle = '';
        this.noteCategory = 'General';
        this.noteTags = '';
        this.loadNotes();
      },
      errorMessage: 'Could not add note. Please try again.'
    });
  }

  deleteNote(id: number): void {
    this.runRequest({
      request: this.notesService.deleteNote(id),
      beforeRequest: () => {
        this.isDeletingId = id;
      },
      afterRequest: () => {
        this.isDeletingId = null;
      },
      onSuccess: () => {
        this.loadNotes();
      },
      errorMessage: 'Could not delete note. Please try again.'
    });
  }

  startEditing(note: Note): void {
    this.editingNoteId = note.id;
    this.editedTitle = note.title;
    this.editedCategory = note.category;
    this.editedTags = note.tags;
    this.clearError();
  }

  cancelEditing(): void {
    this.editingNoteId = null;
    this.editedTitle = '';
    this.clearError();
  }

  saveEdit(id: number): void {
    const title = this.editedTitle.trim();

    if (!title) {
      this.setError('Note cannot be empty.');
      this.cdr.detectChanges();
      return;
    }

    this.runRequest({
      request: this.notesService.updateNote(id, title, this.editedCategory, this.editedTags),
      beforeRequest: () => {
        this.isSaving = true;
      },
      afterRequest: () => {
        this.isSaving = false;
      },
      onSuccess: () => {
        this.editingNoteId = null;
        this.editedTitle = '';
        this.loadNotes();
      },
      errorMessage: 'Could not update note. Please try again.'
    });
  }

  getSummary(): void {
    this.runRequest({
      request: this.notesService.getSummary(),
      beforeRequest: () => {
        this.isSummarizing = true;
      },
      afterRequest: () => {
        this.isSummarizing = false;
      },
      onSuccess: (res) => {
        this.summary = res.summary;
      },
      errorMessage: 'Could not generate summary.'
    });
  }
}