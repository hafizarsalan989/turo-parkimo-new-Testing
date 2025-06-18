import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { TravelerInvoiceService } from "../../services/traveler-invoice.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IPermit } from "src/app/shared/models/parking-pass.model";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

@Component({
  selector: "app-traveler-invoice",
  templateUrl: "./traveler-invoice.component.html",
  styleUrls: ["./traveler-invoice.component.scss"],
})
export class TravelerInvoiceComponent implements OnInit {
  private companyId: string | undefined;

  form: FormGroup;
  facilities: Partial<IFacility>[] = [];
  permits: Partial<IPermit>[] = [];
  loading = false;
  maxDailyRate = 5;
  get amount(): number {
    const { dailyRate, numberOfDays } = this.form.value;
    return (dailyRate ?? 0) * (numberOfDays ?? 0);
    // return dailyRate * numberOfDays ?? 0;
  }

  constructor(
    private sessionService: SessionService,
    private billbackService: TravelerInvoiceService,
    private notificationService: NotificationService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.sessionService.getHost$().subscribe((host) => {
      this.companyId = host?.id;
      if (this.companyId) {
        this.getFacilities();
        this.getMessage();
      }
    });

    this.getPmcsFee();
  }

  private initForm(): void {
    this.form = new FormGroup({
      facilityId: new FormControl("", Validators.required),
      parkingPassSubscriptionId: new FormControl("", Validators.required),
      reservationId: new FormControl("", Validators.required),
      requireLicensePlate: new FormControl(false),
      requireLastName: new FormControl(false),
      sendEmail: new FormControl(true),
      customerEmail: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      customerMessage: new FormControl("", Validators.required),
      dailyRate: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.min(5),
        Validators.max(this.maxDailyRate),
      ]),
      numberOfDays: new FormControl(2),
      fee: new FormControl(0),
    });

    this.form.get("facilityId").valueChanges.subscribe((val) => {
      this.getPermitsByFacilityId(val);

      const facility = this.facilities.find((f) => f.id === val);
      this.maxDailyRate = (facility as any)?.dailyRate;

      const dailyRate = this.form.get("dailyRate");
      dailyRate.enable();
      dailyRate.setValidators([
        Validators.required,
        Validators.min(5),
        Validators.max(this.maxDailyRate),
      ]);
      dailyRate.setValue(this.maxDailyRate ?? 5);
      if (!dailyRate.value) {
        dailyRate.setErrors({ ...dailyRate.errors, required: true });
      }
      if (dailyRate.value < 5) {
        dailyRate.setErrors({ ...dailyRate.errors, min: true });
      }
      if (dailyRate.value > this.maxDailyRate) {
        dailyRate.setErrors({ ...dailyRate.errors, max: true });
      }
    });

    this.form.get("sendEmail").valueChanges.subscribe((val) => {
      if (val) {
        const customerEmail = this.form.get("customerEmail");
        customerEmail.setValidators([
          Validators.required,
          Validators.pattern(PATTERNS.EMAIL),
        ]);
        if (!customerEmail.value) {
          customerEmail.setErrors({ ...customerEmail.errors, required: true });
        }
        if (!PATTERNS.EMAIL.test(customerEmail.value)) {
          customerEmail.setErrors({ ...customerEmail.errors, pattern: true });
        }
      } else {
        this.form.get("customerEmail").setValue(null);
        this.form.get("customerEmail").setErrors(null);
        this.form.get("customerEmail").clearValidators();
      }
    });
  }

  private getFacilities(): void {
    this.billbackService
      .getFacilitiesByCompanyId<Partial<IFacility>[]>(this.companyId)
      .subscribe({
        next: (res) => {
          this.facilities = res;
        },
        error: () => {
          this.facilities = [];
        },
      });
  }

  private getPermitsByFacilityId(facilityId: string): void {
    this.billbackService
      .getPermitsByFacilityId<Partial<IPermit>[]>(this.companyId, facilityId)
      .subscribe({
        next: (res) => {
          this.permits = res;
        },
        error: () => {
          this.permits = [];
        },
      });
  }

  private getMessage(): void {
    this.billbackService
      .getLastMessageByCompanyId<string>(this.companyId)
      .subscribe({
        next: (res) => {
          this.form.get("customerMessage").setValue(res);
        },
      });
  }

  private getPmcsFee(): void {
    this.billbackService.getPmcsFee<number>().subscribe({
      next: (res) => {
        this.form.get("fee").setValue(res);
      },
    });
  }

  onSave(): void {
    this.loading = true;
    this.billbackService.save(this.form.value).subscribe({
      next: () => {
        this.notificationService.notify(
          "notification",
          "success",
          "Billback invoice was created successfully"
        );
        this.loading = false;
        setTimeout(() => {
          this.location.back();
        }, 500);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.location.back();
  }
}
