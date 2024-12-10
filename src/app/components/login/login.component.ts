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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submitForm(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.loginUser(email, password).subscribe(
        (isLoggedIn) => this.handleLoginSuccess(isLoggedIn),
        (error) => this.handleLoginError(error)
      );
    } else {
      this.handleInvalidForm();
    }
  }

  private handleLoginSuccess(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      this.router.navigate(['/']);
    } else {
      this.handleLoginFailure();
    }
  }

  private handleLoginFailure(): void {
    console.log('Login failed');
  }

  private handleLoginError(error: any): void {
    console.error('Login error:', error);
  }

  private handleInvalidForm(): void {
    this.markFormGroupTouched(this.loginForm);
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
