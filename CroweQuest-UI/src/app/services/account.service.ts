/********
 * SERVICES: WHERE YOU MAKE HTTP CALLS TO THE API SERVICE ON THE BACKEND
 * PLACE WHERE YOU HAVE REUSABLE FUNCTIONALITY THAT YOUR COMPONENTS WILL
 * USE, DOESN'T NECESSARILY HAVE TO HAVE AN HTTP CALL TO THE BACK END SERVICE.
 * OBSERVABLES ARE ONLY FOR FE TO BE COMMUNICATION.
 */



import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApplicationUserCreate } from '../models/account/application-user-create.model';
import { ApplicationUserLogin } from '../models/account/application-user-login.model';
import { ApplicationUser } from '../models/account/application-user.model'

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private currentUserSubject$: BehaviorSubject<ApplicationUser> 

  //USING HTTP AS A DEPENDENCY
  constructor(
    private http: HttpClient
  ) {
    //Had to add the exclamation mark at the end, found answer on
    // stack overflow https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
    this.currentUserSubject$ = new BehaviorSubject<ApplicationUser>(JSON.parse(localStorage.getItem('croweQuest-currentUser')!));

   }

   login(model: ApplicationUserLogin) : Observable<ApplicationUser> {
    // cast the post to  http.post<ApplicationUser> to make error go away.
    return this.http.post<ApplicationUser>(`${environment.webApi}/Account/login`, model).pipe(
      //Had to change ApplicationUser to type any to make errors go away in
      // map(user: ApplicationUser)
      map((user : ApplicationUser) => {
//JSON.stringiy turns object into string
        if (user) {
          localStorage.setItem('croweQuest-currentUser', JSON.stringify(user));
          this.setCurrentUser(user);
        }
        return user;
      })
    )
   }

   register(model: ApplicationUserCreate) : Observable<ApplicationUser> {
    return this.http.post<ApplicationUser>(`${environment.webApi}/Account/register`, model).pipe(
      //Had to change ApplicationUser to type any to make errors go away in
      // map(user: ApplicationUser)
      map((user : ApplicationUser) => {

        if (user) {
          localStorage.setItem('croweQuest-currentUser', JSON.stringify(user));
          this.setCurrentUser(user);
        }
        return user;
      })
    )
  }

   setCurrentUser(user: ApplicationUser){
    this.currentUserSubject$.next(user);
    
   }

   public get currentUserValue() : ApplicationUser {
    return this.currentUserSubject$.value;
   }

   /**
    * givenUserIsLoggedIn()
    * @param username string
    * @returns bool if user is logged in and it is the user that was passed into
    * the function givenUserIsLoggedIn
    */
   public givenUserIsLoggedIn(username: string){
    return this.isLoggedIn() && this.currentUserValue.username === username;

   }
  
   /**
    * isLoggedIn()
    *  checks to see if current user is logged in
    * can be any user not just user that has access to that page
    * @returns bool isLoggedIn
    */

    public isLoggedIn() {
    const currentUser = this.currentUserValue;
      //Taken from JWT Interceptor 
      //If there is a user and they are logged in
      const isLoggedIn = !!currentUser && !!currentUser.token;
      return isLoggedIn;
   }


   logout() {
    localStorage.removeItem('croweQuest-currentUser');
    //using localStorage.clear instead of this.currentUserSubject$.next(null!);
    //Got this to work adding the ! operator answer from Stack Overflow
    this.currentUserSubject$.next(null!);
    localStorage.clear;
   }
}
