import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";
import { ITravelerInvoiceReqParams } from "../models/params.model";

@Injectable({
  providedIn: "root",
})
export class TravelerInvoiceService {
  constructor(private apiService: ApiService) {}

  getBillbacks<T>(params: ITravelerInvoiceReqParams): Observable<T> {
    const {
      companyId,
      status,
      searchTerm,
      page,
      pageSize,
      sortColumn,
      sortDirection,
      startDate,
      endDate,
    } = params;

    let url = `turo/hostbillback/${companyId}`;

    let query = "";
    if (status) {
      query += `status=${status}`;
    }
    if (searchTerm) {
      query += `&searchTerm=${searchTerm}`;
    }
    if (page) {
      query += `&page=${page}`;
    } else {
      query += `&page=1`;
    }
    if (pageSize) {
      query += `&pageSize=${pageSize}`;
    } else {
      query += `&pageSize=10`;
    }
    if (sortColumn) {
      query += `&sortColumn=${sortColumn}`;
    }
    if (sortDirection) {
      query += `&sortDirection=${sortDirection}`;
    }
    if (startDate) {
      query += `&startDate=${startDate}`;
    }
    if (endDate) {
      query += `&endDate=${endDate}`;
    }

    if (query) {
      url += `?${query}`;
    }

    return this.apiService.get<T>(url);
  }

  getFacilitiesByCompanyId<T>(companyId: string): Observable<T> {
    return this.apiService.get<T>(`turo/hostbillback/facilities/${companyId}`);
  }

  getPermitsByFacilityId<T>(
    companyId: string,
    facilityId: string
  ): Observable<T> {
    return this.apiService.get<T>(
      `turo/hostbillback/facilities/${companyId}/${facilityId}`
    );
  }

  getLastMessageByCompanyId<T>(companyId: string): Observable<T> {
    return this.apiService.get<T>(
      `turo/hostbillback/lastmessage/${companyId}`,
      { responseType: "string" }
    );
  }

  getPmcsFee<T>(): Observable<T> {
    return this.apiService.get<T>("turo/hostbillback/pmcsfee");
  }

  save<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("turo/hostbillback", payload);
  }

  cancel<T>(id: string): Observable<T> {
    return this.apiService.delete(`turo/hostbillback/charge/${id}`);
  }

  refund<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.post(`turo/hostbillback/refund/${id}`, payload);
  }
}
