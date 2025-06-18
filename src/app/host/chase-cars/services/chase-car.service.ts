import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class ChaseCarService {
  constructor(private apiService: ApiService) {}

  getChaseVehiclesByCompanyId<T>(companyId: string): Observable<T> {
    return this.apiService.get<T>(`chasevehicle/company/${companyId}`);
  }

  getChaseVehiclesByCompanyAndFacility<T>(
    companyId: string,
    facilityId: string
  ): Observable<T> {
    return this.apiService.get<T>(
      `chasevehicle/company/${companyId}/${facilityId}`
    );
  }

  saveChaseVehicle<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("chasevehicle", payload);
  }

  saveCompanyChaseCarMax<T>(
    companyId: string,
    payload: unknown
  ): Observable<T> {
    return this.apiService.put<T>(`company/chaseCarMax/${companyId}`, payload);
  }
}
