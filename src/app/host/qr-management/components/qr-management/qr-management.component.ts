import { Component, OnInit } from "@angular/core";

import { IHost } from "src/app/host/models/host.model";
import { SessionService } from "src/app/shared/services/session/session.service";

declare const $: any;

@Component({
  selector: "app-qr-management",
  templateUrl: "./qr-management.component.html",
  styleUrls: ["./qr-management.component.scss"],
})
export class QrManagementComponent implements OnInit {
  host: IHost | undefined;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
    });
  }
}
