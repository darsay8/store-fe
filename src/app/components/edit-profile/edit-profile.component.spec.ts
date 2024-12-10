import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { StorageService } from '../../services/storage/storage.service';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject, throwError } from 'rxjs';
import { User } from '../../models/models';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userService: jasmine.SpyObj<UserService>;
  let storageService: jasmine.SpyObj<StorageService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 1,
    username: 'john_doe',
    email: 'john@mail.com',
    password: 'Password123',
    role: 'USER',
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
    ]);
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getUserById',
      'updateUser',
    ]);
    const storageServiceSpy = jasmine.createSpyObj('StorageService', [
      'setItem',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    routerSpy.createUrlTree = jasmine
      .createSpy('createUrlTree')
      .and.returnValue('/profile');
    routerSpy.serializeUrl = jasmine
      .createSpy('serializeUrl')
      .and.returnValue('/profile');
    routerSpy.events = new BehaviorSubject(new NavigationStart(0, '/'));
    routerSpy.routerState = {
      root: { firstChild: null, snapshot: {} },
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        RouterModule.forRoot([]),
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: StorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    storageService = TestBed.inject(
      StorageService
    ) as jasmine.SpyObj<StorageService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with user data from authService', () => {
    authService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.editForm.value.username).toBe(mockUser.username);
    expect(component.editForm.value.email).toBe(mockUser.email);
  });

  it('should populate form correctly', () => {
    authService.getCurrentUser.and.returnValue(mockUser);

    component.ngOnInit();
    component.populateForm();

    expect(component.editForm.value.username).toBe(mockUser.username);
    expect(component.editForm.value.email).toBe(mockUser.email);
  });

  it('should handle error when userService.updateUser fails', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();

    component.editForm.controls['username'].setValue('john_doe_updated');
    component.editForm.controls['email'].setValue('john_updated@mail.com');
    fixture.detectChanges();

    userService.getUserById.and.returnValue(of(mockUser));
    userService.updateUser.and.returnValue(throwError('Error updating user'));

    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating user:',
      'Error updating user'
    );
  });

  it('should handle error when userService.getUserById fails', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();

    userService.getUserById.and.returnValue(
      throwError('Error getting user by ID')
    );

    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error getting user by ID:',
      'Error getting user by ID'
    );
  });

  it('should show invalid form when required fields are missing', () => {
    const incompleteUser = { id: 1, username: '', email: '', password: '' };
    authService.getCurrentUser.and.returnValue(incompleteUser);

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.editForm.invalid).toBeTrue();
  });

  it('should handle error when userService.updateUser fails', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();

    component.editForm.controls['username'].setValue('john_doe_updated');
    component.editForm.controls['email'].setValue('john_updated@mail.com');
    fixture.detectChanges();

    userService.getUserById.and.returnValue(of(mockUser));
    userService.updateUser.and.returnValue(throwError('Error updating user'));

    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating user:',
      'Error updating user'
    );
  });

  it('should handle case when user is not found', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();

    userService.getUserById.and.returnValue(of(undefined));

    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith('User with ID 1 not found.');
  });

  it('should log an error when userService.updateUser fails', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();

    component.editForm.controls['username'].setValue('john_doe_updated');
    component.editForm.controls['email'].setValue('john_updated@mail.com');
    fixture.detectChanges();

    userService.getUserById.and.returnValue(of(mockUser));
    userService.updateUser.and.returnValue(throwError('Error updating user'));

    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error updating user:',
      'Error updating user'
    );
  });

  it('should log an error if userService.getUserById returns undefined', () => {
    authService.getCurrentUser.and.returnValue(mockUser);
    component.ngOnInit();

    userService.getUserById.and.returnValue(of(undefined));

    const consoleErrorSpy = spyOn(console, 'error');

    component.onSubmit();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `User with ID ${mockUser.id} not found.`
    );
  });
});
