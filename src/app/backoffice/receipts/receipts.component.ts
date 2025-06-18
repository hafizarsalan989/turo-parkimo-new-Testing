import { CurrencyPipe, DatePipe, TitleCasePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import * as moment from "moment";
import {
  IColumnDef,
  IDatatableAction,
} from "src/app/components/datatable/datatable.component";
import { defaultCol } from "src/app/components/datatable/datatable.helper";
import { IInvoice } from "src/app/host/invoices/models/invoice.model";
import { InvoiceService } from "src/app/host/invoices/services/invoice.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-receipts",
  templateUrl: "./receipts.component.html",
  styleUrls: ["./receipts.component.scss"],
})
export class ReceiptsComponent implements OnInit {
  tableId = "backofficeReceipsDatatable";
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
      callback: this.openInvoice,
    },
    {
      name: "report",
      icon: "report",
      className: "btn-primary",
      title: "Report",
      callback: this.viewReport.bind(this),
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

  invoices = [];
  rangeForm: FormGroup;
  refundForm: FormGroup;

  constructor(
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private receiptService: InvoiceService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getInvoices();
  }

  private initForms(): void {
    this.rangeForm = new FormGroup({
      startDate: new FormControl<Date | null>(
        moment().toDate(),
        Validators.required
      ),
      endDate: new FormControl<Date | null>(
        moment().toDate(),
        Validators.required
      ),
    });

    this.refundForm = new FormGroup({
      invoiceId: new FormControl("", Validators.required),
      reason: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
    });
  }

  getInvoices(): void {
    if (this.rangeForm.invalid) {
      return;
    }

    let { startDate, endDate } = this.rangeForm.value;
    startDate = moment(startDate).format("YYYY-MM-DD");
    endDate = moment(endDate).format("YYYY-MM-DD");
    const query = `?startDate=${startDate}&endDate=${endDate}`;

    this.receiptService.getInvoicesByDateRange<IInvoice[]>(query).subscribe({
      next: (res: IInvoice[]) => {
        this.invoices = res;
      },
      error: () => (this.invoices = []),
    });
  }

  openInvoice(invoiceId: string): void {
    window.open(`/external/invoice/${invoiceId}`, "_blank");
  }

  viewReport(invoiceId: string): void {
    const invoice = this.invoices.find((i) => i.id === invoiceId);
    this.receiptService.getReport(invoiceId).subscribe({
      next: (res: any) => {
        let dataType = res.type;
        let binaryData: BlobPart[] = [];
        binaryData.push(res);
        let aTag = document.createElement("a");
        aTag.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        aTag.target = "_blank";
        aTag.download = `Invoice ${
          invoice?.invoiceNumber ?? ""
        } Explanation Report`;
        document.body.appendChild(aTag);
        aTag.click();
      },
    });
  }

  onProcess(invoiceId: string): void {
    this.receiptService.process({ invoiceId }).subscribe({
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
    this.receiptService.delete(invoiceId).subscribe({
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
    this.receiptService.refund(this.refundForm.value).subscribe({
      next: (res) => {
        const index = this.invoices.findIndex(
          (invoice) => invoice.id === this.refundForm.value.invoiceId
        );
        this.invoices[index] = {
          ...this.invoices[index],
          totalRefund: this.invoices[index].totalRefund + res["amount"],
        };
        this.invoices = [...this.invoices];
        this.notificationService.notify("", "success", "Refund is succeed");

        $("#refundModal").modal("hide");
      },
    });
  }
}
