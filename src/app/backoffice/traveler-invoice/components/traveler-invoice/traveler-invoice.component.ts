import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ITableData } from "src/app/components/table/table.model";
import { TravelerInvoiceService } from "../../services/traveler-invoice.service";
import { ITravelerInvoiceSummary } from "../../models/traveler-invoice-summary.model";
import { HostService } from "src/app/host/services/host/host.service";
import { IHost } from "src/app/host/models/host.model";
import { ITravelerInvoice } from "../../models/traveler-invoice.model";
import { TravelerInvoiceService as HostTravelerInvoiceService } from "src/app/host/traveler-invoice/services/traveler-invoice.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";

declare const $: any;

@Component({
  selector: "app-traveler-invoice",
  templateUrl: "./traveler-invoice.component.html",
  styleUrls: ["./traveler-invoice.component.scss"],
})
export class TravelerInvoiceComponent implements OnInit {
  summary: ITravelerInvoiceSummary | undefined;
  tableData: ITableData | undefined;
  form: FormGroup;
  hosts: IHost[] = [];
  statuses = [
    { label: "Due", value: "due" },
    { label: "Past Due", value: "past due" },
    { label: "Paid", value: "paid" },
    { label: "Failed", value: "failed" },
    { label: "Canceled", value: "canceled" },
    { label: "Expired", value: "expired" },
  ];

  columnDefs = [
    { field: "created", title: "Date", format: { type: "date" } },
    { field: "hostName", title: "Host" },
    { field: "status", title: "Status" },
    { field: "invoiceNumber", title: "Invoice Number" },
    { field: "amount", title: "Amount", format: { type: "currency" } },
    { field: "location", title: "Location" },
    { field: "customerEmail", title: "Customer Email" },
    { field: "zipCode", title: "Zip Code" },
    { field: "actions" },
  ];
  matSortActive = this.columnDefs[0].field;

  refundForm: FormGroup;

  constructor(
    private backofficeBillbackService: TravelerInvoiceService,
    private hostService: HostService,
    private router: Router,
    private hostBillbackService: HostTravelerInvoiceService,
    private notificationService: NotificationService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getSummary();
    this.getInvoices();
    this.getHosts();
  }

  getSummary(): void {
    this.backofficeBillbackService
      .getSummary<ITravelerInvoiceSummary>()
      .subscribe({
        next: (res) => {
          this.summary = res;
        },
      });
  }

  getInvoices(): void {
    let { startDate, endDate, ...rest } = this.form.value;
    startDate = startDate
      ? `${startDate.toISOString().split("T")[0]}T00:00:00.000Z`
      : "";
    endDate = endDate
      ? `${endDate.toISOString().split("T")[0]}T23:59:59.000Z`
      : "";
    this.backofficeBillbackService
      .search<ITravelerInvoice[]>({ ...rest, startDate, endDate })
      .subscribe({
        next: (res) => {
          this.tableData = {
            totalRows: res.length,
            rows: res.sort((a, b) =>
              a[this.matSortActive] < b[this.matSortActive] ? 1 : -1
            ),
          };
        },
      });
  }

  onClear(): void {
    this.form.reset({ startDate: new Date(), endDate: new Date() });
  }

  onView(id: string): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`external/pay/${id}`])
    );
    window.open(url, "_blank");
  }

  onCancel(id: string): void {
    this.swalService.fire(
      `Sure you want to cancel this invoice`,
      "Warning",
      "warning",
      "Yes, cancel it",
      "No",
      true,
      () => {
        this.hostBillbackService.cancel(id).subscribe({
          next: () => {
            this.notificationService.notify(
              "notification",
              "success",
              "Invoice was canceled"
            );
            const index = this.tableData.rows.findIndex(
              (item) => item.billbackId === id
            );
            this.tableData.rows[index].status = "canceled";
            this.tableData = { ...this.tableData };
          },
        });
      }
    );
  }

  onRefund(id: string): void {
    const data = this.tableData.rows.find((item) => item.billbackId === id);
    this.refundForm.get("hostBillbackId").setValue(id);
    this.refundForm.get("amount").setValue(data.amount);
    $("#hostBillbackRefundModal").modal("show");
  }

  saveRefund(): void {
    this.hostBillbackService
      .refund(this.refundForm.value.hostBillbackId, this.refundForm.value)
      .subscribe({
        next: () => {
          this.notificationService.notify("", "success", "Refund is succeed");

          $("#hostBillbackRefundModal").modal("hide");
        },
      });
  }

  private initForms(): void {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    this.form = new FormGroup({
      companyId: new FormControl(""),
      startDate: new FormControl(startDate),
      endDate: new FormControl(new Date()),
      status: new FormControl("due"),
    });

    this.form.valueChanges.subscribe(() => {
      this.getInvoices();
    });

    this.refundForm = new FormGroup({
      hostBillbackId: new FormControl("", Validators.required),
      reason: new FormControl("", [Validators.required]),
      amount: new FormControl("", Validators.required),
    });
  }

  private getHosts(): void {
    this.hostService.getHostManagement<IHost[]>().subscribe({
      next: (hosts: IHost[]) => {
        this.hosts = hosts;
      },
      error: () => {
        this.hosts = [];
      },
    });
  }
}
