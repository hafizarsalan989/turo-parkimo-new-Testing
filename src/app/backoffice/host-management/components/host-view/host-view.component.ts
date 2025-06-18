import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { forkJoin } from "rxjs";
import { IHost } from "src/app/host/models/host.model";
import { HostService } from "src/app/host/services/host/host.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import {
  ICard,
  ICardOnFile,
  IGateway,
} from "src/app/shared/models/card-on-file.model";
import { IPermit } from "src/app/shared/models/parking-pass.model";
import { IUser } from "src/app/shared/models/user.model";
import { CardOnFileService } from "src/app/shared/services/card-on-file/card-on-file.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { CC_ICONS } from "src/app/shared/utils/credit-card";
import { IState, STATE_LIST } from "src/app/shared/utils/states";
import { UserService } from "src/app/users/services/user.service";
import { HostManagementService } from "../../services/host-management.service";
import { AuthService } from "src/app/auth/services/auth.service";
import { IAuth } from "src/app/auth/models/auth.model";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { IProductMax } from "../../models/host-management.model";
import { DeliveryFeeComponent } from "../../../../host/delivery-fee/components/delivery-fee/delivery-fee.component";
import { MatDialog } from "@angular/material/dialog";

declare const $: any;

@Component({
  selector: "app-host-view",
  templateUrl: "./host-view.component.html",
  styleUrls: ["./host-view.component.scss"],
})
export class HostViewComponent implements OnInit {
  host: IHost | null;
  owner: IUser | null;
  infoForm: FormGroup | undefined;
  addressForm: FormGroup | undefined;
  states: IState[] = STATE_LIST;
  primaryCard: ICard;
  secondaryCard: ICard;
  hasActiveCityPass: boolean = true;

  gateway: IGateway | undefined;
  creditCardModalId: string | undefined;
  isPrimary: boolean = false;
  private icons = Object.assign(
    {},
    ...Object.keys(CC_ICONS).map((key) => {
      const newKey = key.replace("-", "");

      return { [newKey]: CC_ICONS[key] };
    })
  );

  productMaxOverrides: IProductMax[] = [];
  productMaxForm: FormGroup | undefined;
  facilities: IFacility[] = [];
  markets: string[] = [];

  tabs: ITab[] = [
    {
      id: "vehicle",
      name: "Vehicle",
    },
    {
      id: "permit",
      name: "Subscription",
    },
    {
      id: "reserved-space",
      name: "Reserved Space",
    },
    {
      id: "tags",
      name: "Tags",
    },
    {
      id: "invoice",
      name: "Invoices",
    },
    {
      id: "user",
      name: "Users",
    },
    {
      id: "activity",
      name: "Activity",
    },
    {
      id: "fuel-tank",
      name: "Fuel Tank",
    },
    {
      id: "traveler-invoices",
      name: "Guest Pay",
    },
    {
      id: "notes",
      name: "Notes",
    },
    {
      id: "chase-cars",
      name: "Chase Cars",
    },
    {
      id: "qr-code",
      name: "QR Code",
    },
    {
      id: 'referral-list',
      name: 'Referral'
    }
  ];
  tab: string = "vehicle";
  //  filterCriteria: { tag?: string; vin?: string; licensePlate?: string;facilityId?:string } = {};

  filterCriteria: { searchCriteria?: string } = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private hostService: HostService,
    private userService: UserService,
    private location: Location,
    private notificationService: NotificationService,
    private cardOnFileService: CardOnFileService,
    private hostManagementService: HostManagementService,
    private swalService: SwalService,
    private authService: AuthService,
    private facilityService: FacilityService,
    private dialog: MatDialog
  ) { }
  companyId: string = '';
  openFeeCalculator() {
    const companyId = this.companyId;
    // this.dialog.open(DeliveryFeeComponent, {
    //   width: '600px',
    //   data: { companyId: this.companyId }
    // });
    this.dialog.open(DeliveryFeeComponent, {
      width: '600px',
      data: { companyId } // ← pass the variable, not the possibly undefined property
    });

  }
  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.filterCriteria = {
        searchCriteria: params['searchCriteria'] || '',
      };
    });
    this.initForms();

    const id = this.activatedRoute.snapshot.params.id;
    this.companyId = id;
    if (id) {
      this.getHostById(id);
    }

    this.getGateway();
    this.getMarketList();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.tab = params["tab"] || "vehicle";
    });
  }

  private getHostById(id: string): void {
    this.hostService.getHostById<IHost>(id).subscribe({
      next: (res) => {
        this.host = res;
        this.getOwnerDetails(this.host.ownerId);
        this.getCityPasses();
        this._getProductMax();
        this._getFacilities();
        this.addressForm.patchValue(this.host);
        this.primaryCard = this.host.primaryCard;
        this.secondaryCard = this.host.secondaryCard;
      },
      error: () => {
        this.host = undefined;
        this.owner = undefined;
      },
    });
  }

  private getCityPasses(): void {
    this.hostManagementService
      .getPermitSubscriptionsByCompanyId<IPermit[]>(this.host.id, true)
      .subscribe({
        next: (res: IPermit[]) => {
          this.hasActiveCityPass = res.length > 0;
        },
      });
  }

  private initForms(): void {
    this.infoForm = new FormGroup({
      // For company object
      companyName: new FormControl("", Validators.required),
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      withdrawalLimit: new FormControl(1000, [
        Validators.required,
        Validators.min(0),
      ]),
      withdrawalFee: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      referralPercentage: new FormControl(0, [
        Validators.required,
        Validators.min(0),
      ]),
      autoWithdrawal: new FormControl(false),
      pauseBilling: new FormControl(false),
      allowBillback: new FormControl(false),
      allowAddOnUnlimited: new FormControl(false),
      ignoreDailyParkingPMCSFee: new FormControl(false),
      suspended: new FormControl(false),
      allowGuestRegistration: new FormControl(true),
      // For user object
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.PHONE),
      ]),
      rentalPlatformUsername: new FormControl(""),
      vehicleCount: new FormControl(1, [
        Validators.required,
        Validators.min(0),
        Validators.pattern("^-?[0-9]+$"),
      ]),
      market: new FormControl("", [Validators.required]),
    });

    this.addressForm = new FormGroup({
      address: new FormGroup({
        address1: new FormControl(""),
        address2: new FormControl(""),
        city: new FormControl(""),
        state: new FormControl(""),
        zip: new FormControl(""),
      }),
      mailingAddress: new FormGroup({
        address1: new FormControl("", Validators.required),
        address2: new FormControl(""),
        attention: new FormControl(""),
        city: new FormControl("", Validators.required),
        state: new FormControl("", Validators.required),
        zip: new FormControl("", Validators.required),
      }),
    });

    this.productMaxForm = new FormGroup({
      id: new FormControl(""),
      companyId: new FormControl(""),
      facilityId: new FormControl("", [Validators.required]),
      product: new FormControl("", [Validators.required]),
      max: new FormControl("", [Validators.required, Validators.min(0)]),
    });
  }

  cancel(): void {
    this.location.back();
  }

  verifyEmail(): void {
    this.authService
      .verify({
        verifyId: this.owner.verifyId,
        code: this.owner.verificationCode,
        email: this.owner.email,
      })
      .subscribe({
        next: (res: IAuth) => {
          this.owner = res.user;
        },
      });
  }

  getOwnerDetails(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (res: IUser) => {
        this.owner = res;

        const { pauseBilling } = this.host;

        this.infoForm.patchValue({
          ...this.owner,
          ...this.host,
          pauseBilling: pauseBilling ? false : true,
        });
      },
      error: () => (this.owner = null),
    });
  }

  onSaveInfo(): void {
    const { email, phone, pauseBilling, ...rest } = this.infoForm.value;
    const { suspended } = this.infoForm.value;

    forkJoin([
      this.hostService.saveSuspended<IHost>(this.host.id, { suspended }),
      this.hostService.saveHost<IHost>({
        ...this.host,
        ...rest,
        pauseBilling: !pauseBilling ? new Date().toUTCString() : null,
      }),
      this.userService.updateUser<IUser>({ ...this.owner, email, phone }),
    ]).subscribe({
      next: ([, host, user]) => {
        this.host = host;
        this.owner = user;

        this.notificationService.notify(
          "notification",
          "success",
          "Information was updated"
        );
      },
    });
  }

  onDelete(): void {
    this.swalService.fire(
      "Do you want to delete company?",
      "Warning",
      "warning",
      "Yes",
      "No",
      true,
      () => {
        this.hostService.delete(this.host?.id).subscribe({
          next: () => {
            this.notificationService.notify(
              "notification",
              "success",
              "Company was deleted"
            );
            this.location.back();
          },
        });
      }
    );
  }

  onSaveAddress(): void {
    this.hostService
      .saveHost<IHost>({ ...this.host, ...this.addressForm.value })
      .subscribe({
        next: () =>
          this.notificationService.notify(
            "notification",
            "success",
            "Addresses was updated"
          ),
      });
  }

  toggleTab(id: string): void {
    setTimeout(() => {
      this.tab = id;
    });
  }

  fullAddress(company: IHost | null): string {
    if (!company) {
      return "";
    }

    const { companyName, address } = company;
    const { address1, address2, attention, city, state, zip } = address;

    let result = `${companyName ?? ""}`;
    if (address1) {
      result += `\n${address1}`;
    }

    if (address2) {
      result += `\n${address2}`;
    }

    if (attention) {
      result += `\nAttention: ${attention}`;
    }

    if (city) {
      result += `\n${city}, `;
    } else {
      result += "\n";
    }

    result += `${state} ${zip}`;

    return result.trim();
  }

  fullMailingAddress(company: IHost | null): string {
    if (!company) {
      return "";
    }

    const { companyName, mailingAddress } = company;
    const { address1, address2, attention, city, state, zip } = mailingAddress;

    let result = `${companyName ?? ""}`;
    if (address1) {
      result += `\n${address1}`;
    }

    if (address2) {
      result += `\n${address2}`;
    }

    if (attention) {
      result += `\nAttention: ${attention}`;
    }

    if (city) {
      result += `\n${city}, `;
    } else {
      result += "\n";
    }

    result += `${state} ${zip}`;

    return result.trim();
  }

  private getGateway(): void {
    this.cardOnFileService.getGateway<IGateway>("turopark").subscribe({
      next: (res: IGateway) => (this.gateway = res),
      error: () => (this.gateway = null),
    });
  }

  addCreditCard(isPrimary: boolean = false): void {
    this.creditCardModalId = "companyViewCreditCard";
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

  deleteCardOnFile(cardOnFileId: string): void {
    this.cardOnFileService
      .delete<IHost>({ CardOnFileId: cardOnFileId, CompanyId: this.host.id })
      .subscribe({
        next: (res: IHost) => {
          if (!res.secondaryCard) {
            this.secondaryCard = null;
          }

          if (!res.primaryCard) {
            this.primaryCard = null;
          }

          this.notificationService.notify(
            "notification",
            "danger",
            "Card is removed successfully!"
          );
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

  getIcon(type: string): string {
    return this.icons[type.toLowerCase()] ?? this.icons.default;
  }

  openProductMaxEditor(data?: IProductMax): void {
    if (data) {
      this.productMaxForm.patchValue(data);
    } else {
      this.productMaxForm.get("companyId").setValue(this.host.id);
    }

    $("#productMaxOverrideModal").modal("show");
  }

  saveProductMax(): void {
    this.hostManagementService
      .saveProductMax<IProductMax>(this.productMaxForm.value)
      .subscribe({
        next: (res) => {
          const id = this.productMaxOverrides.findIndex((p) => p.id === res.id);

          if (id === -1) {
            this.productMaxOverrides.push(res);
          } else {
            this.productMaxOverrides[id] = res;
          }

          $("#productMaxOverrideModal").modal("hide");
        },
      });
  }

  removeProductMax(data: IProductMax): void {
    this.hostManagementService
      .deleteProductMax<IProductMax>(data.id)
      .subscribe({
        next: (res) => {
          const id = this.productMaxOverrides.findIndex((p) => p.id === res.id);

          if (id > -1) {
            this.productMaxOverrides.splice(id, 1);
          }
        },
      });
  }

  private _getProductMax(): void {
    this.hostManagementService
      .getProductMax<IProductMax[]>(this.host.id)
      .subscribe({
        next: (res) => {
          this.productMaxOverrides = res;
        },
        error: () => {
          this.productMaxOverrides = [];
        },
      });
  }

  private _getFacilities(): void {
    this.facilityService
      .getFacilitiesByCompanyId<IFacility[]>(this.host.id)
      .subscribe({
        next: (res) => {
          this.facilities = res;
        },
        error: () => {
          this.facilities = [];
        },
      });
  }

  onVehicleCountKeydown(event: KeyboardEvent): void {
    if (event.key === ".") {
      event.preventDefault();
    }

    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  }

  onVehicleCountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value !== "0") {
      value = value.replace(/^0+/, "");
    }

    input.value = value;
  }

  getMarketList(): void {
    this.authService.getMarketList<string[]>().subscribe({
      next: (res: string[]) => (this.markets = res),
      error: () => (this.markets = []),
    });
  }
}

export interface ITab {
  id: string;
  name: string;
}
