import { FormBuilder, FormGroup } from '@angular/forms';
import { confirmPasswordValidator } from './confirmPassword.validator';

describe('confirmPasswordValidator', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  it('should return null if both password and confirmPassword are empty', () => {
    const formGroup: FormGroup = fb.group({
      password: [''],
      confirmPassword: [''],
    });

    const result = confirmPasswordValidator(formGroup);

    expect(result).toBeNull(); // No validation error when both are empty
  });

  it('should return null if password and confirmPassword match', () => {
    const formGroup: FormGroup = fb.group({
      password: ['Password123'],
      confirmPassword: ['Password123'],
    });

    const result = confirmPasswordValidator(formGroup);

    expect(result).toBeNull(); // No validation error when they match
  });

  it('should return { confirmPassword: true } if password and confirmPassword do not match', () => {
    const formGroup: FormGroup = fb.group({
      password: ['Password123'],
      confirmPassword: ['DifferentPassword'],
    });

    const result = confirmPasswordValidator(formGroup);

    expect(result).toEqual({ confirmPassword: true }); // Validation error when they don't match
  });

  it('should return null if only one of password or confirmPassword is empty', () => {
    // Only password is filled
    const formGroup1: FormGroup = fb.group({
      password: ['Password123'],
      confirmPassword: [''],
    });

    const result1 = confirmPasswordValidator(formGroup1);
    expect(result1).toBeNull(); // No validation error if confirmPassword is empty

    // Only confirmPassword is filled
    const formGroup2: FormGroup = fb.group({
      password: [''],
      confirmPassword: ['Password123'],
    });

    const result2 = confirmPasswordValidator(formGroup2);
    expect(result2).toBeNull(); // No validation error if password is empty
  });
});
