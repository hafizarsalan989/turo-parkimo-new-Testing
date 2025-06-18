import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";
import { IActionItem } from "../models/action-item.model";

@Injectable({
  providedIn: "root",
})
export class ActionCenterService {
  constructor(private apiService: ApiService) {}

  getAll<T>(): Observable<T> {
    return this.apiService.get(`actionitem`);
  }

  getById<T>(id: string): Observable<T> {
    return this.apiService.get(`actionitem/${id}`);
  }

  save<T>(payload: IActionItem): Observable<T> {
    return this.apiService.post('actionitem', payload);
  }

  action<T>(payload: unknown): Observable<T> {
    return this.apiService.post('actionitem/action', payload);
  }
}
