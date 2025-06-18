import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { forkJoin, switchMap } from "rxjs";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IChaseCarRes } from "src/app/host/chase-cars/models/chase-car.model";
import { ChaseCarService } from "src/app/host/chase-cars/services/chase-car.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { IUser } from "src/app/shared/models/user.model";
import { IHost } from "src/app/host/models/host.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";

@Component({
  selector: "app-chase-car",
  templateUrl: "./chase-car.component.html",
  styleUrls: ["./chase-car.component.scss"],
})
export class ChaseCarComponent implements OnInit, OnChanges {
  @Input() companyId: string | undefined;

  private chaseCarRes: IChaseCarRes | undefined;
  public chaseCarsAllowed: number | undefined;
  public chaseCarAllowedCtrl = new FormControl(NaN, [
    Validators.required,
    Validators.max(99),
  ]);
  public search: string | undefined;
  public fastPasses: Partial<IVehicle>[];
  public fastpassIds: string[] = [];
  public facilities: IFacility[] = [];
  public selectedFacilityId: string | undefined;
  user: IUser | undefined;

  constructor(
    private chaseCarService: ChaseCarService,
    private notificationService: NotificationService,
    private facilityService: FacilityService,
    private sessionService: SessionService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
    });

    this.getFacilitiesWithSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["companyId"].currentValue) {
      this.getChaseVehicles();
    }
  }

  private getChaseVehicles(): void {
    if (!this.companyId || !this.selectedFacilityId) {
      return;
    }

    this.chaseCarService
      .getChaseVehiclesByCompanyAndFacility<IChaseCarRes>(
        this.companyId,
        this.selectedFacilityId
      )
      .subscribe({
        next: (res) => {
          this.chaseCarRes = res;
          this.chaseCarsAllowed = res.chaseCarsAllowed;
          this.fastPasses = res.fastPasses;
          this.fastpassIds = res.fastPasses
            .filter((f) => f.chaseVehicleEnabled)
            .map((f) => f.fastPassId);

          this.chaseCarAllowedCtrl.setValidators([
            Validators.required,
            Validators.max(99),
            Validators.min(this.fastpassIds.length),
          ]);
          this.chaseCarAllowedCtrl.setValue(this.chaseCarsAllowed, {
            emitEvent: false,
          });
        },
        error: () => (this.chaseCarRes = undefined),
      });
  }

  private getFacilitiesWithSubscriptions(): void {
    forkJoin([
      this.vehicleService.getVehiclesByHostId<IVehicle[]>(this.companyId),
      this.facilityService.getActiveFacilities<IFacility[]>(),
    ]).subscribe({
      next: ([vehicles, facilities]) => {
        this.facilities = facilities.filter((f) =>
          vehicles.some(
            (v) =>
              v.subscriptionFacilityId === f.id &&
              v.status === "Active" &&
              v.activePassCount > 0
          )
        );
        if (facilities.length > 0) {
          this.selectedFacilityId = this.facilities[0]?.id;
          this.getChaseVehicles();
        }
      },
      error: () => (this.facilities = []),
    });
  }

  onSearch(): void {
    this.fastPasses = this.chaseCarRes.fastPasses.filter((f) => {
      let hasSearch = true,
        hasLocation = true;

      if (this.search) {
        hasSearch = f.name.toLowerCase().includes(this.search?.toLowerCase());
      }

      if (this.selectedFacilityId) {
        hasLocation = f.parkingFacilityId === this.selectedFacilityId;
      }

      return hasSearch && hasLocation;
    });
  }

  selectFacility(facilityId: string): void {
    this.selectedFacilityId = facilityId;
    this.getChaseVehicles();
  }

  toggle(e: MatCheckboxChange): void {
    const index = this.chaseCarRes.fastPasses.findIndex(
      (f) => f.fastPassId === e.source.id
    );
    this.chaseCarRes.fastPasses[index].chaseVehicleEnabled = e.checked;

    if (
      e.checked &&
      this.fastpassIds.length < this.chaseCarAllowedCtrl?.value
    ) {
      this.fastpassIds.push(e.source.id);
    } else {
      const index = this.fastpassIds.findIndex((f) => f === e.source.id);
      this.fastpassIds.splice(index, 1);
    }

    this.chaseCarAllowedCtrl.setValidators([
      Validators.required,
      Validators.max(99),
      Validators.min(this.fastpassIds.length),
    ]);
  }

  isDisabled(enabled: boolean): boolean {
    return (
      !enabled && this.fastpassIds.length >= this.chaseCarAllowedCtrl?.value
    );
  }

  save(): void {
    const chaseCarSaveReq = this.chaseCarService.saveChaseVehicle({
      facilityId: this.selectedFacilityId,
      companyId: this.companyId,
      fastpasIds: this.fastpassIds,
    });
    let req = chaseCarSaveReq;

    if (
      this.chaseCarAllowedCtrl.valid &&
      this.chaseCarsAllowed !== this.chaseCarAllowedCtrl.value
    ) {
      req = this.chaseCarService
        .saveCompanyChaseCarMax(this.companyId, {
          facilityId: this.selectedFacilityId,
          companyId: this.companyId,
          chaseCarMax: this.chaseCarAllowedCtrl.value,
        })
        .pipe(
          switchMap(() => {
            this.chaseCarsAllowed = this.chaseCarAllowedCtrl.value;

            return chaseCarSaveReq;
          })
        );
    }

    req.subscribe({
      next: () =>
        this.notificationService.notify(
          "notification",
          "success",
          "Chase cars were updated"
        ),
    });
  }
}
