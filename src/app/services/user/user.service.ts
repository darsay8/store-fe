import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError, switchMap } from 'rxjs';
import { User } from '../../models/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private dataUrl = 'data/users.json';
  private readonly dataUrl = 'http://localhost:8080/api/users';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.dataUrl);
  }

  getUserById(userId: number): Observable<User | undefined> {
    return this.http.get<User[]>(this.dataUrl).pipe(
      map((users) => {
        return users.find((user) => user.id === userId);
      }),
      catchError((error) => {
        console.error('Error getting user by ID:', error);
        return throwError(error);
      })
    );
  }

  addUser(users: {}): Observable<any> {
    return this.http.post<any>(this.dataUrl, users, this.httpOptions);
  }

  updateUser(user: User): Observable<any> {
    const url = `${this.dataUrl}/${user.id}`;
    return this.http.put<any>(url, user, this.httpOptions).pipe(
      map((response) => {
        console.log('User updated successfully:', response);
        return response;
      }),
      catchError((error) => {
        const errorResponse = new HttpErrorResponse({
          error: 'Error updating user',
          status: error.status || 500,
          statusText: error.statusText || 'Server Error',
          url: url,
        });
        console.error('Error updating user:', errorResponse);
        return throwError(errorResponse);
      })
    );
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.get<any>(this.dataUrl).pipe(
      switchMap((response) => {
        const users = response.data.users;
        const index = users.findIndex((u: User) => u.id === userId);
        if (index !== -1) {
          users.splice(index, 1);
          const usersForSave = { data: { users } };
          return this.http.post<any>(
            this.dataUrl,
            usersForSave,
            this.httpOptions
          );
        } else {
          return throwError(
            new HttpErrorResponse({
              error: `User with ID ${userId} not found.`,
              status: 404,
              statusText: 'Not Found',
              url: this.dataUrl,
            })
          );
        }
      }),
      catchError((error) => {
        console.error('Error deleting user:', error);
        return throwError(error);
      })
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
