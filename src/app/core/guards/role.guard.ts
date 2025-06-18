import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { SessionService } from "../../shared/services/session/session.service";
import { IUser } from "src/app/shared/models/user.model";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  private user: IUser | undefined;

  constructor(private router: Router, private sessionService: SessionService) {
    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
    });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let { url } = state;
    if (url.includes("?")) {
      url = url.substring(0, url.lastIndexOf("?"));
    }
    const id: string = route.params["id"] ?? "";
    const urls: string[] = this.sessionService.getAllowedUrlsForUser(id);

    const index: number = urls.findIndex((u: string) => u == url);
    if (index > -1) {
      return true;
    } else {
      if (this.user.turoUserType === "host") {
        this.router.navigate(["/host/vehicle/list"]);
      } else if (this.user.turoUserType === "facility") {
        this.router.navigate(["/facility/vehicle-search"]);
      } else {
        this.router.navigate(["/dashboard"]);
      }

      return false;
    }
  }
}
