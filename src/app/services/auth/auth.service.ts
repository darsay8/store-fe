import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/models';
import { UserService } from '../user/user.service';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(
    private storageService: StorageService,
    private router: Router,
    private userService: UserService
  ) {}

  registerUser(email: string, password: string, username: string): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        const id = this.generateUniqueId(users);
        const newUser = { id, email, password, username };
        users.push(newUser);
        const usersForSave = { data: { users } };
        this.userService.addUser(usersForSave).subscribe(
          () => {
            this.loginUser(email, password);
          },
          (error) => {
            console.error('Error at register:', error);
          }
        );

        this.storageService.setItem('users', users);
      },
      (error) => {
        console.error('Error getting users:', error);
      }
    );
  }

  loginUser(email: string, password: string): boolean {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        const user = users.find(
          (u) => u.email === email && u.password === password
        );
        if (user) {
          const { id, username, email } = user;
          this.storageService.setItem('currentUser', {
            id,
            username,
            email,
          });
          return true;
        } else {
          return false;
        }
      },
      (error) => {
        console.error('Error fetching users', error);
        return false;
      }
    );
    return false;
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

  private generateUniqueId(users: User[]): number {
    if (users.length > 0) {
      const maxId = Math.max(...users.map((user) => user.id));
      return maxId + 1;
    } else {
      return 1;
    }
  }
}
