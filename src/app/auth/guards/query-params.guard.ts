import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class QueryParamsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      const { path }: { path: string } = route.url[0];
      const { queryParams }: { queryParams: { [key: string]: unknown } } = route;

      switch (path) {
        case 'verify-email':
          if (!queryParams['verifyId']) {
            this.router.navigate(['/login']);

            return false;
          }

          return true;
      
        default:
          return false;
      }
  }
  
}
