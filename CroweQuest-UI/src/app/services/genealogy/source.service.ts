import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SourceCreate } from '../../models/genealogy/source-create.model';
import { Source } from '../../models/genealogy/source.model';

@Injectable({ providedIn: 'root' })
export class SourceService {
  constructor(private http: HttpClient) {}

  getAll(query?: string): Observable<Source[]> {
    const queryString = query ? `?query=${encodeURIComponent(query)}` : '';
    return this.http.get<Source[]>(`${environment.webApi}/Source${queryString}`);
  }

  get(sourceId: number): Observable<Source> {
    return this.http.get<Source>(`${environment.webApi}/Source/${sourceId}`);
  }

  create(model: SourceCreate): Observable<Source> {
    return this.http.post<Source>(`${environment.webApi}/Source`, model);
  }

  delete(sourceId: number): Observable<number> {
    return this.http.delete<number>(`${environment.webApi}/Source/${sourceId}`);
  }
}