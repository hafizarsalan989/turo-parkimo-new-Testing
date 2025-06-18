import { Component, OnInit } from "@angular/core";

import { SessionService } from "src/app/shared/services/session/session.service";
import { IHost } from "src/app/host/models/host.model";

@Component({
  selector: "app-traveler-invoice-list",
  templateUrl: "./traveler-invoice-list.component.html",
  styleUrls: ["./traveler-invoice-list.component.scss"],
})
export class TravelerInvoiceListComponent implements OnInit {
  host: IHost | undefined;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
    });
  }
}
