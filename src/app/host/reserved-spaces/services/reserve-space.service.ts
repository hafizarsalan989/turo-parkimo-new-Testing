import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ReserveSpaceService {

  constructor(private apiService: ApiService) { }

  getReservedSpacesByCompanyId<T>(companyId: string): Observable<T> {
    return this.apiService.get<T>(`reservedspace/${companyId}`);
  }
}
