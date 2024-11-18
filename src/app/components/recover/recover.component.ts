import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.scss',
})
export class RecoverComponent implements OnInit {
  recoverForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    if (this.recoverForm.valid) {
      // console.log('Recover form submitted', this.recoverForm.value.email);

      this.showMessage('Password recovery email sent successfully', 'success');

      this.recoverForm.reset();
    } else {
      this.recoverForm.markAllAsTouched();
    }
  }

  showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;

    // Clear message after 5 seconds
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}
