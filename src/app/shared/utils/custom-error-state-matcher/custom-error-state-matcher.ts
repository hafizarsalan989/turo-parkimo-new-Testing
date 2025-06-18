import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

export const checkPasswords: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const confirmPass = control.value;
  if (!confirmPass) {
    return null;
  }

  const pass = control.parent?.get("password")?.value;

  return pass === confirmPass ? null : { notSame: true };
};
