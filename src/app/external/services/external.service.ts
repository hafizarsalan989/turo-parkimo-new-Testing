import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class ExternalService {
  constructor(private apiService: ApiService) {}

  getInvoiceById<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`invoice/${id}`);
  }

  getBillbackById<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`turo/hostbillback/details/${id}`);
  }

  payInvoice<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.post(`turo/hostbillback/charge/${id}`, payload);
  }

  getInvoiceByKey<T>(key: string, hostPay: boolean): Observable<T> {
    return this.apiService.get<T>(
      `quicktraverinvoice/url/${key}?hostPay=${hostPay}`
    );
  }

  payQuickInvoice<T>(payload: unknown): Observable<T> {
    return this.apiService.post("quicktraverinvoice/charge", payload);
  }

  payByHost<T>(payload: unknown): Observable<T> {
    return this.apiService.post("quicktraverinvoice/charge/host", payload);
  }

  getTripFeesByFacilityId<T>(
    facilityId: string,
    amount: number
  ): Observable<T> {
    return this.apiService.get<T>(
      `quicktraverinvoice/url/charges/${facilityId}?amount=${amount}`
    );
  }
}
