/****************
 * AUTH Guard
 * Protects routing in Angular
 * Verifies user is logged in....
 * Only allows logged in users to visit
 * certain endpoints.
 * protects certain paths, only allows logged in users
 * to view certain components
 * true security should be on the back end
 * (jwt tokens) 
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
//I don't know what the following is
//import { runInThisContext } from 'vm';
import { AccountService } from '../services/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private accountService: AccountService,
    private router: Router

  ){  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean  {
   
      

      if(this.accountService.isLoggedIn()){
        return true;
      }
      //(Per Angular Docs)
      //Had to change to this from 
      //this.router.navigate['/']
      this.router.navigate(['/']);
      return false;
  }
  
}
