import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class HostManagementService {
  constructor(private apiService: ApiService) {}

  getNote<T>({
    referenceType,
    referenceId,
    noteType,
  }: {
    referenceType: string;
    referenceId: string;
    noteType: string;
  }): Observable<T> {
    return this.apiService.get(
      `note/${referenceType}/${referenceId}/${noteType}`
    );
  }

  saveNote<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("note", payload);
  }

  getPermitSubscriptionsByCompanyId<T>(
    id: string,
    onlyActive = false
  ): Observable<T> {
    return this.apiService.get(
      `subscriptions/parkingpass/company/${id}?onlyActive=${onlyActive}`
    );
  }

  getAssignedTagsByCompanyId<T>(id: string): Observable<T> {
    return this.apiService.get(`avicredential/assignedTags/${id}`);
  }

  validateTags<T>(payload: unknown): Observable<T> {
    return this.apiService.post("avicredential/validateTags", payload);
  }

  cancelAddonUnlimited<T>(payload: unknown): Observable<T> {
    return this.apiService.post("addon/unlimited/cancel", payload);
  }

  cancelParkingPass<T>(subscriptionId: string): Observable<T> {
    return this.apiService.post<T>(
      `product/ParkingPass/cancel/${subscriptionId}`,
      null
    );
  }

  getProductMax<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`productmaxoverride/${id}`);
  }

  saveProductMax<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>('productmaxoverride', payload);
  }

  deleteProductMax<T>(id: string): Observable<T> {
    return this.apiService.delete<T>(`productmaxoverride?id=${id}`);
  }
}
