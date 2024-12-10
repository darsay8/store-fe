import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../../models/models';
import { HttpErrorResponse } from '@angular/common/http';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUsers: User[] = [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@mail.com',
      password: '123456',
      role: 'USER',
    },
    {
      id: 2,
      username: 'jane_doe',
      email: 'jane@mail.com',
      password: '123456',
      role: 'ADMIN',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should retrieve all users from the API', () => {
      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('getUserById', () => {
    it('should retrieve a user by ID from the API', () => {
      const userId = 1;
      service.getUserById(userId).subscribe((user) => {
        expect(user).toEqual(mockUsers[0]);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users');
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });

    it('should return undefined if user not found', () => {
      const userId = 3;
      service.getUserById(userId).subscribe((user) => {
        expect(user).toBeUndefined();
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users');
      req.flush(mockUsers);
    });
  });

  describe('addUser', () => {
    it('should add a new user and return the created user', () => {
      const newUser = {
        username: 'new_user',
        email: 'new@mail.com',
        role: 'USER',
      };
      const response = { id: 3, ...newUser };

      service.addUser(newUser).subscribe((user) => {
        expect(user).toEqual(response);
      });

      const req = httpMock.expectOne('http://localhost:8080/api/users');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(response);
    });
  });

  describe('updateUser', () => {
    it('should update the user and return the updated user', () => {
      const updatedUser: User = {
        id: 1,
        username: 'john_updated',
        email: 'john_updated@mail.com',
        password: '123456',
        role: 'USER',
      };

      service.updateUser(updatedUser).subscribe((user) => {
        expect(user).toEqual(updatedUser);
      });

      const req = httpMock.expectOne(`http://localhost:8080/api/users/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedUser);
      req.flush(updatedUser);
    });

    describe('updateUser', () => {
      it('should handle error when updating user and call console.error', () => {
        const updatedUser: User = {
          id: 1,
          username: 'john_updated',
          email: 'john_updated@mail.com',
          password: '123456',
          role: 'USER',
        };

        const errorResponse = { status: 500, message: 'Server Error' };

        spyOn(console, 'error');

        service.updateUser(updatedUser).subscribe(
          () => fail('expected an error, not an update response'),
          (error) => {
            expect(error.status).toBe(500);
            expect(error.statusText).toBe('Server Error');
            expect(console.error).toHaveBeenCalledWith(
              'Error updating user:',
              error
            );
          }
        );

        const req = httpMock.expectOne(`http://localhost:8080/api/users/1`);
        expect(req.request.method).toBe('PUT');
        req.flush(errorResponse, { status: 500, statusText: 'Server Error' });
      });
    });
  });

  describe('deleteUser', () => {
    describe('deleteUser', () => {
      it('should handle error when deleting a user and call console.error', () => {
        const userId = 1;

        const errorResponse = { status: 404, message: 'User Not Found' };

        spyOn(console, 'error');

        service.deleteUser(userId).subscribe(
          () => fail('expected an error, not a delete response'),
          (error) => {
            expect(error.status).toBe(404);
            expect(error.statusText).toBe('Not Found');
            expect(error.error).toBe(`User with ID ${userId} not found.`);
            expect(console.error).toHaveBeenCalledWith(
              'Error deleting user:',
              error
            );
          }
        );

        const getReq = httpMock.expectOne('http://localhost:8080/api/users');
        expect(getReq.request.method).toBe('GET');
        getReq.flush({ data: { users: [] } });

        httpMock.verify();
      });
    });

    it('should delete a user and return success', () => {
      const userId = 1;
      const usersBeforeDelete: User[] = [
        {
          id: 1,
          username: 'john_doe',
          email: 'john@mail.com',
          password: '123456',
          role: 'USER',
        },
        {
          id: 2,
          username: 'jane_doe',
          email: 'jane@mail.com',
          password: '123456',
          role: 'USER',
        },
      ];

      const usersAfterDelete: User[] = [
        {
          id: 2,
          username: 'jane_doe',
          email: 'jane@mail.com',
          password: '123456',
          role: 'USER',
        },
      ];

      service.deleteUser(userId).subscribe(
        (response) => {
          expect(response).toBeTruthy();
        },
        (error) => fail('expected a successful delete operation, not an error')
      );

      const getReq = httpMock.expectOne('http://localhost:8080/api/users');
      expect(getReq.request.method).toBe('GET');
      getReq.flush({ data: { users: usersBeforeDelete } });

      const postReq = httpMock.expectOne('http://localhost:8080/api/users');
      expect(postReq.request.method).toBe('POST');
      postReq.flush({ success: true });

      httpMock.verify();
    });

    it('should handle error when deleting a user', () => {
      const userId = 1;

      service.deleteUser(userId).subscribe(
        () => fail('expected an error, not a successful delete operation'),
        (error: any) => {
          expect(error instanceof HttpErrorResponse).toBe(true);

          expect(error.status).toBe(404);
          expect(error.statusText).toBe('Not Found');
          expect(error.error).toBe(`User with ID ${userId} not found.`);
        }
      );

      const getReq = httpMock.expectOne('http://localhost:8080/api/users');
      expect(getReq.request.method).toBe('GET');
      getReq.flush({ data: { users: [] } });

      httpMock.verify();
    });
  });

  describe('handleError', () => {
    it('should log error and propagate it', () => {
      const error = { status: 500, message: 'Server Error' };

      // Spy on console.error to verify logging
      spyOn(console, 'error');

      service['handleError'](error).subscribe(
        () => fail('expected an error, not a response'),
        (err) => {
          expect(err).toEqual(error);
          expect(console.error).toHaveBeenCalledWith(
            'An error occurred:',
            error
          );
        }
      );
    });
  });
});
