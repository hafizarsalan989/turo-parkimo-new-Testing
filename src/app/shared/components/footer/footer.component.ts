import { Component } from "@angular/core";
import { ThemeService } from "../../services/theme/theme.service";

@Component({
  selector: "app-footer-cmp",
  templateUrl: "footer.component.html",
})
export class FooterComponent {
  year: Date = new Date();
  siteName: string = '';

  constructor(private themeService: ThemeService) {
    this.siteName = this.themeService.getSiteName();
  }
}
