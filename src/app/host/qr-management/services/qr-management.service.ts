import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class QrManagementService {
  constructor(private apiService: ApiService) {}

  getQrCodes<T>(companyId: string, facilityId: string): Observable<T> {
    return this.apiService.get(
      `twofactorauthcode?companyId=${companyId}&facilityId=${facilityId}`
    );
  }

  toggleSecureMode<T>(payload: {
    companyId: string;
    facilityId: string;
    allowTwoFactor: boolean;
  }): Observable<T> {
    return this.apiService.put(
      `company/twoFactorFacility/${payload.companyId}`,
      payload
    );
  }

  expireQrCode<T>(id: string): Observable<T> {
    return this.apiService.post(`twofactorauthcode/expire`, { id });
  }

  createQrCode<T>(companyId: string, facilityId: string): Observable<T> {
    return this.apiService.post("twofactorauthcode/create", {
      companyId,
      facilityId,
    });
  }
}
