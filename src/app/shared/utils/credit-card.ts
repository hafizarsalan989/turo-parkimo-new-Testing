import { AbstractControl } from "@angular/forms";
import * as moment from "moment";
import * as validator from "card-validator";


export function ValidateNumber(
  control: AbstractControl
): { [key: string]: any } | null {
  return validator.number(control.value).isValid ? null : { invalid: true };
}

export function ValidateExpiry(
  control: AbstractControl
): { [key: string]: any } | null {
  const date = validator.expirationDate(moment(control.value).format('MM/YY'));

  return date.month && date.year && date.isValid ? null : { invalid: true };
}

export function ValidateCVV(
  control: AbstractControl
): { [key: string]: any } | null {
  const cvv = validator.cvv(control.value, [3, 4]);

  return (cvv.isValid) ? null : { invalid: true };
}

export const CC_ICONS = {
  default: 'https://img.icons8.com/color/40/000000/bank-card-back-side.png',
  visa: 'https://img.icons8.com/color/40/000000/visa.png',
  mastercard: 'https://img.icons8.com/color/40/000000/mastercard.png',
  discover: 'https://img.icons8.com/color/40/000000/discover.png',
  jcb: 'https://img.icons8.com/color/40/000000/jcb.png',
  maestro: 'https://img.icons8.com/color/40/000000/maestro.png',
  'american-express': 'https://img.icons8.com/color/40/000000/amex.png',
  'diners-club': 'https://img.icons8.com/color/40/000000/diners-club.png'
};