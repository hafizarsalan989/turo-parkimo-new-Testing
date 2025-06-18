import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, tap } from "rxjs";

import { ApiService } from "src/app/core/services/api/api.service";
import { IUser } from "src/app/shared/models/user.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IHost } from "src/app/host/models/host.model";
import { HostService } from "src/app/host/services/host/host.service";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private router: Router,
    private apiService: ApiService,
    private sessionService: SessionService,
    private hostService: HostService
  ) {}

  login<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("user/login", payload);
  }

  register<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("user/register", payload);
  }

  resendCode<T>(email: string): Observable<T> {
    return this.apiService.get<T>(
      `user/resendverification/${email}?loading=false`
    );
  }

  verify<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("user/verifyemail", payload);
  }

  forgotPassword<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("user/password/forgot", payload);
  }

  resetPassword<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("user/password/reset", payload);
  }

  getMarketList<T>(): Observable<T> {
    return this.apiService.get<T>("user/markets");
  }

  validateUser<T>(): Observable<T> {
    return this.apiService.get<T>("user/validate?loading=false").pipe(
      tap((res: T) => {
        if (
          (res as unknown as IUser).isEmailVerified &&
          !(res as unknown as IUser).isDeleted
        ) {
          this.sessionService.setUser$(res as unknown as IUser);
        } else {
          localStorage.clear();

          this.router.navigate(["/login"]);
        }
      })
    );
  }

  navigateByUserType(
    type: "host" | "facility" | "backoffice" | "pool" | "callcenter",
    userId: string,
    url = null
  ) {
    switch (type) {
      case "host":
        this.hostService.getHostByUserId<IHost[]>(userId).subscribe({
          next: () => {
            this.router.navigateByUrl(url ?? "/host/vehicle/list");
          },
        });
        break;
      case "facility":
        this.router.navigateByUrl(url ?? "/facility/vehicle-search");
        break;
      case "backoffice":
        this.router.navigateByUrl(url ?? "/dashboard");
        break;
      case "pool":
        this.router.navigateByUrl(url ?? "/pool/contract-parking");
        break;
      case "callcenter":
        this.router.navigateByUrl(url ?? "/callcenter/hub");
        break;

      default:
        break;
    }
  }

  validateCompanyName(name: string): Observable<boolean> {
    return this.apiService.get(`company/validatename/${name}`);
  }
}
