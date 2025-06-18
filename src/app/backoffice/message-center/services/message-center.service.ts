import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class MessageCenterService {
  constructor(private apiService: ApiService) {}

  getAll<T>(): Observable<T> {
    return this.apiService.get("message");
  }

  create<T>(payload: unknown): Observable<T> {
    return this.apiService.post("message", payload);
  }
}
