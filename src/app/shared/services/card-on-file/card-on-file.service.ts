import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class CardOnFileService {
  constructor(private apiService: ApiService) {}

  getGateway<T>(product: string): Observable<T> {
    return this.apiService.get<T>(`payment/gateway?parkimoProduct=${product}`);
  }

  save<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("company/cardonfile", payload);
  }

  delete<T>(payload: unknown): Observable<T> {
    return this.apiService.put<T>("company/cardonfile/delete", payload);
  }

  setPrimary<T>(payload: unknown): Observable<T> {
    return this.apiService.put<T>("company/cardonfile/primary", payload);
  }
}
