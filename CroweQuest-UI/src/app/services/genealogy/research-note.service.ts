import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResearchNoteCreate } from '../../models/genealogy/research-note-create.model';
import { ResearchNote } from '../../models/genealogy/research-note.model';

@Injectable({ providedIn: 'root' })
export class ResearchNoteService {
  constructor(private http: HttpClient) {}

  getAll(ancestorProfileId?: number): Observable<ResearchNote[]> {
    const queryString = ancestorProfileId ? `?ancestorProfileId=${ancestorProfileId}` : '';
    return this.http.get<ResearchNote[]>(`${environment.webApi}/ResearchNote${queryString}`);
  }

  get(researchNoteId: number): Observable<ResearchNote> {
    return this.http.get<ResearchNote>(`${environment.webApi}/ResearchNote/${researchNoteId}`);
  }

  create(model: ResearchNoteCreate): Observable<ResearchNote> {
    return this.http.post<ResearchNote>(`${environment.webApi}/ResearchNote`, model);
  }

  delete(researchNoteId: number): Observable<number> {
    return this.http.delete<number>(`${environment.webApi}/ResearchNote/${researchNoteId}`);
  }
}