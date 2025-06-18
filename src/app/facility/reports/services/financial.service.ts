import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class FinancialService {
  constructor(private apiService: ApiService) {}

  getFinancialSummary<T>(query: string): Observable<T> {
    return this.apiService.get<T>(
      `reporting/facility/financial/summary${query}`
    );
  }
}
