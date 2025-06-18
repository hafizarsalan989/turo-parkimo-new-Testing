import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(private apiService: ApiService) {}

  getFacilityOccupancy<T>(payload: unknown): Observable<T> {
    return this.apiService.post("report/occupancy", payload);
  }

  getDeniedTags<T>(query: string): Observable<T> {
    return this.apiService.get(`report/deniedtag?${query}`);
  }

  getCityPassCount<T>(query: string): Observable<T> {
    return this.apiService.get(`report/sales/cityPass?${query}`);
  }

  getTravelerInvoices<T>(query: string): Observable<T> {
    return this.apiService.get(`report/sales/traverlInvoice?${query}`);
  }

  getSystemReport<T>(): Observable<T> {
    return this.apiService.get("systemreport");
  }

  downloadSystemReport<T>(url: string): Observable<T> {
    return this.apiService.get(url, {
      responseType: "text",
    });
  }

  getGuestPayReport<T>(): Observable<T> {
    return this.apiService.get("report/guestpay/summary");
  }
}
