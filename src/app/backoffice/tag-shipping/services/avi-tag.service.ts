import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class AviTagService {
  constructor(private apiService: ApiService) {}

  management<T>(): Observable<T> {
    return this.apiService.get("avicredential/tag/management");
  }

  mailed<T>(payload: unknown): Observable<T> {
    return this.apiService.post("avicredential/tag/management/mailed", payload);
  }

  refresh<T>(payload: unknown): Observable<T> {
    return this.apiService.post("subscription/parkingpass/changetag", payload);
  }

  status<T>(companyId: string): Observable<T> {
    return this.apiService.get(`avicredential/tagStatus/${companyId}`);
  }

  save<T>(payload: unknown): Observable<T> {
    return this.apiService.post("avicredential/addTag/multiple", payload);
  }

  cancel<T>(payload: unknown): Observable<T> {
    return this.apiService.post("avicredential/tag/management/cancel", payload);
  }
}
