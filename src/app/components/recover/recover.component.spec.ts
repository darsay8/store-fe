import { TestBed } from '@angular/core/testing';
import { RecoverComponent } from './recover.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RecoverComponent', () => {
  let component: RecoverComponent;
  let fb: FormBuilder;

  beforeEach(async () => {
    const activatedRouteMock = {
      snapshot: {
        queryParams: { token: 'mockToken' },
      },
    };

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, RecoverComponent],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fb = TestBed.inject(FormBuilder);
    component = TestBed.createComponent(RecoverComponent).componentInstance;
  });

  it('should mark all controls touched on invalid submission', () => {
    component.ngOnInit();

    component.submitForm();

    expect(component.recoverForm.get('email')?.touched).toBeTrue();
  });

  it('should not submit form if invalid', () => {
    component.ngOnInit();
    spyOn(component, 'showMessage');

    component.submitForm();
    expect(component.showMessage).not.toHaveBeenCalled();
    expect(component.recoverForm.valid).toBeFalsy();
  });

  it('should submit form and show success message on valid email', () => {
    component.ngOnInit();
    spyOn(component, 'showMessage');

    component.recoverForm.setValue({ email: 'test@example.com' });
    component.submitForm();

    expect(component.showMessage).toHaveBeenCalledWith(
      'Password recovery email sent successfully',
      'success'
    );
    expect(component.recoverForm.pristine).toBeTruthy();
  });

  it('should mark all controls touched on invalid submission', () => {
    component.ngOnInit();
    spyOn(component.recoverForm, 'markAllAsTouched');

    component.submitForm();

    expect(component.recoverForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('should set message and type on showMessage call', () => {
    component.ngOnInit();

    component.showMessage('This is a test message', 'error');

    expect(component.message).toBe('This is a test message');
    expect(component.messageType).toBe('error');
  });

  it('should clear message after 5 seconds', () => {
    component.ngOnInit();
    spyOn(window, 'setTimeout');

    component.showMessage('Test message', 'success');

    expect(window.setTimeout).toHaveBeenCalledTimes(1);
  });
});
