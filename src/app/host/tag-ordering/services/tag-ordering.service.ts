import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class TagOrderingService {
  constructor(private apiService: ApiService) {}

  getTagTypes<T>(): Observable<T> {
    return this.apiService.get<T>("avicredential/tagTypes");
  }

  order<T>(companyId: string, payload: unknown): Observable<T> {
    return this.apiService.post<T>(`avicredential/order/${companyId}`, payload);
  }
}
