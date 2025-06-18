import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "src/app/core/services/api/api.service";
import { IVehicleRequest } from "../models/vehicle.model";

@Injectable({
  providedIn: "root",
})
export class VehicleService {
  constructor(private apiService: ApiService) {}

  getVehiclesByHostId<T>(companyId: string): Observable<T> {
    return this.apiService.get<T>(`vehicle/company/${companyId}`);
  }

  getVehicleDetailsByVin<T>(vin: string): Observable<T> {
    return this.apiService.get<T>(`vehicle/vin/${vin}`);
  }

  getVehicleById<T>(vehicleId: string): Observable<T> {
    return this.apiService.get<T>(`vehicle/${vehicleId}`);
  }

  saveVehicle<T>(payload: IVehicleRequest): Observable<T> {
    return this.apiService.post<T>("vehicle", payload);
  }

  deleteVehicle<T>(id: string): Observable<T> {
    return this.apiService.delete<T>(`vehicle/${id}`);
  }

  getParkingSessionsById<T>(id: string, type?: string): Observable<T> {
    const path = type ? `parkingsession/${type}/${id}` : `parkingsession/${id}`;

    return this.apiService.get(path);
  }

  getParkingPassSubscriptionsByVehicleId<T>(vehicleId: string): Observable<T> {
    return this.apiService.get(`subscriptions/parkingpass/${vehicleId}`);
  }

  getInvoicesByVehicleId<T>(vehicleId: string): Observable<T> {
    return this.apiService.get(`/invoice/product/${vehicleId}`);
  }

  requestParkingSessionClose<T>(payload: any): Observable<T> {
    return this.apiService.post("parkingsession/forceclose", payload);
  }

  saveMarketBySubscriptionId<T>({
    subscriptionId,
    facilityMarketId,
  }: {
    subscriptionId: string;
    facilityMarketId: string;
  }): Observable<T> {
    return this.apiService.post(
      `subscriptions/parkingpass/changemarket/${subscriptionId}`,
      { subscriptionId, facilityMarketId }
    );
  }

  saveFacilityBySubscriptionId<T>({
    subscriptionId,
    facilityId,
  }: {
    subscriptionId: string;
    facilityId: string;
  }): Observable<T> {
    return this.apiService.post(
      `subscriptions/parkingpass/changefacility/${subscriptionId}`,
      { subscriptionId, facilityId }
    );
  }

  createAddonUnlimited<T>(payload: unknown): Observable<T> {
    return this.apiService.post("addon/unlimited", payload);
  }

  addonUnlimitedUpdate<T>(payload: unknown): Observable<T> {
    return this.apiService.post("addon/unlimited/update", payload);
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

  savePakingPass<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("product/parkingPass", payload);
  }

  getOpenMailing<T>(id: string): Observable<T> {
    return this.apiService.get(`mailing/open/${id}`);
  }

  updateLicensePlate<T>({
    vehicleId,
    licensePlate,
  }: {
    vehicleId: string;
    licensePlate: string;
  }): Observable<T> {
    return this.apiService.put(`vehicle/${vehicleId}/lp`, {
      licensePlate: licensePlate,
    });
  }
}
