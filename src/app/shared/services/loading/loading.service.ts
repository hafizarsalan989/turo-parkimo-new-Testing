import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  loading$: BehaviorSubject<number> = new BehaviorSubject(0);

  start(): void {
    const count = this.loading$.value;
    this.loading$.next(count + 1);
  }

  stop(): void {
    const count = this.loading$.value;
    this.loading$.next(count - 1);
  }
}
