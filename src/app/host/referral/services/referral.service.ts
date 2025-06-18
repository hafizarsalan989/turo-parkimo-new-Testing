import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class ReferralService {
  constructor(private apiService: ApiService) {}

  getReferralByCompanyId<T>(id: string): Observable<T> {
    return this.apiService.get(`referral/${id}`);
  }

  getReferralActivityById<T>(id: string): Observable<T> {
    return this.apiService.get(`referral/activity/${id}`);
  }

  acceptReferral<T>(id: string): Observable<T> {
    return this.apiService.post("referral/activate", { companyId: id });
  }
}
