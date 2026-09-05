import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AncestorProfileCreate } from '../../models/genealogy/ancestor-profile-create.model';
import { AncestorProfile } from '../../models/genealogy/ancestor-profile.model';
import { AncestorRelationship } from '../../models/genealogy/ancestor-relationship.model';

@Injectable({ providedIn: 'root' })
export class AncestorProfileService {
  constructor(private http: HttpClient) {}

  getAll(query?: string): Observable<AncestorProfile[]> {
    const queryString = query ? `?query=${encodeURIComponent(query)}` : '';
    return this.http.get<AncestorProfile[]>(`${environment.webApi}/AncestorProfile${queryString}`);
  }

  get(ancestorProfileId: number): Observable<AncestorProfile> {
    return this.http.get<AncestorProfile>(`${environment.webApi}/AncestorProfile/${ancestorProfileId}`);
  }

  create(model: AncestorProfileCreate): Observable<AncestorProfile> {
    return this.http.post<AncestorProfile>(`${environment.webApi}/AncestorProfile`, model);
  }

  delete(ancestorProfileId: number): Observable<number> {
    return this.http.delete<number>(`${environment.webApi}/AncestorProfile/${ancestorProfileId}`);
  }

  follow(ancestorProfileId: number): Observable<number> {
    return this.http.post<number>(`${environment.webApi}/AncestorProfile/${ancestorProfileId}/followers`, {});
  }

  unfollow(ancestorProfileId: number): Observable<number> {
    return this.http.delete<number>(`${environment.webApi}/AncestorProfile/${ancestorProfileId}/followers`);
  }

  addRelationship(ancestorProfileId: number, model: AncestorRelationship): Observable<number> {
    return this.http.post<number>(`${environment.webApi}/AncestorProfile/${ancestorProfileId}/relationships`, model);
  }
}