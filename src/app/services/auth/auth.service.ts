import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/models';
import { UserService } from '../user/user.service';
import { StorageService } from '../storage/storage.service';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authUrl = 'http://localhost:8080/api/auth';
  private currentUser: User | null = null;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(
    private storageService: StorageService,
    private router: Router,
    private readonly userService: UserService,
    private readonly http: HttpClient
  ) {}

  registerUser(
    email: string,
    username: string,
    password: string
  ): Observable<boolean> {
    const registerData = { email, username, password };

    return this.http.post<any>(`${this.authUrl}/register`, registerData).pipe(
      map((response) => {
        if (response.message === 'User registered successfully') {
          console.log('User registered successfully');
          return true;
        } else {
          console.log('Registration failed:', response.message);
          return false;
        }
      }),
      switchMap((registrationSuccess) => {
        if (registrationSuccess) {
          return this.loginUser(email, password);
        }

        return of(false);
      }),
      catchError((error) => {
        console.error('Registration error:', error);
        return of(false);
      })
    );
  }

  loginUser(email: string, password: string): Observable<boolean> {
    const loginData = { email, password };
    return this.http.post<any>(`${this.authUrl}/login`, loginData).pipe(
      map((response) => {
        if (response.message === 'Authentication successful') {
          const user = response.user;
          console.log('Login successful, storing user in local storage:', user);
          this.storageService.setItem('currentUser', user);
          return true;
        } else {
          console.log('Login failed:', response.message);
          return false;
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logoutUser(): void {
    this.storageService.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return (
      this.currentUser || this.storageService.getItem('currentUser') || null
    );
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getItem('currentUser');
  }
  private generateUniqueId(users: User[]): number {
    if (users.length > 0) {
      const maxId = Math.max(...users.map((user) => user.id));
      return maxId + 1;
    } else {
      return 1;
    }
  }
}
