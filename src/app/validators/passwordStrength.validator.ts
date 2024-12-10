import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const password = control.value;

    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const number = /\d/;
    const uppercase = /[A-Z]/;

    if (!specialChar.test(password)) {
      return { specialChar: true };
    }
    if (!number.test(password)) {
      return { number: true };
    }
    if (!uppercase.test(password)) {
      return { uppercase: true };
    }

    return null;
  };
}
