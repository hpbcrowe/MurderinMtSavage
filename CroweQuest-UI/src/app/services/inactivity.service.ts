import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class InactivityService implements OnDestroy {
  private readonly inactivityTimeoutMs = 30 * 60 * 1000;
  private activitySubscription?: Subscription;
  private logoutTimer: any = null;
  private started = false;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  startMonitoring(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    const activity$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'click'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart')
    ).pipe(throttleTime(1000));

    this.activitySubscription = activity$.subscribe(() => this.resetTimer());
    this.resetTimer();
  }

  stopMonitoring(): void {
    this.activitySubscription?.unsubscribe();
    this.activitySubscription = undefined;

    if (this.logoutTimer !== null) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = null;
    }

    this.started = false;
  }

  ngOnDestroy(): void {
    this.stopMonitoring();
  }

  private resetTimer(): void {
    if (this.logoutTimer !== null) {
      clearTimeout(this.logoutTimer);
    }

    this.logoutTimer = window.setTimeout(() => this.handleInactivityTimeout(), this.inactivityTimeoutMs);
  }

  private handleInactivityTimeout(): void {
    if (!this.accountService.isLoggedIn()) {
      return;
    }

    this.accountService.logout();
    this.toastr.warning('You have been logged out due to inactivity.', 'Session Expired');
    this.router.navigate(['/login']);
  }
}
