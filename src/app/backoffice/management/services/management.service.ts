import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class ManagementService {
  constructor(private apiService: ApiService) {}

  getDocumentByType<T>(type: string): Observable<T> {
    return this.apiService.get(`documentversion/${type}`);
  }

  saveDocument<T>(payload: unknown): Observable<T> {
    return this.apiService.post("documentversion", payload);
  }

  agreeDocuments<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("documentagreement", payload);
  }

  getLatestParkingActivities<T>(): Observable<T> {
    return this.apiService.get<T>("parkingsession/activity/latest");
  }

  getDeviceMonitoringReport<T>(): Observable<T> {
    return this.apiService.get<T>("reporting/monitoring/device");
  }

  searchCredential<T>(payload: unknown): Observable<T> {
    return this.apiService.post("credential/search", payload);
  }

  expireCredential<T>(payload: unknown): Observable<T> {
    return this.apiService.post("credential/expire", payload);
  }

  getCredentialHistory<T>(payload: unknown): Observable<T> {
    return this.apiService.post("credential/history", payload);
  }

  changeCredentialHost<T>(payload: unknown): Observable<T> {
    return this.apiService.post("credential/change", payload);
  }
}
