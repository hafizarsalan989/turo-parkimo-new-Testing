import { AfterViewInit, Component, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

import { IRole, IUser } from "src/app/shared/models/user.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import {
  checkPasswords,
  CustomErrorStateMatcher,
} from "src/app/shared/utils/custom-error-state-matcher/custom-error-state-matcher";
import { IState, STATE_LIST } from "src/app/shared/utils/states";
import { UserService } from "src/app/users/services/user.service";
import { ExternalService } from "src/app/external/services/external.service";
import { IHost } from "src/app/host/models/host.model";
import {
  IGateway,
  ICard,
  ICardOnFile,
} from "src/app/shared/models/card-on-file.model";
import { HostService } from "src/app/host/services/host/host.service";
import { CardOnFileService } from "src/app/shared/services/card-on-file/card-on-file.service";
import { ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { IApiDefinition } from "../../models/api-definition.model";
import {
  IQuickTravelerInvoice,
  IQuickTravelerInvoiceTripCharge,
} from "../../models/travel-invoice.model";
import { TravelerInvoiceService } from "src/app/host/traveler-invoice/services/traveler-invoice.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { CC_ICONS } from "src/app/shared/utils/credit-card";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { formatNumber, formatPercent } from "@angular/common";
import { pairwise, startWith } from "rxjs";

declare const $: any;

@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit, AfterViewInit {
  user: IUser | null;

  profileForm: FormGroup;
  states: IState[] = STATE_LIST;

  passwordForm: FormGroup;
  passwordMatcher = new CustomErrorStateMatcher();
  loadingPassword: boolean;

  host: IHost | null;

  get isHostAdmin(): boolean {
    return (
      this.user?.roles.some((r: IRole) => r.roleName === "admin") &&
      this.user?.turoUserType === "host"
    );
  }

  companyForm: FormGroup;

  mailingForm: FormGroup;

  gateway: IGateway;
  creditCardModalId: string;
  isPrimary: boolean = false;
  primaryCard: ICard;
  secondaryCard: ICard;
  private icons = Object.assign(
    {},
    ...Object.keys(CC_ICONS).map((key) => {
      const newKey = key.replace("-", "");

      return { [newKey]: CC_ICONS[key] };
    })
  );

  achForm: FormGroup | undefined;

  invoiceForm: FormGroup | undefined;
  get invoices(): FormArray {
    return this.invoiceForm.controls["invoices"] as FormArray;
  }
  private invoiceData: IQuickTravelerInvoice[] = [];

  accessToken: string | undefined;
  apiDefinition: IApiDefinition[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionService: SessionService,
    private userService: UserService,
    private notificationService: NotificationService,
    private hostService: HostService,
    private cardOnFileService: CardOnFileService,
    private publicService: PublicService,
    private swalService: SwalService,
    private externalService: ExternalService
  ) {}

  ngOnInit(): void {
    this.initForms();

    this.sessionService.getUser$().subscribe({
      next: (res: IUser) => {
        this.user = res;
        this.profileForm.patchValue(this.user);
      },
      error: () => (this.user = null),
    });

    this.sessionService.getHost$().subscribe((res: IHost | null) => {
      if (res) {
        this.host = res;
        this.companyForm.patchValue(this.host);
        this.mailingForm.patchValue(this.host.mailingAddress);
        this.primaryCard = this.host.primaryCard;
        this.secondaryCard = this.host.secondaryCard;
        this.achForm.patchValue(this.host.ach);

        this.getTravelerInvoices();
        this.onCreateKey();
      }
    });

    this.getGateway();

    this.getPublicAPIDefinition();
  }

  ngAfterViewInit(): void {
    const id = this.activatedRoute.snapshot.queryParams["section"];
    if (id) {
      const el = document.getElementById(id);
      el?.querySelector("a")?.click();
      setTimeout(() => {
        el?.scrollIntoView({ block: "end", inline: "nearest" });
      }, 300);
    }
  }

  private initForms(): void {
    this.profileForm = new FormGroup({
      id: new FormControl(""),
      hash: new FormControl(""),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.PHONE),
      ]),
      company: new FormControl(""),
      addresses: new FormGroup({
        address1: new FormControl(""),
        address2: new FormControl(""),
        city: new FormControl(""),
        state: new FormControl(""),
        zip: new FormControl(""),
      }),
    });

    this.passwordForm = new FormGroup({
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        checkPasswords,
      ]),
    });

    this.companyForm = new FormGroup({
      id: new FormControl(""),
      hash: new FormControl(""),
      companyName: new FormControl("", [Validators.required]),
      address: new FormGroup({
        address1: new FormControl(""),
        address2: new FormControl(""),
        city: new FormControl(""),
        state: new FormControl(""),
        zip: new FormControl(""),
      }),
    });

    this.mailingForm = new FormGroup({
      address1: new FormControl("", Validators.required),
      address2: new FormControl(""),
      attention: new FormControl(""),
      city: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      zip: new FormControl("", Validators.required),
    });

    this.invoiceForm = new FormGroup({
      invoices: new FormArray([]),
    });

    this.achForm = new FormGroup({
      abaNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d{1,}$/),
      ]),
      accountNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d{1,}$/),
      ]),
      bankName: new FormControl("", Validators.required),
      accountOwnerName: new FormControl("", Validators.required),
      accountOwnerPhone: new FormControl("", Validators.required),
    });
  }

  saveProfile(): void {
    this.userService
      .updateUser({ ...this.user, ...this.profileForm.value })
      .subscribe({
        next: () =>
          this.notificationService.notify(
            "notification",
            "success",
            "Profile is updated"
          ),
      });
  }

  savePassword(): void {
    const payload = {
      userId: this.user.id,
      password: this.passwordForm.value.password,
    };

    this.userService.updatePassword(payload).subscribe({
      next: () =>
        this.notificationService.notify(
          "notification",
          "success",
          "Password is updated"
        ),
    });
  }

  saveInformation(value: Partial<IHost>): void {
    this.hostService.saveHost({ ...this.host, ...value }).subscribe({
      next: () =>
        this.notificationService.notify(
          "notification",
          "success",
          "Company information is updated"
        ),
    });
  }

  private getGateway(): void {
    this.cardOnFileService.getGateway<IGateway>("turopark").subscribe({
      next: (res: IGateway) => (this.gateway = res),
      error: () => (this.gateway = null),
    });
  }

  addCreditCard(isPrimary: boolean = false): void {
    this.creditCardModalId = "companySettingsCreditCard";
    this.isPrimary = isPrimary;

    setTimeout(() => {
      $(`#${this.creditCardModalId}`).modal("show");
    }, 300);
  }

  saveCardOnFile(event: any): void {
    this.cardOnFileService
      .save<ICardOnFile>({
        ...event,
        isPrimary: this.isPrimary,
        companyId: this.host.id,
      })
      .subscribe({
        next: (res: ICardOnFile) => {
          this.primaryCard = res.primaryCard;
          this.secondaryCard = res.secondaryCard;

          $(`#${this.creditCardModalId}`).modal("hide");
          setTimeout(() => {
            this.creditCardModalId = "";
          }, 300);
        },
      });
  }

  setToPrimary(): void {
    this.cardOnFileService
      .setPrimary<ICardOnFile>({
        cardOnFileId: this.secondaryCard.id,
        companyId: this.host.id,
      })
      .subscribe({
        next: (res: ICardOnFile) => {
          this.primaryCard = res.primaryCard;
          this.secondaryCard = res.secondaryCard;
        },
      });
  }

  deleteCardOnFile(cardOnFileId: string): void {
    this.cardOnFileService
      .delete<IHost>({ CardOnFileId: cardOnFileId, CompanyId: this.host.id })
      .subscribe({
        next: (res: IHost) => {
          this.secondaryCard = null;
          this.notificationService.notify(
            "notification",
            "danger",
            "Card is removed successfully!"
          );
        },
      });
  }

  getIcon(type: string): string {
    return this.icons[type.toLowerCase()] ?? this.icons.default;
  }

  saveAch(): void {
    this.hostService.saveAch(this.host.id, this.achForm.value).subscribe({
      next: () => {
        this.notificationService.notify(
          "notification",
          "success",
          "ACH is updated"
        );
      },
    });
  }

  onCreateKey(): void {
    this.hostService.createKey<string>(this.host.id).subscribe({
      next: (res: string) => {
        this.accessToken = res;
      },
      error: () => {
        this.accessToken = undefined;
      },
    });
  }

  onCancelKey(): void {
    this.hostService.cancelKey(this.host.id).subscribe({
      next: () => {
        this.accessToken = undefined;
      },
      error: () => {
        this.accessToken = undefined;
      },
    });
  }

  getPublicAPIDefinition(): void {
    this.publicService.getPmsDefinition<IApiDefinition[]>().subscribe({
      next: (res) => {
        this.apiDefinition = res;
      },
      error: () => {
        this.apiDefinition = [];
      },
    });
  }

  private getTravelerInvoices(): void {
    this.publicService
      .getTraverInvoices<IQuickTravelerInvoice[]>(this.host.id)
      .subscribe({
        next: (res) => {
          this.invoiceData = res;

          this.invoices.clear();

          this.invoiceData.map((invoice) => {
            invoice.minimumTravelerInvoiceParkingFeePercent = Number(
              formatNumber(
                invoice.minimumTravelerInvoiceParkingFee /
                  invoice.travelerInvoiceParkingFee,
                "en-us",
                "1.0-6"
              )
            );
          });

          this.invoiceData.forEach((invoice) => {
            this.invoices.push(this.initInvoiceForm(invoice));
          });
        },
        error: () => {
          this.invoices.clear();
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
      // message: new FormControl(message, [Validators.required]),
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

  formatPercent(value: number) {
    return formatPercent(value, "en-us");
  }

  totalCharge(invoice: FormControl): number {
    return (
      invoice.value.travelerInvoiceParkingFee *
        invoice.value.percentPassThrough +
      invoice.value.tripCharges.reduce((acc, { amount }) => acc + amount, 0)
    );
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
            const invoiceForm = this.initInvoiceForm(this.invoiceData[index]);
            this.invoices.at(index).reset(invoiceForm.value);
          }, 300);
        }
      );
    } else {
      this.saveInvoice(invoice, index);
    }
  }

  saveInvoice(invoice: IQuickTravelerInvoice, index: number): void {
    this.publicService
      .saveTraverInvoices<IQuickTravelerInvoice>(invoice)
      .subscribe({
        next: (res) => {
          const { urlKey, ...rest } = res;

          this.invoices.at(index).patchValue({
            ...rest,
            invoiceUrl: `${location.origin}/external/pay/${urlKey}?quick=yes`,
            prevIsEnabled: res.isEnabled,
            isPending: false,
          });
        },
      });
  }
}
