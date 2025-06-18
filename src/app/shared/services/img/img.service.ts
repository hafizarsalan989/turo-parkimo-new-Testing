import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class ImgService {
  constructor(private apiService: ApiService) {}

  upload(formData: FormData): Observable<string> {
    return this.apiService.post<string>("image", formData, {
      responseType: "string",
    });
  }

  uploadFile<T>(formData: FormData): Observable<T> {
    return this.apiService.post("file", formData);
  }

  getFiles<T>(id: string, type: string): Observable<T[]> {
    return this.apiService.get(`file?referenceId=${id}&referenceType=${type}`);
  }
}
