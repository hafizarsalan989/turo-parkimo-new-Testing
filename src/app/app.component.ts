import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";

import { ThemeService } from "./shared/services/theme/theme.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-my-app",
  templateUrl: "./app.component.html",
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private titleService: Title,
    private themeService: ThemeService
  ) {
    const faviconPath = this.themeService.getFaviconPath();
    const appleTouchIcon: HTMLLinkElement =
      document.querySelector("#apple-touch-icon");
    appleTouchIcon.href = `${faviconPath}apple-touch-icon.png`;
    const favicon32: HTMLLinkElement = document.querySelector("#favicon-32");
    favicon32.href = `${faviconPath}favicon-32x32.png`;
    const favicon16: HTMLLinkElement = document.querySelector("#favicon-16");
    favicon16.href = `${faviconPath}favicon-16x16.png`;
    const siteWebmanifest: HTMLLinkElement =
      document.querySelector("#site-webmanifest");
    siteWebmanifest.href = `${faviconPath}site.webmanifest`;
  }

  ngOnInit() {
    const primaryTitle = this.themeService.getPrimaryTitle();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = "";

          while (route!.firstChild) {
            route = route.firstChild;
          }

          if (route.snapshot.data["title"]) {
            routeTitle = route!.snapshot.data["title"];
          }

          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        this.configModal();

        this.titleService.setTitle(
          title ? `${primaryTitle} - ${title}` : primaryTitle
        );
      });
  }

  private configModal(): void {
    const body = document.getElementsByTagName("body")[0];
    const modalBackdrop = document.getElementsByClassName("modal-backdrop")[0];
    if (body.classList.contains("modal-open")) {
      body.classList.remove("modal-open");
      modalBackdrop.remove();
    }
  }
}
