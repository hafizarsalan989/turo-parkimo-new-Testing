import { Component, Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import * as moment from "moment";
import * as validator from "card-validator";

import { IInvoice } from "src/app/host/invoices/models/invoice.model";
import { ThemeService } from "src/app/shared/services/theme/theme.service";
import { ExternalService } from "../../services/external.service";
import {
  ValidateNumber,
  ValidateExpiry,
  ValidateCVV,
  CC_ICONS,
} from "src/app/shared/utils/credit-card";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { ITravelerInvoice } from "src/app/host/traveler-invoice/models/traveler-invoice.model";
import { CardOnFileService } from "src/app/shared/services/card-on-file/card-on-file.service";
import { IGateway } from "src/app/shared/models/card-on-file.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import {
  IQuickTravelerInvoiceDetails,
  IQuickTravelerInvoiceTripCharge,
} from "src/app/my-account/models/travel-invoice.model";

declare const Accept: any;

export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YY",
  },
  display: {
    dateInput: "MM/YY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-pay",
  templateUrl: "./pay.component.html",
  styleUrls: ["./pay.component.scss"],
})
export class PayComponent implements OnInit {
  private id: string | undefined;
  isQuick = false;
  isHostPay = false;
  isFacilitySelfPay: boolean = false;
  private gateway: IGateway | undefined;

  form: FormGroup | undefined;
  get cardIcon(): string {
    const icon: string =
      validator.number(this.form.value.cardNumber).card?.type ?? "default";

    return CC_ICONS[icon];
  }
  min = moment().subtract(14, "days");
  loading = false;

  invoiceDetail: IInvoice | undefined;
  tripCharges: IQuickTravelerInvoiceTripCharge[] = [];
  totalAmount: number = 0;
  requireLicensePlate = false;
  requireLastName = false;
  status = "";
  logo: string | undefined;
  title: string | undefined;
  pickUpDate: string | undefined;
  minPickUpDate = new Date();
  dropOffDate: string | undefined;
  get minDropOffDate() {
    return new Date(
      moment(this.form.value.pickupDate).add(1, "d").format("MM/DD/YYYY")
    );
  }
  numberOfPassengers: number | undefined;
  guestName: string | undefined;
  reservationId: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private externalService: ExternalService,
    private themeService: ThemeService,
    private cardOnFileService: CardOnFileService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.logo = this.themeService.getLogoDarkBluePath();
    this.title = this.themeService.getPrimaryTitle();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => {
      this.id = id;
    });
    this.activatedRoute.queryParams.subscribe(({ quick, hostPay }) => {
      this.isQuick = quick === "yes";
      this.isHostPay = hostPay === "yes";

      if (this.id) {
        if (this.isQuick) {
          this.getQuickInvoice();
        } else {
          this.getInvoice();
        }
      }
    });

    this.initForm();
    this.getGateway();
  }

  private initForm(): void {
    if (this.isHostPay) {
      this.form = new FormGroup({
        message: new FormControl(""),
        pickupDate: new FormControl("", [Validators.required]),
        guestName: new FormControl("", [Validators.required]),
        reservationId: new FormControl("", [Validators.required]),
      });
    } else {
      this.form = new FormGroup({
        message: new FormControl(""),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(PATTERNS.EMAIL),
        ]),
        customerLicensePlate: new FormControl(""),
        customerLastName: new FormControl(""),
        reservationId: new FormControl(""),
        billingZip: new FormControl("", Validators.required),
        pickupDate: new FormControl("", [Validators.required]),
        pickupTime: new FormControl(0),
        cardNumber: new FormControl("", [
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(18),
          ValidateNumber,
        ]),
        expirationDate: new FormControl("", [
          Validators.required,
          ValidateExpiry,
        ]),
        cardCode: new FormControl("", [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(4),
          ValidateCVV,
        ]),
      });

      if (this.isQuick && !this.isFacilitySelfPay) {
        this.form.addControl(
          "dropoffDate",
          new FormControl("", [Validators.required])
        );
        this.form.addControl("dropoffTime", new FormControl(0));
        this.form.addControl("numberOfPassengers", new FormControl(NaN));
      }

      if (this.isFacilitySelfPay) {
        this.form.removeControl("pickupDate");
        this.form.removeControl("pickupTime");
        this.form.removeControl("reservationId");
        this.form.removeControl("message");
      }
    }
  }

  private getInvoice(): void {
    this.externalService.getBillbackById<ITravelerInvoice>(this.id).subscribe({
      next: (res) => {
        this.invoiceDetail = res.invoice;
        this.requireLicensePlate = res.requireLicensePlate;
        this.requireLastName = res.requireLastName;
        this.status = res.status;
        this.guestName = res.customerName;
        this.reservationId = res.reservationId;
        this.pickUpDate = res.pickupDate;
        this.dropOffDate = res.dropoffDate;
        this.numberOfPassengers = res.numberOfPassengers;
        this.isHostPay = res.invoice.invoiceNumber[0] === "H";
        if (!this.isFacilitySelfPay) {
          this.form.get("message").setValue(res.customerMessage);
        }
      },
      error: () => (this.invoiceDetail = null),
    });
  }

  private getQuickInvoice(): void {
    this.externalService
      .getInvoiceByKey<IQuickTravelerInvoiceDetails>(this.id, this.isHostPay)
      .subscribe({
        next: (res) => {
          const {
            invoice,
            travelerQuickInvoice: {
              message,
              requireLicensePlate,
              requireLastName,
              facilitySelfPay,
              tripCharges,
            },
          } = res;
          this.invoiceDetail = invoice;
          this.tripCharges = tripCharges;
          this.totalAmount = invoice.totalAmount + tripCharges.reduce((acc, { amount }) => acc + amount, 0);
          this.status = res.invoice.status;
          this.requireLicensePlate = requireLicensePlate;
          this.requireLastName = requireLastName;
          this.guestName = res.invoice.customerName;
          this.reservationId = res.invoice.reservationId;
          this.pickUpDate = res.invoice.pickupDate;
          this.dropOffDate = res.invoice.dropoffDate;
          this.numberOfPassengers = res.invoice.numberOfPassengers;
          this.isHostPay = res.invoice.invoiceNumber[0] === "H";
          this.isFacilitySelfPay = facilitySelfPay;
          if (!this.isFacilitySelfPay) {
            this.form.get("message").setValue(message);
          }
          if (!this.isHostPay) {
            if (requireLicensePlate) {
              this.form
                .get("customerLicensePlate")
                .setValidators([Validators.required]);
            }
            if (requireLastName) {
              this.form
                .get("customerLastName")
                .setValidators([Validators.required]);
            }
          }
        },
        error: () => {
          this.invoiceDetail = null;
          this.tripCharges = [];
        },
      });
  }

  private getGateway(): void {
    this.cardOnFileService.getGateway<IGateway>("turopark").subscribe({
      next: (res: IGateway) => (this.gateway = res),
      error: () => (this.gateway = null),
    });
  }

  setMonthAndYear(
    normalizedMonthAndYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ) {
    const ctrlValue = moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.form.get("expirationDate").setValue(ctrlValue);
    datepicker.close();
  }

  pay(): void {
    this.loading = true;
    if (this.isHostPay) {
      this.payByHost();
    } else {
      this.payByCC();
    }
  }

  payByCC(): void {
    const {
      email,
      billingZip,
      reservationId,
      customerLicensePlate,
      customerLastName,
      pickupDate,
      pickupTime,
      dropoffDate,
      dropoffTime,
      cardNumber,
      expirationDate,
      cardCode,
      numberOfPassengers,
    } = this.form.value;
    const [year, month] = moment(expirationDate).format("yyyy/MM").split("/");
    Accept.dispatchData(
      {
        authData: {
          apiLoginID: this.gateway.authId,
          clientKey: this.gateway.publicKey,
        },
        cardData: {
          cardNumber: cardNumber.replaceAll(" ", ""),
          month,
          year: `${year}`.substring(2),
          cardCode,
          zip: this.form.value.billingZip,
        },
      },
      (res: any) => {
        if (res.messages.resultCode === "Ok") {
          const payload = {
            customerEmail: email,
            billingZip,
            customerLicensePlate,
            reservationId,
            customerLastName,
            pickupDate:
              moment(pickupDate).format("YYYY-MM-DD") +
              `T${
                pickupTime < 10 ? "0" + pickupTime : pickupTime
              }:00:00.0000000Z`,
            expirationDate,
            token: res.opaqueData.dataValue,
            cryptogram: res.opaqueData.dataDescriptor,
          };
          const req$ = !this.isQuick
            ? this.externalService.payInvoice(this.id!, payload)
            : this.externalService.payQuickInvoice({
                ...payload,
                urlKey: this.id,
                invoiceNumber: this.invoiceDetail.invoiceNumber,
                dropoffDate:
                  moment(dropoffDate).format("YYYY-MM-DD") +
                  `T${
                    dropoffTime < 10 ? "0" + dropoffTime : dropoffTime
                  }:00:00.0000000Z`,
                numberOfPassengers,
              });
          req$.subscribe({
            next: (res) => {
              this.loading = false;
              this.notificationService.notify(
                "notification",
                "success",
                "Payment is processed successfully"
              );
              if (this.isQuick) {
                this.id = (res as ITravelerInvoice).invoice.referenceId;
                this.router.navigate([`/external/pay/${this.id}?quick=yes`]);
              } else {
                this.getInvoice();
              }
            },
            error: () => {
              this.loading = false;
            },
          });
        } else {
          this.loading = false;
          this.notificationService.notify(
            "notification",
            "danger",
            res.messages.message[0].text
          );
        }
      }
    );
  }

  payByHost(): void {
    this.externalService
      .payByHost({
        ...this.form.value,
        invoicenumber: this.invoiceDetail.invoiceNumber,
        urlKey: this.id,
      })
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.notificationService.notify(
            "notification",
            "success",
            "Payment is processed successfully"
          );
          this.id = (res as ITravelerInvoice).invoice.referenceId;
          this.router.navigate([`/external/pay/${this.id}`]);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}

export const DATE_FORMAT_MM_YY = {
  parse: {
    dateInput: "MM/YY",
  },
  display: {
    dateInput: "MM/YY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "MM/YY",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Directive({
  selector: "[MMYY]",
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_MM_YY },
  ],
})
export class CustomDateFormatMMYY {}

export const DATE_FORMAT_MM_DD_YYYY = {
  parse: {
    dateInput: "MM/DD/YYYY",
  },
  display: {
    dateInput: "MM/DD/YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "MM/DD/YYYY",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Directive({
  selector: "[MMDDYYYY]",
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_MM_DD_YYYY },
  ],
})
export class CustomDateFormatMMDDYYYY {}
