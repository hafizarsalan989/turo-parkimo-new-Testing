import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import moment, { Moment } from "moment";
import {
  IInvoice,
  IInvoiceSummary,
} from "src/app/host/invoices/models/invoice.model";
import { InvoiceService } from "src/app/host/invoices/services/invoice.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { IColumnDef, IDatatableAction } from "../datatable/datatable.component";
import { defaultCol } from "../datatable/datatable.helper";
import { CurrencyPipe, DatePipe, TitleCasePipe } from "@angular/common";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { MatDatepicker } from "@angular/material/datepicker";
import { ITableColumnDef } from "../table/table.model";

export const MY_FORMATS = {
  parse: {
    dateInput: "YYYY",
  },
  display: {
    dateInput: "YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

declare const $: any;

@Component({
  selector: "app-invoice-list-table",
  templateUrl: "./invoice-list-table.component.html",
  styleUrls: ["./invoice-list-table.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class InvoiceListTableComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() companyId: string;

  tableId = "invoicesDatatable";
  columnDefs: IColumnDef[] = [
    defaultCol(0, "invoiceNumber", "Receipt Number"),
    defaultCol(1, "referenceName", "Company"),
    {
      ...defaultCol(2, "status", "Status"),
      render: (data) => {
        return `
          <span class="${
            data === "canceled"
              ? "text-danger"
              : data === "active"
              ? "text-success"
              : "text-warning"
          }">${this.titleCasePipe.transform(data)}</span>
        `;
      },
    },
    {
      ...defaultCol(3, "invoiceDate", "Receipt Date"),
      render: (data) => {
        return `<span class='d-none'>${this.datePipe.transform(
          data,
          "yyyy/MM/dd"
        )}</span>${this.datePipe.transform(data, "MM/dd/yyyy")}`;
      },
    },
    {
      ...defaultCol(4, "totalAmount", "Original Amount"),
      render: (data) => {
        return this.currencyPipe.transform(data, "USD");
      },
    },
    {
      ...defaultCol(5, "totalDue", "Balance Due"),
      render: (data) => {
        return this.currencyPipe.transform(data, "USD");
      },
    },
    {
      ...defaultCol(6, "totalPaid", "Amount Paid"),
      render: (data) => {
        return this.currencyPipe.transform(data, "USD");
      },
    },
    {
      ...defaultCol(7, "totalRefund", "Amount Refunded"),
      render: (data) => {
        return this.currencyPipe.transform(data, "USD");
      },
    },
  ];
  actions: IDatatableAction[] = [
    {
      name: "view",
      icon: "visibility",
      className: "btn-info",
      title: "View",
      callback: this.openInvoice.bind(this),
    },
    {
      name: "reprocess",
      icon: "build",
      className: "btn-success",
      title: "Process",
      enabled: [{
        key: "status",
        value: ["past due", "failed"],
      }],
      callback: this.onProcess.bind(this),
    },
    {
      name: "refund",
      icon: "currency_exchange",
      className: "btn-danger",
      title: "Refund",
      roles: ["backoffice"],
      enabled: [{
        key: "canRefund",
        value: [true],
      }],
      callback: this.onRefund.bind(this),
    },
    {
      name: "delete",
      icon: "delete",
      className: "btn-warning",
      title: "Delete",
      roles: ["backoffice"],
      enabled: [{
        key: "status",
        value: ["past due", "due"],
      },
      {
        key: "totalPaid",
        value: [0],
      }],
      callback: this.onDelete.bind(this),
    },
  ];
  toolbar: string | undefined = undefined;

  invoices: IInvoice[] = [];
  facilities: IFacility[] = [];

  invoiceSummaryDate = moment();
  readonly maxInvoiceSummaryDate = moment();
  readonly minInvoiceSummaryDate = moment().year(2023);
  invoiceSummary: IInvoiceSummary | undefined;
  summaryColumns: ITableColumnDef[] = [
    {
      field: "invoiceNumber",
      title: "Receipt Number",
    },
    {
      field: "status",
      title: "Status",
    },
    {
      field: "invoiceDate",
      title: "Receipt Date",
      format: {
        type: "date",
      },
    },
    {
      field: "totalAmount",
      title: "Original Amount",
    },
    { field: "actions" },
  ];
  refundForm: FormGroup;
  chargeForm: FormGroup;

  constructor(
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private invoiceService: InvoiceService,
    private notificationService: NotificationService,
    private facilityService: FacilityService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.sessionService.getUser$().subscribe((user) => {
      this.toolbar = "";
      if (user?.turoUserType === "backoffice") {
        this.toolbar = `
          <button mat-raised-button class="btn btn-success my-0" id="chargeHost">
            Charge Host
          </button>
        `;
      }

      this.toolbar += `
        <button mat-raised-button class="btn btn-info ml-2" id="invoiceSummary">
          Invoice Summary
        </button>
      `;
    });
  }

  ngOnChanges(): void {
    this.getInvoicesByHostId();
    this.getFacilities();
    this.getSummary();
  }

  ngAfterViewInit(): void {
    $("button").click(function () {
      if ($(this).attr("id") === "chargeHost") {
        $("#chargeHostModal").modal("show");
      }
      if ($(this).attr("id") === "invoiceSummary") {
        $("#invoiceSummaryModal").modal("show");
      }
    });
  }

  private getInvoicesByHostId(showZeroInvoice = false): void {
    if (this.companyId) {
      this.invoiceService
        .getInvoicesById<IInvoice[]>(this.companyId, !showZeroInvoice)
        .subscribe({
          next: (res: IInvoice[]) => (this.invoices = res),
          error: () => (this.invoices = []),
        });
    }
  }

  private getFacilities(): void {
    if (this.companyId) {
      this.facilityService
        .getFacilitiesByCompanyId<IFacility[]>(this.companyId)
        .subscribe({
          next: (res) => {
            this.facilities = res;
          },
          error: () => {
            this.facilities = [];
          },
        });
    }
  }

  private initForms(): void {
    this.refundForm = new FormGroup({
      invoiceId: new FormControl("", Validators.required),
      reason: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
    });

    this.chargeForm = new FormGroup({
      companyId: new FormControl(this.companyId),
      facilityId: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(10),
      ]),
      facilityShare: new FormControl(false),
    });
  }

  onChangeYear(date: Moment, dp: MatDatepicker<Moment>): void {
    this.invoiceSummaryDate = date;
    this.getSummary(date.year());
    dp.close();
  }

  getSummary(year?: number): void {
    if (this.companyId) {
      this.invoiceService
        .getSummary<IInvoiceSummary>(
          this.companyId,
          year ?? moment().format("yyyy")
        )
        .subscribe({
          next: (res) => {
            this.invoiceSummary = res;
          },
          error: () => {
            this.invoiceSummary = undefined;
          },
        });
    }
  }

  getInvoices(month: number): void {
    if (this.invoiceSummary.openedMonthId === month) {
      this.invoiceSummary.openedMonthId = -1;
    } else {
      this.invoiceSummary.openedMonthId = month;

      const startDate = moment()
        .year(this.invoiceSummaryDate.year())
        .month(month)
        .startOf("M")
        .format("MM/DD/yyyy hh:mm:ss");
      const endDate = moment()
        .year(this.invoiceSummaryDate.year())
        .month(month)
        .endOf("M")
        .format("MM/DD/yyyy hh:mm:ss");
      const query = `?companyId=${this.companyId}&startDate=${startDate}&endDate=${endDate}`;
      this.invoiceService.getInvoicesByDateRange<IInvoice[]>(query).subscribe({
        next: (res) => {
          this.invoiceSummary.monthly[month].invoices = {
            totalRows: res.length,
            rows: res,
          };
        },
        error: () => {
          this.invoiceSummary.monthly[month].invoices = undefined;
        },
      });
    }
  }

  openInvoice(invoiceId: string): void {
    window.open(`/external/invoice/${invoiceId}`, "_blank");
  }

  onProcess(invoiceId: string): void {
    this.invoiceService.process({ invoiceId }).subscribe({
      next: () => {
        this.notificationService.notify("", "success", "Process is succeed");
      },
    });
  }

  onRefund(id: string): void {
    this.refundForm.patchValue({
      invoiceId: id,
      reason: null,
      amount: null,
    });

    $("#refundModal").modal("show");
  }

  onDelete(invoiceId: string): void {
    this.invoiceService.delete(invoiceId).subscribe({
      next: () => {
        const index = this.invoices.findIndex(invoice => invoice.id === invoiceId)
        if (index) {
          this.invoices.splice(index, 1);
          this.invoices = [...this.invoices]
        }
        this.notificationService.notify("", "success", "Invoice is deleted successfully");
      },
    });
  }

  saveRefund(): void {
    this.invoiceService.refund(this.refundForm.value).subscribe({
      next: () => {
        this.notificationService.notify("", "success", "Refund is succeed");

        $("#refundModal").modal("hide");
      },
    });
  }

  chargeHost(): void {
    this.invoiceService.chargeHost(this.chargeForm.value).subscribe({
      next: () => {
        this.notificationService.notify("", "success", "Charging is succeed");
        this.getInvoicesByHostId();

        $("#chargeHostModal").modal("hide");
      },
    });
  }
}
