import { Injectable } from "@angular/core";
import {
  AsyncValidator,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { Observable, map, catchError, of } from "rxjs";
import { AuthService } from "../../services/auth.service";

@Injectable({ providedIn: "root" })
export class CompanyNameValidator implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.authService.validateCompanyName(control.value.trim()).pipe(
      map((isExist) => (isExist ? { invalidCompanyName: true } : null)),
      catchError(() => of(null))
    );
  }
}
