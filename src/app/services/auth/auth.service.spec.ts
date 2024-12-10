import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from '../storage/storage.service';
import { UserService } from '../user/user.service';
import { of, throwError } from 'rxjs';
import { User } from '../../models/models';

describe('AuthService', () => {
  let authService: AuthService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  // Mock data
  const mockUser: User = {
    id: 1,
    username: 'john_doe',
    email: 'john@mail.com',
    password: 'Password123',
    role: 'USER',
  };

  beforeEach(() => {
    // Create spies for dependencies
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'setItem',
      'getItem',
      'removeItem',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserById',
      'updateUser',
    ]);

    // Provide mocked dependencies
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        AuthService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('registerUser', () => {
    it('should successfully register and login a user', () => {
      const email = 'test@mail.com';
      const username = 'testuser';
      const password = 'password123';

      const mockResponse = { message: 'User registered successfully' };
      const mockLoginResponse = {
        message: 'Authentication successful',
        user: { id: 1, username, email },
      };

      // Mock the HTTP requests
      httpClientSpy.post.and.returnValues(
        of(mockResponse),
        of(mockLoginResponse)
      );

      authService
        .registerUser(email, username, password)
        .subscribe((result) => {
          expect(result).toBeTrue(); // Expect successful registration and login
          expect(httpClientSpy.post).toHaveBeenCalledTimes(2); // Ensure both register and login are called
          expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
            'currentUser',
            mockLoginResponse.user
          );
        });
    });

    it('should fail if registration fails', () => {
      const email = 'test@mail.com';
      const username = 'testuser';
      const password = 'password123';

      const mockResponse = { message: 'Registration failed' };

      // Mock the HTTP request
      httpClientSpy.post.and.returnValue(of(mockResponse));

      authService
        .registerUser(email, username, password)
        .subscribe((result) => {
          expect(result).toBeFalse(); // Expect registration to fail
          expect(httpClientSpy.post).toHaveBeenCalledTimes(1); // Only registration attempt should be made
          expect(storageServiceSpy.setItem).not.toHaveBeenCalled();
        });
    });

    it('should handle registration errors gracefully', () => {
      const email = 'test@mail.com';
      const username = 'testuser';
      const password = 'password123';

      // Simulate an error response
      httpClientSpy.post.and.returnValue(throwError('Registration error'));

      authService
        .registerUser(email, username, password)
        .subscribe((result) => {
          expect(result).toBeFalse(); // Expect registration to fail
          expect(httpClientSpy.post).toHaveBeenCalledTimes(1); // Only registration attempt should be made
        });
    });
  });

  describe('loginUser', () => {
    it('should successfully login a user', () => {
      const email = 'test@mail.com';
      const password = 'password123';

      const mockResponse = {
        message: 'Authentication successful',
        user: { id: 1, username: 'testuser', email },
      };

      // Mock the HTTP request
      httpClientSpy.post.and.returnValue(of(mockResponse));

      authService.loginUser(email, password).subscribe((result) => {
        expect(result).toBeTrue(); // Expect successful login
        expect(storageServiceSpy.setItem).toHaveBeenCalledWith(
          'currentUser',
          mockResponse.user
        );
      });
    });

    it('should fail if login fails', () => {
      const email = 'test@mail.com';
      const password = 'password123';

      const mockResponse = { message: 'Authentication failed' };

      // Mock the HTTP request
      httpClientSpy.post.and.returnValue(of(mockResponse));

      authService.loginUser(email, password).subscribe((result) => {
        expect(result).toBeFalse(); // Expect login failure
        expect(storageServiceSpy.setItem).not.toHaveBeenCalled();
      });
    });

    it('should handle login errors gracefully', () => {
      const email = 'test@mail.com';
      const password = 'password123';

      // Simulate an error response
      httpClientSpy.post.and.returnValue(throwError('Login error'));

      authService.loginUser(email, password).subscribe((result) => {
        expect(result).toBeFalse(); // Expect login to fail
        expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('logoutUser', () => {
    it('should logout the user and navigate to the login page', () => {
      authService.logoutUser();

      expect(storageServiceSpy.removeItem).toHaveBeenCalledWith('currentUser');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getCurrentUser', () => {
    it('should return the current user from storage', () => {
      storageServiceSpy.getItem.and.returnValue(mockUser);

      const currentUser = authService.getCurrentUser();

      expect(currentUser).toEqual(mockUser);
    });

    it('should return null if no user is found', () => {
      storageServiceSpy.getItem.and.returnValue(null);

      const currentUser = authService.getCurrentUser();

      expect(currentUser).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if a user is logged in', () => {
      storageServiceSpy.getItem.and.returnValue({
        id: 1,
        username: 'testuser',
        email: 'test@mail.com',
      });

      const loggedIn = authService.isLoggedIn();

      expect(loggedIn).toBeTrue();
    });

    it('should return false if no user is logged in', () => {
      storageServiceSpy.getItem.and.returnValue(null);

      const loggedIn = authService.isLoggedIn();

      expect(loggedIn).toBeFalse();
    });
  });
});
