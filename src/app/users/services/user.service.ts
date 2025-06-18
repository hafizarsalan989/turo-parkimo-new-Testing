import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  getUsersForProduct<T>(compnayId?: string): Observable<T> {
    let path = 'user/manage';
    if (compnayId) {
      path += `?companyId=${compnayId}`
    }
    return this.apiService.get<T>(path);
  }

  getUserById<T>(id: string): Observable<T> {
    return this.apiService.get<T>(`user?id=${id}`);
  }

  getUserRoles<T>(): Observable<T> {
    return this.apiService.get<T>('user/roles');
  }

  createUser<T>(payload: unknown): Observable<T> {
    return this.apiService.post<T>("user", payload);
  }

  updateUser<T>(payload: unknown): Observable<T> {
    return this.apiService.put<T>("user", payload);
  }

  deleteUser<T>(id: string): Observable<T> {
    return this.apiService.delete<T>(`user/${id}`);
  }

  updatePassword<T>(payload: unknown): Observable<T> {
    return this.apiService.put<T>("user/password", payload);
  }
}
