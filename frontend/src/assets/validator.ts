import { AbstractControl, ValidationErrors } from '@angular/forms';

/** Validación: Solo se aceptan números */
export function numericValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[0-9]*$/.test(control.value);
  return valid ? null : { numeric: true };
}

/** Validación de email */
export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(control.value);
  return valid ? null : { email: true };
}

/** Validación de DNI, cantidad aceptada: 8 números */
export function dniValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[0-9]{8}$/.test(control.value);
  return valid ? null : { dni: true };
}

/** Validación de RUC, cantidad aceptada: 11 números */
export function rucValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[0-9]{11}$/.test(control.value);
  return valid ? null : { ruc: true };
}

/** Validación de Carnet Extranjería, cantidad aceptada: 12 números */
export function ceValidator(control: AbstractControl): ValidationErrors | null {
  const valid = /^[0-9]{12}$/.test(control.value);
  return valid ? null : { ce: true };
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