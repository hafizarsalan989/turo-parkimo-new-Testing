import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

if (environment.production) {
  enableProdMode();

  if (window) {
    window.console.log = function () {};
  }

  const gtag = document.createElement("script");
  gtag.src = "https://www.googletagmanager.com/gtag/js?id=G-9VENGQLKN0";
  gtag.async = true;
  document.head.appendChild(gtag);

  const layer = document.createElement("script");
  layer.src = "assets/js/gtag-layer.js";
  document.head.appendChild(layer);
}

const acceptJs = document.createElement("script");
acceptJs.src = environment.acceptJs;
acceptJs.type = "text/javascript";
acceptJs.setAttribute("charset", "utf-8");
document.head.appendChild(acceptJs);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
