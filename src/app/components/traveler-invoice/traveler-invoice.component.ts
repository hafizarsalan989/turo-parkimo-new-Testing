import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { ClipboardService } from "ngx-clipboard";
import * as moment from "moment";
import {
  IBillbackRes,
  ITravelerInvoice,
} from "src/app/host/traveler-invoice/models/traveler-invoice.model";
import { TravelerInvoiceService } from "src/app/host/traveler-invoice/services/traveler-invoice.service";
import { ExternalService } from "src/app/external/services/external.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { ITableData, ITableConfigs } from "../table/table.model";
import { IUser } from "src/app/shared/models/user.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { PublicService } from "src/app/my-account/services/public.service";
import { IQuickTravelerInvoice } from "src/app/my-account/models/travel-invoice.model";
import { WithdrawService } from "src/app/backoffice/withdraws/services/withdraw.service";
import { IWithdraw } from "src/app/backoffice/withdraws/models/withdraw.model";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { formatNumber, formatPercent } from "@angular/common";
import { pairwise, startWith } from "rxjs";
import { environment } from "src/environments/environment";

declare const $: any;

@Component({
  selector: "app-host-traveler-invoice",
  templateUrl: "./traveler-invoice.component.html",
  styleUrls: ["./traveler-invoice.component.scss"],
})
export class TravelInvoiceComponent implements OnInit, OnChanges {
  @Input() hostId: string | undefined;

  user: IUser | undefined;

  status: "pending" | "paid" | "other" = "paid";

  selectedInvoice: IQuickTravelerInvoice | undefined;

  rangeForm: FormGroup;
  today = new Date();

  columnDefs = [
    { field: "created", title: "Date Issued", format: { type: "date" } },
    { field: "status", title: "Status" },
    { field: "customerName", title: "Customer Name" },
    { field: "customerLicensePlate", title: "Vehicle License Plate" },
    { field: "invoiceNumber", title: "Invoice" },
    { field: "total", title: "Amount", format: { type: "currency" } },
    { field: "totalRefund", title: "Refunded", format: { type: "currency" } },
    { field: "vehicleName", title: "Vehicle Name" },
    { field: "facilityName", title: "Facility Name" },
    { field: "actions" },
  ];
  matSortActive = this.columnDefs[0].field;

  pageSizeOptions = [100, 250, 500];

  pendings: ITableData | undefined;

  paids: ITableData | undefined;

  others: ITableData | undefined;

  refundForm: FormGroup;

  invoices: IQuickTravelerInvoice[] = [];
  invoiceForm: FormGroup | undefined;
  get invoiceCtrls(): FormArray {
    return this.invoiceForm.controls["invoices"] as FormArray;
  }
  private facilities: Partial<IFacility>[] = [];

  withdraws: IWithdraw[] = [];

  constructor(
    private billbackService: TravelerInvoiceService,
    private sessionService: SessionService,
    private router: Router,
    private swalService: SwalService,
    private notificationService: NotificationService,
    private clipboardService: ClipboardService,
    private publicService: PublicService,
    private withdrawService: WithdrawService,
    private travelerInvoiceService: TravelerInvoiceService,
    private externalService: ExternalService
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["hostId"]?.currentValue) {
      this.getBillbacks();
      this.getTravelerInvoices();
      this.getWithdraws();
      this.getFacilities();
    }
  }

  onToggle(status: "pending" | "paid" | "other"): void {
    this.status = status;
    this.getBillbacks();
  }

  payGuest(): void {
    if (this.invoices.length > 1) {
      $("#payGuestExitFeeModal").modal("show");
    } else {
      const url = this.getInvoiceUrl(this.invoices[0].urlKey, true);
      window.open(url, "_blank");
    }
  }

  hidePayGuestExitFeeModal(): void {
    $("#payGuestExitFeeModal").modal("hide");
  }

  getBillbacks(query?: ITableConfigs): void {
    let { startDate, endDate } = this.rangeForm?.value ?? {
      startDate: moment().subtract(7, "days"),
      endDate: moment(),
    };
    startDate = moment(startDate).format("YYYY-MM-DD");
    endDate = moment(endDate).format("YYYY-MM-DD");

    const params = {
      ...query,
      pageSize: query?.pageSize ?? this.pageSizeOptions[0],
      companyId: this.hostId,
      startDate,
      endDate,
      status: this.status,
    };

    this.billbackService.getBillbacks<IBillbackRes>(params).subscribe({
      next: (res) => {
        if (this.status === "pending") {
          this.pendings = {
            ...res,
            rows: res.rows.sort((a, b) =>
              a[this.matSortActive] < b[this.matSortActive] ? 1 : -1
            ),
          };
        } else if (this.status === "paid") {
          this.paids = {
            ...res,
            rows: res.rows.sort((a, b) =>
              a[this.matSortActive] < b[this.matSortActive] ? 1 : -1
            ),
          };
        } else {
          this.others = {
            ...res,
            rows: res.rows.sort((a, b) =>
              a[this.matSortActive] < b[this.matSortActive] ? 1 : -1
            ),
          };
        }
      },
    });
  }

  addBillBack(): void {
    this.router.navigate(["/host/guest-pay/add"]);
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
        this.billbackService.cancel(id).subscribe({
          next: () => {
            this.notificationService.notify(
              "notification",
              "success",
              "Invoice was canceled"
            );
            const index = this.pendings.rows.findIndex(
              (item) => item.id === id
            );
            this.pendings.rows.splice(index, 1);
            this.pendings = {
              totalRows: this.pendings.rows.length,
              rows: this.pendings.rows,
            };
          },
        });
      }
    );
  }

  onView(id: string): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`external/pay/${id}`])
    );
    //const url = `${environment.guestPayUrl}receipt/${id}`;
    window.open(url, "_blank");
  }

  onCopy(id: string): void {
    const { protocol, host } = window.location;
    this.clipboardService.copy(`${protocol}//${host}/external/pay/${id}`);
  }

  onRefund(invoice: ITravelerInvoice): void {
    this.refundForm.get("hostBillbackId").setValue(invoice.id);
    this.refundForm.get("amount").setValue(invoice.total);
    $("#billbackRefundModal").modal("show");
  }

  private initForm(): void {
    this.rangeForm = new FormGroup({
      startDate: new FormControl<Date | null>(
        moment().subtract(7, "days").toDate(),
        Validators.required
      ),
      endDate: new FormControl<Date | null>(
        moment().toDate(),
        Validators.required
      ),
    });
    this.rangeForm.get("endDate").valueChanges.subscribe((endDate) => {
      if (endDate) {
        const diff = moment(endDate).diff(
          moment(this.rangeForm.value.startDate),
          "days"
        );
        if (diff > 31) {
          this.rangeForm.get("endDate").setErrors({ rangeOver: true });
        } else {
          this.rangeForm.get("endDate").setErrors(null);

          setTimeout(() => {
            this.getBillbacks();
          }, 300);
        }
      }
    });

    this.refundForm = new FormGroup({
      hostBillbackId: new FormControl("", Validators.required),
      reason: new FormControl("", Validators.required),
      amount: new FormControl(
        { value: null, disabled: true },
        Validators.required
      ),
    });

    this.invoiceForm = new FormGroup({
      invoices: new FormArray([]),
    });
  }

  saveRefund(): void {
    this.billbackService
      .refund(this.refundForm.value.hostBillbackId, this.refundForm.value)
      .subscribe({
        next: () => {
          this.getBillbacks();
          this.notificationService.notify("", "success", "Refund is succeed");

          $("#billbackRefundModal").modal("hide");
        },
      });
  }

  getInvoiceUrl(key: string, isHostPay: boolean = false): string {
    if (isHostPay) {
      return `${location.origin}/external/pay/${key}?quick=yes&hostPay=yes`;
    }

    return `${location.origin}/external/pay/${key}?quick=yes`;
  }

  openManageQuickLinksModal(): void {
    $("#quickLinkModal").modal("hide");
    setTimeout(() => {
      $("#manageQuickLinkModal").modal("show");
    }, 500);
  }

  formatPercent(value: number) {
    return formatPercent(value, "en-us");
  }

  onSave(invoice: IQuickTravelerInvoice, index: number): void {
    if (invoice.isEnabled) {
      this.swalService.fire(
        `<div class="text-left">
        <p>You are enabling the guest pay functionality of PMCS and affirming your acceptance of the PMCS TOS.</p>
        <p>While enabled:</p>
        <ul>
          <li>PMCS will charge the guest an exit fee.</li>
          <li>You will make the invoice available to the guest prior to the rental pickup</li>
          <li>You agree to disclose the amount of the PMCS parking exit fee in the <strong>Description</strong> field for your vehicle on your car share platform.</li>
        </ul>
        <p>Non-compliance may result in removal from the PMCS platform and parking facility.</p>
        </div>`,
        "Warning",
        "warning",
        "I Agree",
        "I Don't Agree",
        true,
        () => {
          this.saveInvoice(invoice, index);
        },
        () => {
          setTimeout(() => {
            const invoiceForm = this.initInvoiceForm(this.invoices[index]);
            this.invoiceCtrls.at(index).reset(invoiceForm.value);
          }, 300);
        }
      );
    } else {
      this.saveInvoice(invoice, index);
    }
  }

  private saveInvoice(invoice: IQuickTravelerInvoice, index: number): void {
    this.publicService
      .saveTraverInvoices<IQuickTravelerInvoice>(invoice)
      .subscribe({
        next: (res) => {
          const { urlKey, ...rest } = res;

          this.invoiceCtrls.at(index).patchValue({
            ...rest,
            invoiceUrl: `${location.origin}/external/pay/${urlKey}?quick=yes`,
            prevIsEnabled: res.isEnabled,
            isPending: false,
          });

          this.getTravelerInvoices();
        },
      });
  }

  private getTravelerInvoices(): void {
    this.publicService
      .getTraverInvoices<IQuickTravelerInvoice[]>(this.hostId)
      .subscribe({
        next: (res) => {
          this.invoices = res.filter((item) => item.isEnabled);

          this.invoiceCtrls.clear();

          this.invoices.map((invoice) => {
            invoice.minimumTravelerInvoiceParkingFeePercent = Number(
              formatNumber(
                invoice.minimumTravelerInvoiceParkingFee /
                  invoice.travelerInvoiceParkingFee,
                "en-us",
                "1.0-6"
              )
            );
          });

          res.forEach((invoice) => {
            this.invoiceCtrls.push(this.initInvoiceForm(invoice));
          });
        },
        error: () => {
          this.invoices = [];
          this.invoiceCtrls.clear();
        },
      });
  }

  private getWithdraws(): void {
    this.withdrawService
      .getAll<IWithdraw[]>(`companyId=${this.hostId}`)
      .subscribe({
        next: (res) => {
          this.withdraws = res;
        },
        error: () => {
          this.withdraws = [];
        },
      });
  }

  private initInvoiceForm(invoice: IQuickTravelerInvoice): FormGroup {
    const {
      id,
      companyId,
      urlKey,
      facilityId,
      facilityName,
      minimumTravelerInvoiceParkingFee,
      minimumTravelerInvoiceParkingFeePercent,
      isEnabled,
      // guestPayEnabled,
      // requireLicensePlate,
      // requireLastName,
      travelerInvoiceParkingFee,
      percentPassThrough,
      // message,
      tripCharges,
    } = invoice;

    const form = new FormGroup({
      id: new FormControl(id),
      companyId: new FormControl(companyId),
      invoiceUrl: new FormControl(
        `${location.origin}/external/pay/${urlKey}?quick=yes`
      ),
      urlKey: new FormControl(urlKey),
      facilityId: new FormControl(facilityId),
      facilityName: new FormControl(facilityName),
      isEnabled: new FormControl(isEnabled),
      // guestPayEnabled: new FormControl(guestPayEnabled),
      // requireLicensePlate: new FormControl(requireLicensePlate),
      // requireLastName: new FormControl(requireLastName),
      travelerInvoiceParkingFee: new FormControl(travelerInvoiceParkingFee),
      percentPassThrough: new FormControl(percentPassThrough),
      minimumTravelerInvoiceParkingFee: new FormControl(
        minimumTravelerInvoiceParkingFee
      ),
      minimumTravelerInvoiceParkingFeePercent: new FormControl(
        minimumTravelerInvoiceParkingFeePercent
      ),
      parkingFee: new FormControl(
        formatNumber(
          travelerInvoiceParkingFee * percentPassThrough,
          "en-us",
          "1.0-2"
        ),
        [
          Validators.min(minimumTravelerInvoiceParkingFee),
          Validators.max(travelerInvoiceParkingFee),
        ]
      ),
      tripCharges: new FormArray([]),
      // message: new FormControl(message),
      prevIsEnabled: new FormControl(isEnabled),
      isPending: new FormControl(false),
    });

    tripCharges.forEach((tripCharge) => {
      (form.controls.tripCharges as FormArray).push(
        new FormGroup({
          name: new FormControl(tripCharge.name),
          amount: new FormControl(tripCharge.amount),
        })
      );
    });

    form.get("percentPassThrough").valueChanges.subscribe((percent) => {
      this.externalService
        .getTripFeesByFacilityId<{ amount: number; name: string }[]>(
          form.get("facilityId").value,
          parseFloat(
            formatNumber(travelerInvoiceParkingFee * percent, "en-us", "1.0-2")
          )
        )
        .subscribe({
          next: (res: { amount: number; name: string }[]) => {
            const tripChargesFormArray = form.controls.tripCharges as FormArray;
            tripChargesFormArray.clear();

            res.forEach((tripCharge) => {
              tripChargesFormArray.push(
                new FormGroup({
                  name: new FormControl(tripCharge.name),
                  amount: new FormControl(tripCharge.amount),
                })
              );
            });
          },
          error: (err) => {
            const tripChargesFormArray = form.controls.tripCharges as FormArray;
            tripChargesFormArray.clear();
          },
        });

      form
        .get("parkingFee")
        .setValue(
          formatNumber(travelerInvoiceParkingFee * percent, "en-us", "1.0-2")
        );
    });

    form.valueChanges
      .pipe(startWith(invoice), pairwise())
      .subscribe(([prev, cur]) => {
        if (
          prev.isEnabled !== cur.isEnabled ||
          // prev.requireLicensePlate !== cur.requireLicensePlate ||
          // prev.requireLastName !== cur.requireLastName ||
          prev.percentPassThrough !== cur.percentPassThrough
          // prev.message !== cur.message
        ) {
          form.get("isPending").setValue(true);
        }
      });

    return form;
  }

  totalCharge(invoice: FormControl): number {
    return (
      invoice.value.travelerInvoiceParkingFee *
        invoice.value.percentPassThrough +
      invoice.value.tripCharges.reduce((acc, { amount }) => acc + amount, 0)
    );
  }

  onChangeParkingFee(e: Event, invoice: FormGroup): void {
    invoice
      .get("percentPassThrough")
      .setValue(
        Number(
          formatNumber(
            Number((e.target as HTMLTextAreaElement).value) /
              invoice.value.travelerInvoiceParkingFee,
            "en-us",
            "1.0-6"
          )
        )
      );
  }

  private getFacilities(): void {
    this.travelerInvoiceService
      .getFacilitiesByCompanyId<Partial<IFacility>[]>(this.hostId)
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
