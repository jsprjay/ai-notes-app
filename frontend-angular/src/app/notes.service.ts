import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface Note {
  id: number;
  title: string;
  category: string;
  tags: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'http://127.0.0.1:8000/notes';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  addNote(title: string, category: string, tags: string): Observable<Note> {
    return this.http.post<Note>(
      this.apiUrl,
      { title, category, tags },
      { headers: this.getHeaders() }
    );
  }

  updateNote(id: number, title: string, category: string, tags: string): Observable<Note> {
    return this.http.put<Note>(
      `${this.apiUrl}/${id}`,
      { title, category, tags },
      { headers: this.getHeaders() }
    );
  }

  deleteNote(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  getSummary(): Observable<{ summary: string }> {
    return this.http.get<{ summary: string }>(
      `${this.apiUrl}/summary`,
      { headers: this.getHeaders() }
    );
  }
}