import { Component, OnInit } from "@angular/core";

import { IHost } from "src/app/host/models/host.model";
import { SessionService } from "src/app/shared/services/session/session.service";

@Component({
  selector: "app-fuel-tank-list",
  templateUrl: "./fuel-tank-list.component.html",
  styleUrls: ["./fuel-tank-list.component.scss"],
})
export class FuelTankListComponent implements OnInit {
  host: IHost | undefined;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
    });
  }
}
