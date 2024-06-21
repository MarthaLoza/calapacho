import { AbstractControl, ValidationErrors } from '@angular/forms';

export function numericValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[0-9]*$/.test(control.value);
  return valid ? null : { numeric: true };
}

export function minLengthValidator(minLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value && control.value.length >= minLength;
    return valid ? null : { minLength: { requiredLength: minLength, actualLength: control.value ? control.value.length : 0 } };
  };
}

export function maxLengthValidator(maxLength: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const valid = control.value && control.value.length <= maxLength;
    return valid ? null : { maxLength: { requiredLength: maxLength, actualLength: control.value ? control.value.length : 0 } };
  };
}

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(control.value);
  return valid ? null : { email: true };
}
