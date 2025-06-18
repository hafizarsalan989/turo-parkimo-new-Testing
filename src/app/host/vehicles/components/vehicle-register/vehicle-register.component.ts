import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { BreakpointObserver } from "@angular/cdk/layout";
import { StepperOrientation } from "@angular/cdk/stepper";
import { MatStepper } from "@angular/material/stepper";
import { Observable, map } from "rxjs";

import { SessionService } from "src/app/shared/services/session/session.service";
import {
  IVehicle,
  IVehicleRequest,
} from "src/app/host/vehicles/models/vehicle.model";
import { COLORS } from "src/app/shared/utils/colors";
import { IState, STATE_LIST } from "src/app/shared/utils/states";
import { VehicleService } from "../../services/vehicle.service";
import { IHost } from "src/app/host/models/host.model";
import { IFacilityMarket } from "../../models/facility.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { MatDialogRef } from "@angular/material/dialog";

declare const $: any;

@Component({
  selector: "app-vehicle-register",
  templateUrl: "./vehicle-register.component.html",
  styleUrls: ["./vehicle-register.component.scss"],
})
export class VehicleRegisterComponent implements OnInit {
  private host: IHost | undefined;
  @ViewChild("stepper") stepper: MatStepper;
  stepperOrientation: Observable<StepperOrientation>;

  baseForm: FormGroup;
  colors: string[] = COLORS;
  states: IState[] = STATE_LIST;
  isSearched: boolean = false;

  imgForm: FormGroup;

  facilityMarkets: IFacilityMarket[] = [];
  facilityMarketForm: FormGroup;

  isAgree = false;
  message: string | null = null;
  messageType: 'success' | 'info' | 'error' = 'info';

  showLocalNotification(type: 'success' | 'info' | 'error', msg: string): void {
    this.messageType = type;
    this.message = msg;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }

  constructor(
    private vehicleService: VehicleService,
    private sessionService: SessionService,
    private location: Location,
    private breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<VehicleRegisterComponent>
  ) {
    this.stepperOrientation = this.breakpointObserver
      .observe("(min-width: 800px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
  }
  existingVehicleNames: string[] = [];
  ngOnInit() {
    this.initForms();
    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
      this.loadHostVehicles();
    });
  }
  private loadHostVehicles(): void {
    this.vehicleService.getVehiclesByHostId(this.host.id).subscribe((res: IVehicle[]) => {
      console.log("Vehicles:", res);
      this.existingVehicleNames = res.map(v => v.name?.toLowerCase().trim());
      this.applyDuplicateValidator();
    });

  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }
  searchVehicleDetails(event?: Event): void {
    if (event) {
      event.preventDefault();
    }

    if (!this.baseForm.value.vin.length) {
      return;
    }

    this._getVehicleDetail();
  }
  duplicateNameValidator(existingNames: string[]) {
    return (control: FormControl) => {
      const inputName = control.value?.toLowerCase().trim();
      if (existingNames.includes(inputName)) {
        return { duplicateName: true };
      }
      return null;
    };
  }
  private applyDuplicateValidator(): void {
    const nameControl = this.baseForm.get("name");
    nameControl.setValidators([
      Validators.required,
      Validators.minLength(5),
      this.duplicateNameValidator(this.existingVehicleNames)
    ]);
    nameControl.updateValueAndValidity();
  }


  goToImageStep(): void {
    if (this.isSearched) {
      this.stepper.next();
    } else {
      const callback = () => this.stepper.next();

      this._getVehicleDetail(callback);
    }
  }

  setVehicleImg(key: string, url: string): void {
    this.imgForm.get(key).setValue(url);
  }

  cancel(): void {
    this.dialogRef.close();
    // this.location.back();
  }

  /*** Save vehicle  */
  saveVehicle(): void {
    const payload: IVehicleRequest = {
      ...this.baseForm.value,
      ...this.imgForm.value,
      companyId: this.host.id,
    };

    this.vehicleService.saveVehicle<IVehicle>(payload).subscribe({
      next: () => {
        // this.notificationService.notify(
        //   "notification",
        //   "success",
        //   "Vehicle is saved."
        // );
        this.showLocalNotification('success', 'Vehicle is saved');

        this.stepper.next();
      },
    });
  }

  reset(): void {
    this.baseForm.reset();
    this.imgForm.reset();
    this.stepper.reset();
  }

  private initForms(): void {
    this.baseForm = new FormGroup({
      id: new FormControl(""),
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
      vin: new FormControl("", [Validators.required]),
      licensePlate: new FormControl("", [Validators.required]),
      licensePlateState: new FormControl("", [Validators.required]),
      color: new FormControl("", [Validators.required]),
      vehicleType: new FormControl("Turo"),
      make: new FormControl(""),
      model: new FormControl(""),
      engine: new FormControl(""),
      trim: new FormControl(""),
      year: new FormControl(""),
    });

    this.baseForm.get("vin").valueChanges.subscribe(() => {
      this.isSearched = false;
      this.baseForm.patchValue({
        make: "",
        model: "",
        engine: "",
        trim: "",
        year: "",
      });
    });

    this.imgForm = new FormGroup({
      imgFront: new FormControl(""),
      imgRearWithPlate: new FormControl(""),
    });

    this.facilityMarketForm = new FormGroup({
      id: new FormControl("", Validators.required),
      currentDiscountedAmount: new FormControl(""),
      marketRulesLink: new FormControl(""),
    });
  }

  private _getVehicleDetail(callback?: Function): void {
    this.vehicleService
      .getVehicleDetailsByVin(this.baseForm.value.vin)
      .subscribe({
        next: (res: Partial<IVehicle>) => {
          if (res.make) {
            this.isSearched = true;

            const { make, model, engine, trim, year } = res;
            this.baseForm.get("make").setValue(make);
            this.baseForm.get("model").setValue(model);
            this.baseForm.get("engine").setValue(engine);
            this.baseForm.get("trim").setValue(trim);
            this.baseForm.get("year").setValue(year);

            if (callback) {
              callback();
            }
            //this.existingVehicleNames = res.map(v => v.name?.toLowerCase().trim());
          } else {

            this.showLocalNotification('info', 'VIN is not found');
          }
        },
        error: () => {
          this.baseForm.get("make").setValue("");
          this.baseForm.get("model").setValue("");
          this.baseForm.get("engine").setValue("");
          this.baseForm.get("trim").setValue("");
          this.baseForm.get("year").setValue("");
        },
      });
  }
}


