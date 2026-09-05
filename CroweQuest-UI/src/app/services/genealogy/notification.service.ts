import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Notification } from '../../models/genealogy/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${environment.webApi}/Notification`);
  }

  markRead(notificationId: number): Observable<number> {
    return this.http.patch<number>(`${environment.webApi}/Notification/${notificationId}/read`, {});
  }

  markAllRead(): Observable<number> {
    return this.http.patch<number>(`${environment.webApi}/Notification/read-all`, {});
  }
}