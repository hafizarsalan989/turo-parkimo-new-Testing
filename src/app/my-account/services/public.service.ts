import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class PublicService {
  constructor(private apiService: ApiService) {}

  getPmsDefinition<T>(): Observable<T> {
    return this.apiService.get("public/PMS/definition");
  }

  getTraverInvoices<T>(id: string): Observable<T> {
    return this.apiService.get(`quicktraverinvoice/${id}`);
  }

  saveTraverInvoices<T>(payload: unknown): Observable<T> {
    return this.apiService.post("quicktraverinvoice", payload);
  }
}
