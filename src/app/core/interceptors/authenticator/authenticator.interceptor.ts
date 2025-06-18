import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticatorInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token: string = localStorage.getItem('X-AccessToken');
    if (!token) {
      return next.handle(request);
    }

    const headers: HttpHeaders = new HttpHeaders({
      'X-AccessToken': token
    });

    return next.handle(request.clone({ headers }));
  }
}
