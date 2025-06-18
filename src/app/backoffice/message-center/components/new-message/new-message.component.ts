import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { MessageCenterService } from "../../services/message-center.service";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-new-message",
  templateUrl: "./new-message.component.html",
  styleUrls: ["./new-message.component.scss"],
})
export class NewMessageComponent implements OnInit {
  form: FormGroup;
  facilities: IFacility[] = [];
  separatorKeysCodes = [ENTER, COMMA];
  editor = ClassicEditor;

  constructor(
    private messageCenterService: MessageCenterService,
    private facilityService: FacilityService,
    private router: Router,
    private dialogRef: MatDialogRef<NewMessageComponent>
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      facilityId: new FormControl("none"),
      bccs: new FormControl([], [this.hasBccs]),
      subject: new FormControl("", [Validators.required]),
      message: new FormControl("", [Validators.required]),
      sms: new FormControl(true),
      email: new FormControl(true),
      inApp: new FormControl(true),
    });

    this.form.get("facilityId").valueChanges.subscribe((val) => {
      this.form.get("bccs").setErrors(null);
      if (val === "none") {
        this.form.get("bccs").setValidators([this.hasBccs]);
        if (this.form.value.bccs.length === 0) {
          this.form.get("bccs").setErrors({ noBccs: true });
        }
      } else {
        this.form.get("bccs").setValidators(null);
      }
    });

    this.getFacilities();
  }

  addBcc(e: MatChipInputEvent): void {
    if (e.value) {
      if (PATTERNS.EMAIL.test(e.value.toLowerCase())) {
        const bccs = this.form.get("bccs").value;
        this.form.get("bccs").setValue([...bccs, e.value]);
        this.form.get("bccs").updateValueAndValidity();
        this.form.get("bccs").setErrors(null);

        if (e.chipInput.inputElement) {
          e.chipInput.inputElement.value = "";
        }
      } else {
        this.form.get("bccs").setErrors({ pattern: true });
      }
    }
  }

  removeBcc(index: number): void {
    this.form.get("bccs").value.splice(index, 1);
    if (
      this.form.value.facilityId === "none" &&
      this.form.value.bccs.length === 0
    ) {
      this.form.get("bccs").setErrors({ noBccs: true });
    }
  }

  send(): void {
    const { facilityId, sms, email, inApp, ...rest } = this.form.value;
    const methods = [];
    if (sms) {
      methods.push("sms");
    }
    if (email) {
      methods.push("email");
    }
    if (inApp) {
      methods.push("inApp");
    }

    this.messageCenterService
      .create({
        ...rest,
        methods,
        facilityId,
        sendToAll: facilityId === "all",
      })
      .subscribe({
        next: () => {
           this.dialogRef.close();
          //this.router.navigate(["backoffice/message-center/list"]);
        },
      });
  }

  onCancel(): void {
    //this.router.navigate(["backoffice/message-center/list"]);
    this.dialogRef.close();
  }
  closeDialog(): void {
    this.dialogRef.close(); // Optionally pass data if needed
  }
  private getFacilities(): void {
    this.facilityService.getActiveFacilities<IFacility[]>().subscribe({
      next: (res: IFacility[]) => {
        this.facilities = res;
      },
      error: () => {
        this.facilities = [];
      },
    });
  }

  private hasBccs(control: AbstractControl): { [key: string]: any } | null {
    return control.value.length > 0 ? null : { noBccs: true };
  }
}
