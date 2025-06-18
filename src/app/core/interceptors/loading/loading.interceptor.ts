import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { finalize, Observable } from "rxjs";

import { LoadingService } from "../../../shared/services/loading/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const search: string | undefined = request.url.split("?")[1];
    if (search) {
      const urlParams = new URLSearchParams(`?${search}`);

      const loading: string = urlParams.get("loading");
      if (loading === "false") {
        const url: string = request.url.replace(/(\?|\&)loading=false/i, '');
                
        return next.handle(request.clone({ url }));
      }
    }

    this.loadingService.start();

    return next.handle(request).pipe(
      finalize(() => {
        this.loadingService.stop();
      })
    );
  }
}
