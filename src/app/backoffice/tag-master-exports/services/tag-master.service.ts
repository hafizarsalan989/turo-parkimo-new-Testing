import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "src/app/core/services/api/api.service";

@Injectable({
  providedIn: "root",
})
export class TagMasterService {
  constructor(private apiService: ApiService) {}

  downloadUser(type: string, id: string): Observable<unknown> {
    return this.apiService.get<unknown>(
      `avicredential/export/tagmaster/${type}?facilityid=${id}`,
      {
        responseType: "blob" as "json",
      }
    );
  }

  uploadActivityFile(formData: FormData): Observable<string> {
    return this.apiService.post<string>(
      `parkingsession/tagmaster/import/${formData.get("facilityId")}`,
      formData,
      {
        responseType: "string",
      }
    );
  }
}
