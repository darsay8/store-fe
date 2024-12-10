import { FormControl } from '@angular/forms';
import { passwordStrengthValidator } from './passwordStrength.validator';

describe('passwordStrengthValidator', () => {
  // Test Case 1: Password is empty
  it('should return null if the password is empty', () => {
    const control = new FormControl('');
    const result = passwordStrengthValidator()(control);
    expect(result).toBeNull(); // No error for empty password
  });

  // Test Case 2: Password missing special character
  it('should return { specialChar: true } if the password is missing a special character', () => {
    const control = new FormControl('Password123');
    const result = passwordStrengthValidator()(control);
    expect(result).toEqual({ specialChar: true }); // Error due to missing special character
  });

  // Test Case 3: Password missing number
  it('should return { number: true } if the password is missing a number', () => {
    const control = new FormControl('Password@');
    const result = passwordStrengthValidator()(control);
    expect(result).toEqual({ number: true }); // Error due to missing number
  });

  // Test Case 4: Password missing uppercase letter
  it('should return { uppercase: true } if the password is missing an uppercase letter', () => {
    const control = new FormControl('password@123');
    const result = passwordStrengthValidator()(control);
    expect(result).toEqual({ uppercase: true }); // Error due to missing uppercase letter
  });

  // Test Case 5: Password meets all criteria (special character, number, uppercase letter)
  it('should return null if the password contains a special character, number, and uppercase letter', () => {
    const control = new FormControl('Password@123');
    const result = passwordStrengthValidator()(control);
    expect(result).toBeNull(); // No error for a valid password
  });
});
