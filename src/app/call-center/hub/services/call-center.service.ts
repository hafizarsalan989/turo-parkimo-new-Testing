import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

import { ApiService } from "src/app/core/services/api/api.service";
import { ICallCenterHub } from "../models/call-center-hub.model";

@Injectable({
  providedIn: "root",
})
export class CallCenterService {
  constructor(private apiService: ApiService) {}

  searchHub<T = ICallCenterHub>(criteria: string): Observable<T> {
    return this.apiService
      .get(`callcenterhub/search?searchCriteria=${criteria}`)
      .pipe(
        map((res: ICallCenterHub) => {
          const sessions = res.sessions
            ? res.sessions.map((session) => {
                return {
                  ...session,
                  entryStamp:
                    session.entryStamp === "0001-01-01T00:00:00.0000000Z"
                      ? ""
                      : session.entryStamp,
                  exitStamp:
                    session.exitStamp === "0001-01-01T00:00:00.0000000Z"
                      ? ""
                      : session.exitStamp,
                };
              })
            : [];

          return { ...res, sessions } as unknown as T;
        })
      );
  }

  addActivity<T = ICallCenterHub>(payload: unknown): Observable<T> {
    return this.apiService.post("callcenterhub/addActivity", payload);
  }
}
