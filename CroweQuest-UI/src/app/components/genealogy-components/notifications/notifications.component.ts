import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Notification } from 'src/app/models/genealogy/notification.model';
import { NotificationService } from 'src/app/services/genealogy/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html'
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private meta: Meta,
    private title: Title
  ) {
    this.meta.addTags([
      { name: 'description', content: 'Genealogy notifications' },
      { name: 'author', content: 'Ben Crowe / open-source code' },
      { name: 'keywords', content: 'Genealogy, Notifications, Family History' }
    ]);
    this.title.setTitle('Notifications');
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.notificationService.getAll().subscribe((notifications) => (this.notifications = notifications));
  }

  markRead(notificationId: number): void {
    this.notificationService.markRead(notificationId).subscribe(() => this.load());
  }

  markAllRead(): void {
    this.notificationService.markAllRead().subscribe(() => this.load());
  }
}