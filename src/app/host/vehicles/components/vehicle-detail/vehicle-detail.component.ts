import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { COLORS } from "src/app/shared/utils/colors";
import { IState, STATE_LIST } from "src/app/shared/utils/states";
import { IVehicle } from "../../models/vehicle.model";
import { VehicleService } from "../../services/vehicle.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SessionService } from "src/app/shared/services/session/session.service";
import { IHost } from "src/app/host/models/host.model";
@Component({
  selector: "app-vehicle-detail",
  templateUrl: "./vehicle-detail.component.html",
  styleUrls: ["./vehicle-detail.component.scss"],
})
export class VehicleDetailComponent implements OnInit {
  editable: boolean;
  vehicleId: string;
  private host: IHost | undefined;

  form: FormGroup;
  states: IState[] = STATE_LIST;
  colors: string[] = COLORS;

  sessionTableId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private location: Location,
    private notificationService: NotificationService,
    private sessionService: SessionService
  ) {
    this.editable = this.activatedRoute.snapshot.data["editable"];
    this.vehicleId = this.activatedRoute.snapshot.params["id"];
    this.sessionTableId = this.editable
      ? "editSessionsDatatable"
      : "viewSessionsDatatable";
  }
  existingVehicleNames: string[] = [];
  ngOnInit(): void {
    this.initForm();
    console.log("Vid", this.vehicleId);
    this.getVehicleById();
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
    const nameControl = this.form.get("name");
    nameControl.setValidators([
      Validators.required,
      Validators.minLength(5),
      this.duplicateNameValidator(this.existingVehicleNames)
    ]);
    nameControl.updateValueAndValidity();
  }


  private initForm(): void {
    this.form = new FormGroup({
      companyId: new FormControl(""),
      id: new FormControl(""),
      name: new FormControl("", [Validators.required, Validators.minLength(5)]),
      vin: new FormControl("", [Validators.required]),
      licensePlate: new FormControl("", [Validators.required]),
      licensePlateState: new FormControl("", [Validators.required]),
      color: new FormControl("", [Validators.required]),
      vehicleType: new FormControl(""),
      make: new FormControl(""),
      model: new FormControl(""),
      engine: new FormControl(""),
      trim: new FormControl(""),
      year: new FormControl(""),
      imgFront: new FormControl(""),
      imgRearWithPlate: new FormControl(""),
      isDeleted: new FormControl(""),
      status: new FormControl(""),
      subscriptionMarketName: new FormControl(""),
      subscriptionTag: new FormControl(""),
    });
  }

  setVehicleImg(key: string, url: string): void {
    this.form.get(key).setValue(url);
  }

  private getVehicleById(): void {
    this.vehicleService.getVehicleById<IVehicle>(this.vehicleId).subscribe({
      next: (res: IVehicle) => {
        this.form.patchValue(res);
      },
    });
  }

  editVehicle(): void {
    this.router.navigate([`/host/vehicle/${this.vehicleId}/edit`]);
  }

  cancel(): void {
    this.location.back();
  }

  //   saveVehicle(): void {
  //     this.vehicleService.saveVehicle(this.form.value).subscribe({
  //       next: () => {
  //         this.notificationService.notify(
  //           "notification",
  //           "success",
  //           "Vehicle is updated."
  //         );
  //         this.router.navigate([`/host/vehicle/list`]);
  //       },
  //     });
  //   }
  // }
  


  saveVehicle(): void {
    if (this.form.invalid) return;

    this.vehicleService.saveVehicle(this.form.value).subscribe({
      next: (response) => {
        console.log('Vehicle save response:', response);
        this.notificationService.notify("notification", "success", "Vehicle is updated.");
        this.router.navigate([`/host/vehicle/list`]);
      },
      error: (error) => {
        console.error('Error saving vehicle:', error);

        if (error.status === 400 && error.error?.message?.includes('already exists')) {
          // Set validation error manually if API returns duplicate name
          const nameControl = this.form.get('name');
          nameControl.setErrors({ duplicateVehicleName: true });
          nameControl.markAsTouched();
        }
      }
    });
  }

}

export function vehicleNameUniqueValidator(existingNames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value?.toLowerCase().trim();
    return name && existingNames.includes(name)
      ? { duplicateVehicleName: true }
      : null;
  };
}


