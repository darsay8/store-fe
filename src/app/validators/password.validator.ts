import { FormGroup, ValidationErrors } from '@angular/forms';

export function confirmPasswordValidator(
  group: FormGroup
): ValidationErrors | null {
  const password = group.controls['password'].value;
  const confirmPassword = group.controls['confirmPassword'].value;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
}
