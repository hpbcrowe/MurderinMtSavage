import { Component, OnDestroy, OnInit } from '@angular/core';
import { InactivityService } from './services/inactivity.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CroweQuest-UI';

  constructor(
    private inactivityService: InactivityService
  ) {}

  ngOnInit(): void {
    this.inactivityService.startMonitoring();
  }

  ngOnDestroy(): void {
    this.inactivityService.stopMonitoring();
  }
}
