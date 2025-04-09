/***********************
 * INTERCEPTOR: TOOL FROM ANGULAR
 * CAN HOOK INTO HTTP REQUEST AND CAN WRITE THINGS
 * TO THE RESPONSE THIS CAN BE DONE GLOBALLY
 *  THIS MODIFIES THE RESPONSE CAN SET HEADERS, ETC
 * ERROR INTERCEPTOR IS GLOBAL FRONT END ERROR HANDLING
 * ON THE BACKEND THERE IS MIDDLEWARE TO HANDLE THIS
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private accountService: AccountService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          switch (error.status) {
            case 400:
              this.handle400Error(error);
              break;
            case 401:
              this.handle401Error(error);
              break;
            case 500:
              this.handle500Error(error);
              break;
            default:
              this.handleUnexpectedError(error);
              break;
          }
        }

        return throwError(error);
      })
    );
  }

  //handle 400 error validation error
  handle400Error(error: any) {
    if (!!error.error && Array.isArray(error.error)) {
      let errorMessage = '';
      for (const key in error.error) {
        if (!!error.error[key]) {
          const errorElement = error.error[key];
          errorMessage = `${errorMessage}${errorElement.code} - ${errorElement.description}\n`;
        }
      }
      this.toastr.error(errorMessage, error.statusText);
      console.log(error.error);
    } else if (
      !!error?.error?.errors?.Content &&
      typeof error.error.errors.Content === 'object'
    ) {
      let errorObject = error.error.errors.Content;
      let errorMessage = '';
      for (const key in errorObject) {
        const errorElement = errorObject[key];
        errorMessage = `${errorMessage}${errorElement}\n`;
      }
      this.toastr.error(errorMessage, error.statusCode);
      console.log(error.error);
    } else if (!!error.error) {
      let errorMessage =
        typeof error.error === 'string'
          ? error.error
          : 'There was a validation error.';
      this.toastr.error(errorMessage, error.statusCode);
      console.log(error.error);
    } else {
      this.toastr.error(error.statusText, error.status);
      console.log(error);
    }
  }
  //401 error is not authorized
  handle401Error(error: any) {
    let errorMessage = 'Please login to your account.';
    this.accountService.logout();
    this.toastr.error(errorMessage, error.statusText);
    this.router.navigate(['/login']);
  }
  // 500 server error
  handle500Error(error: any) {
    this.toastr.error(
      'Please contact the administrator. An error occurred in the server.'
    );
    console.log(error);
  }

  handleUnexpectedError(error: any) {
    this.toastr.error(
      'Something unexpected happened. This is an error other than 400, 401, 500'
    );
    console.log(error);
  }
}
