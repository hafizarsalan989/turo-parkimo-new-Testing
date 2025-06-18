import { Component, OnInit } from "@angular/core";

import { SessionService } from "src/app/shared/services/session/session.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-invoice-list",
  templateUrl: "./invoice-list.component.html",
  styleUrls: ["./invoice-list.component.scss"],
})
export class InvoiceListComponent implements OnInit {
  companyId: string;

  constructor(private router: Router, private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getHost$().subscribe((host) => {
      this.companyId = host?.id;
    });
  }

  editCC(): void {
    this.router.navigate(["/my-account"], {
      queryParams: {
        section: "cc",
      },
    });
  }
}
