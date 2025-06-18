import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IAviCredential } from "../../../backoffice/tag-shipping/models/aviCredential.model";

@Component({
  selector: "app-print-tag-mailer",
  templateUrl: "./print-tag-mailer.component.html",
  styleUrls: ["./print-tag-mailer.component.scss"],
})
export class PrintTagMailerComponent {
  credential: IAviCredential;

  constructor(private router: Router) {
    if (!window['credential']) {
      this.router.navigate(['backoffice/tag-shipping'])
    } else {
      this.credential = window['credential'];
    }
  }
}
