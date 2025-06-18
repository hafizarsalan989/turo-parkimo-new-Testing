import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";

import { ApiService } from "src/app/core/services/api/api.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IHost } from "../../models/host.model";

@Injectable({
  providedIn: "root",
})
export class HostService {
  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) { }

  getHosts<T>(): Observable<T> {
    return this.apiService.get("company/all");
  }

  getHostByUserId<T>(userId: string): Observable<T> {
    return this.apiService
      .get<T>(`company/user?userId=${userId}`)
      .pipe(
        tap((res: T) =>
          this.sessionService.setHosts$(res as unknown as IHost[])
        )
      );
  }

  getHostManagement<T>(): Observable<T> {
    return this.apiService.get("company/management");
  }

  searchHostManagement<T>(query: string): Observable<T> {
    return this.apiService.get(`company/management/simple${query}`);
  }

  // advancedSearchHostManagement<T>(query: string): Observable<T> {
  //   return this.apiService.get(`company/management/advanced${query}`);
  // }

  advancedSearchHostManagement<T>(searchCriteria: string): Observable<T> {
    return this.apiService.get(`company/management/advanced/new${searchCriteria}`);
  }

  getHostById<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`company/${id}`);
  }

  getHostDashboard<T>(): Observable<T> {
    return this.apiService
      .get("dashboard/host")
      .pipe(map((data: { dashboard: T }) => data.dashboard));
  }

  getFacilityDashboard<T>(): Observable<T> {
    return this.apiService
      .get("dashboard/facility")
      .pipe(map((data: { dashboard: T }) => data.dashboard));
  }

  saveHost<T>(payload: unknown): Observable<T> {
    return this.apiService
      .post<T>("company", payload)
      .pipe(
        tap((res: T) =>
          this.sessionService.setHosts$([res as unknown as IHost])
        )
      );
  }

  getMailingpreferenceOptions<T>(): Observable<T> {
    return this.apiService.get<T>("company/mailingpreferenceoptions");
  }

  saveCompanyMailingAddress<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.put<T>(`company/mailingAddress/${id}`, payload);
  }

  savePausBilling<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>(`company/management`, payload);
  }

  saveBillback<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.put<T>(`company/enableBillback/${id}`, payload);
  }

  saveAddon<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.put<T>(`company/allowAddOnUnlimited/${id}`, payload);
  }

  savePmcsFee<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.put<T>(
      `company/ignoreDailyParkingPMCSFee/${id}`,
      payload
    );
  }

  saveSuspended<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.put<T>(`company/accessSuspended/${id}`, payload);
  }

  createKey<T>(id: string): Observable<T> {
    return this.apiService.post(
      "company/apikey",
      { companyId: id },
      { responseType: "text" }
    );
  }

  cancelKey<T>(id: string): Observable<T> {
    return this.apiService.delete(`company/apikey?companyId=${id}`);
  }

  getWelcome<T>(id: string): Observable<T> {
    return this.apiService.get(`company/welcome/${id}`);
  }

  getMessagesByUserId<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`message/user/${id}?loading=false`);
  }

  acknowledgeMessage<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("message/user/acknowledge", payload);
  }

  saveAch<T>(id: string, payload: unknown): Observable<T> {
    return this.apiService.put<T>(`company/ach/${id}`, payload);
  }

  delete<T>(id: string): Observable<T> {
    return this.apiService.delete<T>(`company/${id}`);
  }

  getCalculatedValue<T>(query: string): Observable<T> {
    return this.  apiService.get(`report/calculator/deliveryfee${query}`);
  }
  //report/calculator/deliveryfee

  private modeSubject = new BehaviorSubject<'host' | 'vehicle'>('host'); // default is 'host'

  mode$ = this.modeSubject.asObservable();

  setMode(mode: 'host' | 'vehicle') {
    this.modeSubject.next(mode);
  }

  getCurrentMode(): 'host' | 'vehicle' {
    return this.modeSubject.value;
  }
}
