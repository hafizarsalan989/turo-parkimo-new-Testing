import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { catchError, Observable, of, throwError } from "rxjs";

import { environment } from "src/environments/environment";
import { IError } from "../../models/error.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
    private notificationService: NotificationService
  ) {}

  get<T>(
    url: string,
    options?: { headers?: HttpHeaders; responseType?: any }
  ): Observable<T> {
    return this.httpClient.get<T>(`${environment.api}${url}`, options).pipe(
      catchError((err: HttpErrorResponse) => {
        const error: IError = this.handleError(err);

        return throwError(() => of(error));
      })
    );
  }

  post<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; responseType?: any }
  ): Observable<T> {
    return this.httpClient
      .post<T>(`${environment.api}${url}`, body, options)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const error: IError = this.handleError(err);

          return throwError(() => of(error));
        })
      );
  }

  put<T>(
    url: string,
    body: any,
    options?: { headers?: HttpHeaders; responseType?: any }
  ): Observable<T> {
    return this.httpClient
      .put<T>(`${environment.api}${url}`, body, options)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          const error: IError = this.handleError(err);

          return throwError(() => of(error));
        })
      );
  }

  delete<T>(
    url: string,
    options?: { headers?: HttpHeaders; responseType?: any }
  ): Observable<T> {
    return this.httpClient.delete<T>(`${environment.api}${url}`, options).pipe(
      catchError((err: HttpErrorResponse) => {
        const error: IError = this.handleError(err);

        return throwError(() => of(error));
      })
    );
  }

  private handleError(error: HttpErrorResponse): IError {
    console.log('here: ', error)
    const { responseStatus }: { responseStatus: IError } = error.error;
    this.notificationService.notify("notifications", "danger", responseStatus? responseStatus.message : 'Unknown error', "Error");

    return responseStatus;
  }
}
