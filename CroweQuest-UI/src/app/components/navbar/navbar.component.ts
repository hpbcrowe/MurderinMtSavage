import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  logout() {
    this.toastr.info(` ${this.accountService.currentUserValue.username}` + " Logged Out.");
    this.accountService.logout();
    this.router.navigate(['/']);
   
  }

}
