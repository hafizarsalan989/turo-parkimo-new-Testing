import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class TravelerInvoiceService {
  constructor(private apiService: ApiService) {}

  getSummary<T>(): Observable<T> {
    return this.apiService.get("companybank/summary");
  }

  search<T>(payload?: unknown): Observable<T> {
    return this.apiService.post("companybank/search", payload);
  }
}
