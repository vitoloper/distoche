import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { User } from './_models/user';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  authUrl = '/api/authenticate';
  signupUrl = '/api/signup';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  /**
 * Handle errors
 * @param error 
 * 
 */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(error);
    }
    // return an observable with a user-facing error message
    var userMessage;

    if (error.error.message) {
      userMessage = error.error.message;
    } else {
      userMessage = 'Story operation error';
    }

    return throwError(userMessage);
  };

  login(username: string, password: string) {
    return this.http.post<any>(`${this.authUrl}`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  /**
   * Signup
   * 
   * @param data 
   * 
   */
  signup(data: object) {
    return this.http.post<any>(`${this.signupUrl}`, data)
      .pipe(catchError(this.handleError));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }
}
