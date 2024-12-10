import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth/auth.service';
import { confirmPasswordValidator } from '../../validators/confirmPassword.validator';
import { passwordStrengthValidator } from '../../validators/passwordStrength.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            passwordStrengthValidator(),
            Validators.minLength(6),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: confirmPasswordValidator,
      }
    );
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.handleInvalidForm();
      return;
    }

    const { email, username, password } = this.registerForm.value;

    this.authService.registerUser(email, username, password).subscribe(
      (success) => this.handleRegistrationSuccess(success),
      (error) => this.handleRegistrationError(error)
    );
  }

  private handleRegistrationSuccess(success: boolean): void {
    if (success) {
      console.log('Registration and login successful');
      this.router.navigate(['/']);
    } else {
      this.handleRegistrationFailure();
    }
  }

  private handleRegistrationFailure(): void {
    console.error('Registration failed');
  }

  private handleRegistrationError(error: any): void {
    console.error('Registration error:', error);
  }

  private handleInvalidForm(): void {
    this.markFormGroupTouched(this.registerForm);
  }

  resetForm(): void {
    this.registerForm.reset({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    });

    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();

    // Clear all validation errors
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.setErrors(null);
    });
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
