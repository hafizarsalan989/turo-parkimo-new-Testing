import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class FacilityService {
  constructor(private apiService: ApiService) {}

  getActiveFacilities<T>(): Observable<T> {
    return this.apiService.get<T>("parkingfacility/active");
  }
  getMarket<T>(): Observable<T> {
    return this.apiService.get<T>("parkingfacility/market");
  }

  getFacilityById<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`parkingfacility/${id}`);
  }
  getFacilityMarketById<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`parkingfacility/market/${id}`);
  }

  getFacilitiesByCompanyId<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`parkingfacility/company/${id}`);
  }

  getFacilitiesByUser<T>(): Observable<T> {
    return this.apiService.get<T>(`parkingfacility/user`);
  }

  getFinancialSummary<T>(query: string): Observable<T> {
    return this.apiService.get<T>(`financial/facility/summary?${query}`);
  }
}
