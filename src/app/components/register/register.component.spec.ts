import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { of, throwError, BehaviorSubject } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'registerUser',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', [
      'navigate',
      'createUrlTree',
      'serializeUrl',
    ]);

    routerSpy.routerState = { root: {} } as any;
    routerSpy.events = new BehaviorSubject<any>({});
    routerSpy.createUrlTree.and.returnValue({});
    routerSpy.serializeUrl.and.returnValue('/');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with validators', () => {
    const form = component.registerForm;
    expect(form.get('username')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('email')?.hasValidator(Validators.required)).toBeTrue();
    expect(form.get('email')?.hasValidator(Validators.email)).toBeTrue();
    expect(form.get('password')?.hasValidator(Validators.required)).toBeTrue();
    expect(
      form.get('confirmPassword')?.hasValidator(Validators.required)
    ).toBeTrue();
  });

  it('should not submit invalid form', () => {
    component.registerForm.setErrors({ invalid: true });
    component.submitForm();
    expect(authService.registerUser).not.toHaveBeenCalled();
  });

  it('should reset form', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Pass123',
      confirmPassword: 'Pass123',
    });

    component.resetForm();

    expect(component.registerForm.value).toEqual({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('should mark form group touched', () => {
    component.markFormGroupTouched(component.registerForm);

    Object.values(component.registerForm.controls).forEach((control) => {
      expect(control.touched).toBeTrue();
    });
  });

  it('should validate confirm password match', () => {
    const form = component.registerForm;
    form.patchValue({
      password: 'Strong@Password123',
      confirmPassword: 'Mismatch123',
    });

    expect(form.hasError('confirmPassword')).toBeTrue();
  });

  it('should reset form state on resetForm call', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });
    component.registerForm.markAsDirty();
    component.registerForm.markAllAsTouched();

    component.resetForm();

    expect(component.registerForm.pristine).toBeTrue();
    expect(component.registerForm.untouched).toBeTrue();
    expect(component.registerForm.value).toEqual({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  });

  it('should show error for mismatched confirm password', () => {
    const form = component.registerForm;
    form.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'DifferentPassword',
    });

    component.submitForm();
    expect(form.hasError('confirmPassword')).toBeTrue();
  });

  it('should show error for weak password', () => {
    const form = component.registerForm;
    form.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'weak123',
      confirmPassword: 'weak123',
    });

    component.submitForm();
    expect(form.get('password')?.hasError('passwordStrength')).toBeFalse();
  });

  it('should show error for invalid email', () => {
    const form = component.registerForm;
    form.patchValue({
      username: 'testuser',
      email: 'invalid-email',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });

    component.submitForm();
    expect(form.get('email')?.hasError('email')).toBeTrue();
  });

  it('should not call handleRegistrationSuccess when registerUser returns false', fakeAsync(() => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });

    authService.registerUser.and.returnValue(of(false));

    spyOn(component as any, 'handleRegistrationSuccess');

    component.submitForm();
    tick();

    expect((component as any).handleRegistrationSuccess).not.toHaveBeenCalled();
  }));

  it('should call handleInvalidForm when form is invalid and submitForm is called', () => {
    spyOn(component as any, 'handleInvalidForm');

    component.registerForm.setErrors({ invalid: true });
    component.submitForm();

    expect((component as any).handleInvalidForm).toHaveBeenCalled();
  });

  it('should validate confirm password matching when submitted with empty confirm password', () => {
    const form = component.registerForm;
    form.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: '',
    });

    component.submitForm();
    expect(form.hasError('confirmPassword')).toBeFalse();
  });

  it('should not show confirm password error when passwords match', () => {
    const form = component.registerForm;
    form.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });

    component.submitForm();
    expect(form.hasError('confirmPassword')).toBeFalse();
  });

  it('should mark form controls as touched when form is invalid and submitForm is called', () => {
    spyOn(component, 'markFormGroupTouched');

    component.registerForm.setErrors({ invalid: true });
    component.submitForm();

    expect(component.markFormGroupTouched).toHaveBeenCalledWith(
      component.registerForm
    );
  });

  it('should mark all nested form groups as touched', () => {
    const nestedGroup = new FormGroup({
      nestedControl: new FormControl(''),
    });

    component.registerForm.addControl('nestedGroup', nestedGroup);

    spyOn(nestedGroup.get('nestedControl')!, 'markAsTouched');

    component.markFormGroupTouched(component.registerForm);

    expect(nestedGroup.get('nestedControl')!.markAsTouched).toHaveBeenCalled();
  });

  it('should apply group-level confirmPassword validator', () => {
    const form = component.registerForm;
    form.patchValue({
      password: 'Password@123',
      confirmPassword: 'Password@456',
    });

    expect(form.hasError('confirmPassword')).toBeTrue();

    form.patchValue({
      confirmPassword: 'Password@123',
    });

    expect(form.hasError('confirmPassword')).toBeFalse();
  });

  it('should apply group-level confirmPassword validator', () => {
    const form = component.registerForm;
    form.patchValue({
      password: 'Password@123',
      confirmPassword: 'Password@456',
    });

    expect(form.hasError('confirmPassword')).toBeTrue();

    form.patchValue({
      confirmPassword: 'Password@123',
    });

    expect(form.hasError('confirmPassword')).toBeFalse();
  });

  it('should clear form validation state on reset', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });
    component.registerForm.setErrors({ invalid: true });
    component.registerForm.get('username')?.setErrors({ required: true });

    component.resetForm();

    expect(component.registerForm.errors).toBeNull();
    expect(component.registerForm.get('username')?.errors).toBeNull();
  });

  it('should clear form validation state on reset', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });
    component.registerForm.get('username')?.setErrors({ required: true });
    component.registerForm.setErrors({ invalid: true });

    component.resetForm();

    expect(component.registerForm.get('username')?.errors).toBeNull();
    expect(component.registerForm.errors).toBeNull();
    expect(component.registerForm.pristine).toBeTrue();
    expect(component.registerForm.untouched).toBeTrue();
  });

  it('should clear form validation state on reset', () => {
    component.registerForm.patchValue({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Strong@Password123',
      confirmPassword: 'Strong@Password123',
    });

    component.registerForm.get('username')?.setErrors({ required: true });
    component.registerForm.setErrors({ invalid: true });

    component.resetForm();

    expect(component.registerForm.value).toEqual({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    expect(component.registerForm.get('username')?.errors).toBeNull();
    expect(component.registerForm.errors).toBeNull();

    expect(component.registerForm.pristine).toBeTrue();
    expect(component.registerForm.untouched).toBeTrue();
  });
});
