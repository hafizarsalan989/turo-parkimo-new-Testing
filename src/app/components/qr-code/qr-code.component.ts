import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";

import { IHost } from "src/app/host/models/host.model";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { environment } from "src/environments/environment";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { IQrCode } from "src/app/host/qr-management/models/qr-code.model";
import { QrManagementService } from "src/app/host/qr-management/services/qr-management.service";
import moment from "moment";

declare const $: any;

@Component({
  selector: "app-qr-code",
  templateUrl: "./qr-code.component.html",
  styleUrls: ["./qr-code.component.scss"],
})
export class QrCodeComponent implements OnChanges {
  @Input() company: IHost | undefined;

  facilities: IFacility[] = [];
  currentQrCodes: IQrCode[] = [];
  expiringQrCodes: IQrCode[] = [];
  readonly qrCodeImgUrl = `${environment.api}image/barcode/text?`;
  selectedQrCode: IQrCode | undefined;

  private _facilityId: string | undefined;

  constructor(
    private qrManagementService: QrManagementService,
    private facilityService: FacilityService,
    private swalService: SwalService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["company"]?.currentValue) {
      this._getFacilities();
    }
  }

  getCodes(facilityId: string): void {
    this._facilityId = facilityId;
    this.qrManagementService
      .getQrCodes<IQrCode[]>(this.company?.id, facilityId)
      .subscribe({
        next: (res) => {
          this._setQrCodes(res);
        },
        error: () => {
          this.currentQrCodes = [];
          this.expiringQrCodes = [];
        },
      });
  }

  toggleMode(value: boolean): void {
    this.qrManagementService
      .toggleSecureMode({
        companyId: this.company.id,
        facilityId: this._facilityId,
        allowTwoFactor: value,
      })
      .subscribe({
        next: () => {
          this.notificationService.notify(
            "notification",
            "success",
            `2FA is ${value ? "enabled" : "disabled"}`
          );

          this.getCodes(this._facilityId);
        },
      });
  }

  openQrModal(qrCode: IQrCode): void {
    this.selectedQrCode = qrCode;

    $("#qrCodeImgModal").modal("show");
  }

  expireQrCode(id: string): void {
    this.swalService.fire(
      "Do you want to expire?",
      "Warning",
      "warning",
      "Yes",
      "No",
      true,
      () => {
        this.qrManagementService.expireQrCode<IQrCode[]>(id).subscribe({
          next: (res) => {
            this.notificationService.notify(
              "notification",
              "success",
              "Qr code was expired successfully"
            );
            this._setQrCodes(res);
          },
        });
      }
    );
  }

  private _getFacilities() {
    this.facilityService.getActiveFacilities<IFacility[]>().subscribe({
      next: (res) => {
        this.facilities = res
          .filter((item) => item.supportQRCodes)
          .map((facility) => {
            const twoFactorAuth = this.company.twoFactorAuthFacilities.includes(
              facility.id
            );

            return { ...facility, twoFactorAuth };
          });
        if (this.facilities.length > 0) {
          this.getCodes(this.facilities[0].id);
        }
      },
      error: () => {
        this.facilities = [];
      },
    });
  }

  private _createCode(): void {
    this.qrManagementService
      .createQrCode<IQrCode[]>(this.company?.id, this._facilityId)
      .subscribe({
        next: (res) => {
          this._setQrCodes(res);
        },
        error: () => {
          this.currentQrCodes = [];
          this.expiringQrCodes = [];
        },
      });
  }

  private _setQrCodes(codes: IQrCode[]): void {
    const qrCodes = codes.map((item) => ({
      ...item,
      expiryInDate: `${moment(item.expirationDate).diff(
        moment(),
        "days"
      )} days`,
    }));
    this.currentQrCodes = qrCodes.filter(({ status }) => status === "active");
    this.expiringQrCodes = qrCodes.filter(
      ({ status }) => status === "expiring"
    );
  }
}
