import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiURL = "http://127.0.0.1:8000/api/";

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.apiURL + "users")
      .pipe(
        catchError(this.errorHandler)
      )
  }

  getByEmail(email: string): Observable<User[]> {
    return this.httpClient.post<User[]>(this.apiURL + 'users/search-by-email', { email })
      .pipe(
        catchError(this.errorHandler)
      );
  }

  create(user: any): Observable<User> {
    return this.httpClient.post<User>(this.apiURL + "register", JSON.stringify(user), this.httpOptions)
      .pipe(
        catchError(this.errorHandler)
      )
  }

  private errorHandler(error: any): Observable<any> {
    console.error('Error in UserService:', error);
    throw error;
  }

}
