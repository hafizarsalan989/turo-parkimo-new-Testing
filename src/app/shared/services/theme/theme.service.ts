import { Injectable } from "@angular/core";
import { ITheme, THEMES } from "src/app/core/constants/theme";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  getLogoWhitePath(): string {
    const logoPath = this.getTheme()?.imagePath.logo
      ? `${this.getTheme()?.imagePath.logo}/`
      : "";

    return `/assets/img/logo/${logoPath}logo-white.png`;
  }

  getLogoWhiteBluePath(): string {
    const logoPath = this.getTheme()?.imagePath.logo
      ? `${this.getTheme()?.imagePath.logo}/`
      : "";

    return `/assets/img/logo/${logoPath}logo-white-blue.png`;
  }

  getLogoDarkBluePath(): string {
    const logoPath = this.getTheme()?.imagePath.logo
      ? `${this.getTheme()?.imagePath.logo}/`
      : "";

    return `/assets/img/logo/${logoPath}logo-dark-blue.png`;
  }

  getFaviconPath(): string {
    const faviconPath = this.getTheme()?.imagePath.favicon ?? "";

    return `/assets/img/favicon/${faviconPath}/`;
  }

  getPrimaryTitle(): string {
    return this.getTheme()?.title ?? "";
  }

  getBgPrimary(): string {
    const primaryColor = this.getTheme()?.primaryColor;

    return `background-${primaryColor ?? "f49d1a"}`;
  }

  getSiteName(): string {
    return this.getTheme()?.siteName ?? "";
  }

  private getTheme(): ITheme | undefined {
    const { hostname } = window.location;

    return THEMES.find((theme: ITheme) =>
      theme.hosts.some((host: string) => host.includes(hostname))
    );
  }
}
