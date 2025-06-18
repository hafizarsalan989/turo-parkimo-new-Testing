import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class BackofficeService {
  constructor(private apiService: ApiService) {}

  getDashboard<T>(): Observable<T> {
    return this.apiService.get("dashboard/backoffice");
  }
}
