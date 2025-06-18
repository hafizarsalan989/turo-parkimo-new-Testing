import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from "@angular/router";

import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class LegacyPayGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUrl = state.url;

    const hasHostPay = currentUrl.includes("hostPay=yes");
    const match = currentUrl.match(/\/external\/pay\/([^?]+)(\?quick=yes)?/);

    if (!hasHostPay && match) {
      const urlKey = match[1];
      const isQuick = match[2] ? true : false;

      const redirectUrl = isQuick
        ? `${environment.guestPayUrl}invoice/${urlKey}`
        : `${environment.guestPayUrl}receipt/${urlKey}`;

      window.location.href = redirectUrl;
      return false;
    }

    return true;
  }
}
