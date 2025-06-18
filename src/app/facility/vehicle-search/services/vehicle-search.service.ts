import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class VehicleSearchService {
  constructor(private apiService: ApiService) {}

  search<T>(tag: string): Observable<T> {
    return this.apiService.get(`vehicle/search/tag/${tag}`);
  }

  sendMessage<T>(payload: unknown): Observable<T> {
    return this.apiService.post("message/vehicle", payload);
  }
}
