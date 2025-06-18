import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class PoolManagementService {
  constructor(private apiService: ApiService) {}

  getPoolsByFacilityId<T>(facilityId: string): Observable<T> {
    return this.apiService.get(`contractparker/pool/${facilityId}`);
  }

  savePool<T>(payload: unknown): Observable<T> {
    return this.apiService.post("contractparker/pool", payload);
  }

  saveAdmin<T>(payload: unknown): Observable<T> {
    return this.apiService.put("contractparker/pool/admin", payload);
  }

  removeAdmin<T>(poolId: string, userId: string): Observable<T> {
    return this.apiService.delete(
      `contractparker/pool/admin?poolId=${poolId}&userId=${userId}`
    );
  }

  getParkersByPoolId<T>(poolId: string): Observable<T> {
    return this.apiService.get(`contractparker/pool/parker/${poolId}`);
  }

  saveParker<T>(payload: unknown): Observable<T> {
    return this.apiService.post("contractparker/parker", payload);
  }
}
