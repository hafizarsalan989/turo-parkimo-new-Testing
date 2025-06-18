import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class FuelTankService {
  constructor(private apiService: ApiService) {}

  getBank<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`companybank/${id}`);
  }

  withdraw(payload: unknown): Observable<any> {
    return this.apiService.post("companybank/withdrawal", payload);
  }

  download<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`companybank/export/${id}`, {
      responseType: "blob" as "json",
    });
  }
}
