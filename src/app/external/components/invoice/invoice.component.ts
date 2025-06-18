import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { IInvoice } from "src/app/host/invoices/models/invoice.model";
import { ExternalService } from "../../services/external.service";
import { ThemeService } from "src/app/shared/services/theme/theme.service";

@Component({
  selector: "app-invoice",
  templateUrl: "./invoice.component.html",
  styleUrls: ["./invoice.component.scss"],
})
export class InvoiceComponent implements OnInit {
  invoiceDetail: IInvoice | undefined;
  logo: string | undefined;
  title: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private externalService: ExternalService,
    private themeService: ThemeService
  ) {
    this.logo = this.themeService.getLogoDarkBluePath();
    this.title = this.themeService.getPrimaryTitle();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.externalService.getInvoiceById<IInvoice>(id).subscribe({
        next: (res: IInvoice) => (this.invoiceDetail = res),
        error: () => (this.invoiceDetail = null),
      });
    });
  }
}
