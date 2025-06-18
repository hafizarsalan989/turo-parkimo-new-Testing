import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class WithdrawService {
  constructor(private apiService: ApiService) {}

  getAll<T>(query: string = ""): Observable<T> {
    return this.apiService.get(`companybank/withdrawl?${query}`);
  }

  updateStatus<T>(payload: unknown): Observable<T> {
    return this.apiService.put("companybank/withdrawal/update", payload);
  }

  updateNotes<T>(payload: unknown): Observable<T> {
    return this.apiService.put("companybank/withdrawal/update/notes", payload);
  }
}
