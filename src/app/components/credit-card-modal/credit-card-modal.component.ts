import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import * as moment from "moment";
import { Moment } from "moment";
import * as validator from "card-validator";

import { IGateway } from "src/app/shared/models/card-on-file.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import {
  CC_ICONS,
  ValidateNumber,
  ValidateExpiry,
  ValidateCVV,
} from "src/app/shared/utils/credit-card";

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

declare const $: any;
declare const Accept: any;

@Component({
  selector: "app-credit-card-modal",
  templateUrl: "./credit-card-modal.component.html",
  styleUrls: ["./credit-card-modal.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class CreditCardModalComponent implements OnInit {
  @Input() modalId: string = "creditCardMoal";
  @Input() gateway: IGateway | null;
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();
  @Output() canceled: EventEmitter<null> = new EventEmitter<null>();

  form: FormGroup;
  get cardIcon(): string {
    const icon: string =
      validator.number(this.form.value.cardNumber).card?.type ?? "default";

    return CC_ICONS[icon];
  }
  minExpiry = moment();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = new FormGroup({
      cardNumber: new FormControl("", [
        Validators.required,
        Validators.minLength(14),
        Validators.maxLength(18),
        ValidateNumber,
      ]),
      cardExpiry: new FormControl("", [Validators.required, ValidateExpiry]),
      cardCode: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(4),
        ValidateCVV,
      ]),
    });
  }

  setMonthAndYear(
    normalizedMonthAndYear: Moment,
    datepicker: MatDatepicker<Moment>
  ) {
    const ctrlValue = moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.form.get("cardExpiry").setValue(ctrlValue);
    datepicker.close();
  }

  saveCreditCard(): void {
    const { cardNumber, cardExpiry, cardCode } = this.form.value;
    const month = moment(cardExpiry).format("MM");
    const year = moment(cardExpiry).format("YY");
    Accept.dispatchData(
      {
        authData: {
          apiLoginID: this.gateway.authId,
          clientKey: this.gateway.publicKey,
        },
        cardData: {
          cardNumber: cardNumber.replaceAll(" ", ""),
          month,
          year,
          cardCode,
        },
      },
      (res: {
        opaqueData: Record<string, string>;
        messages?: Record<string, string | unknown>;
      }) => {
        if (res.messages.resultCode === "Ok") {
          this.saved.emit({
            tempToken: res.opaqueData.dataValue,
            dataDescriptor: res.opaqueData.dataDescriptor,
          });
        } else {
          this.notificationService.notify(
            "notification",
            "danger",
            res.messages.message[0].text
          );
        }
      }
    );
  }

  cancel(): void {
    $(`#${this.modalId}`).modal("hide");

    setTimeout(() => {
      this.canceled.emit();
    }, 300);
  }
}
