import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';

export function onlyNumbersAsyncValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    if (!control.value) {
      return Promise.resolve(null);
    }

    const isNumber = /^[0-9]*$/.test(control.value);

    if (!isNumber) {
      return Promise.resolve({ onlyNumbers: true });
    }

    return Promise.resolve(null);
  };
}