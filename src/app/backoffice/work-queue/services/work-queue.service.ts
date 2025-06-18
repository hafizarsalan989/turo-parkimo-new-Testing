import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from 'src/app/core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class WorkQueueService {
  constructor(private apiService: ApiService) {}

  getWorkQueues<T>(): Observable<T> {
    return this.apiService.get("backofficeactivity/open");
  }

  getWorkQueueById<T>(id: string): Observable<T> {
    return this.apiService.get(`backofficeactivity/${id}`);
  }

  saveWorkQueueStatus<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>(`backofficeactivity/markcomplete`, payload);
  }
}
