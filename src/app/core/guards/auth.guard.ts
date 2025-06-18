import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";

import { catchError, map, Observable, of } from "rxjs";

import { AuthService } from "src/app/auth/services/auth.service";
import { IUser } from "../../shared/models/user.model";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    if (!localStorage.getItem("X-AccessToken")) {
      this.router.navigate(["/login"]);

      return false;
    }

    return this.authService.validateUser<IUser>().pipe(
      map((res: IUser) => {
        if (!res.isEmailVerified || res.isDeleted) {
          this.router.navigate(["/login"]);

          return false;
        }

        return true;
      }),
      catchError(() => {
        this.router.navigate(["/login"]);

        return of(false);
      })
    );
  }
}
