import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class InvoiceService {
  constructor(private apiService: ApiService) {}

  getInvoicesById<T>(id: string, hideZero = false): Observable<T> {
    return this.apiService.get<T>(
      `invoice/reference/${id}?hideZeroDollar=${hideZero}`
    );
  }

  refund<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>(
      `invoice/refund/${payload["invoiceId"]}`,
      payload
    );
  }

  process<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>(
      `invoice/process/${payload["invoiceId"]}`,
      payload
    );
  }

  delete<T>(id: string): Observable<T> {
    return this.apiService.delete<T>(
      `invoice/${id}`);
  }

  chargeHost<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("invoice/chargecustomer", payload);
  }

  getSummary<T>(companyId: string, year: string | number): Observable<T> {
    return this.apiService.get<T>(`invoice/summary/${companyId}/${year}`);
  }

  getInvoicesByDateRange<T>(query = ""): Observable<T> {
    return this.apiService.get<T>(`invoice/daterange${query}&hideZeroDollar=false`);
  }

  getReport(invoiceId: string): Observable<unknown> {
    return this.apiService.get<unknown>(
      `manualreport/explanation/invoice?invoiceId=${invoiceId}`,
      {
        responseType: "blob" as "json",
      }
    );
  }
}
