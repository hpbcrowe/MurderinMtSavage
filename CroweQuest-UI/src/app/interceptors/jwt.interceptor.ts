/***
 * JWT.Interceptor
 * Allows interaction With HTTP
 * Globally
 * Check to see if requested is logged in
 * then it will be sent from API
 * 
 */


import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private accountService: AccountService

  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentUser = this.accountService.currentUserValue;
    //Instead of using this variable we are using the method in the account service
    //const isLoggedIn = currentUser && currentUser.token;
    const isApiUrl = request.url.startsWith(environment.webApi);

    if(this.accountService.isLoggedIn() && isApiUrl){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.token}` 
        }
      })
    }
    return next.handle(request);
  }
}
