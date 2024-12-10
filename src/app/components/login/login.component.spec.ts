import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['loginUser']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule], // Use RouterTestingModule here
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with email and password fields', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should make email and password fields required', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.valid).toBeFalse();
    expect(passwordControl?.valid).toBeFalse();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('invalidEmail');
    expect(emailControl?.valid).toBeFalse();

    emailControl?.setValue('test@example.com');
    expect(emailControl?.valid).toBeTrue();
  });

  it('should validate password length', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('short');
    expect(passwordControl?.valid).toBeFalse();

    passwordControl?.setValue('validPassword');
    expect(passwordControl?.valid).toBeTrue();
  });

  it('should call authService.loginUser() on form submission if valid', () => {
    const email = 'test@example.com';
    const password = 'validPassword';

    component.loginForm.get('email')?.setValue(email);
    component.loginForm.get('password')?.setValue(password);

    authService.loginUser.and.returnValue(of(true));

    component.submitForm();
    fixture.detectChanges();

    expect(authService.loginUser).toHaveBeenCalledOnceWith(email, password);
  });

  it('should mark all form fields as touched if the form is invalid', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    component.submitForm();

    expect(emailControl?.touched).toBeTrue();
    expect(passwordControl?.touched).toBeTrue();
  });

  it('should mark nested controls as touched in handleLoginError', () => {
    const group = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    group?.setValue('test');
    passwordControl?.setValue('short');

    component.markFormGroupTouched(component.loginForm);
    fixture.detectChanges();

    expect(group?.touched).toBeTrue();
    expect(passwordControl?.touched).toBeTrue();
  });
});
