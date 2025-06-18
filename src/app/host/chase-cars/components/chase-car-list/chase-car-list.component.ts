import { Component, OnInit } from "@angular/core";

import { SessionService } from "src/app/shared/services/session/session.service";

@Component({
  selector: "app-chase-car-list",
  templateUrl: "./chase-car-list.component.html",
  styleUrls: ["./chase-car-list.component.scss"],
})
export class ChaseCarListComponent implements OnInit {
  public companyId: string | undefined;

  constructor(
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.sessionService.getHost$().subscribe((host) => {
      this.companyId = host?.id;
    });
  }
}
