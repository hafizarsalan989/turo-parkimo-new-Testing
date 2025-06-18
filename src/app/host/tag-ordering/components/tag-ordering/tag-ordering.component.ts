import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  IHost,
  IMailingPreferenceOption,
} from "src/app/host/models/host.model";
import { HostService } from "src/app/host/services/host/host.service";
import { ITagType } from "../../models/tag-type.model";
import { TagOrderingService } from "../../services/tag-ordering.service";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { SessionService } from "src/app/shared/services/session/session.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { IState, STATE_LIST } from "src/app/shared/utils/states";
import { HostManagementService } from "src/app/backoffice/host-management/services/host-management.service";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { IAssignedTag } from "src/app/components/permit-replace-tag-modal/permit-replace-tag-modal.component";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-tag-ordering",
  templateUrl: "./tag-ordering.component.html",
  styleUrls: ["./tag-ordering.component.scss"],
})
export class TagOrderingComponent implements OnInit {
  private host: IHost | undefined;

  mailingForm: FormGroup;
  states: IState[] = STATE_LIST;
  isRequiredMailingAddress = false;

  mailingPreferenceOptions: IMailingPreferenceOption[] = [];
  tagTypes: ITagType[] = [];

  loading = false;
  form: FormGroup;
  // dialogRef: any;


  get shippingPrice(): number {
    const opt = this.mailingPreferenceOptions.find(
      (o) => o.id === this.form?.value.shippingId
    );
    return opt?.price ?? 0;
  }
  get orders(): FormArray {
    return this.form?.get("orders") as FormArray;
  }
  get totalPrice(): number {
    let price = this.shippingPrice;
    this.orders.value.forEach((order) => {
      price += order.count * order.price;
    });

    return price;
  }
  activeSubscriptions: number = 0;
  tags: number = 0;

  constructor(
    private hostService: HostService,
    private tagOrderingService: TagOrderingService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private router: Router,
    private hostManagementService: HostManagementService,
    private vehicleService: VehicleService,
    private dialogRef: MatDialogRef<TagOrderingComponent>,
  ) { }
  message: string | null = null;
  messageType: 'success' | 'info' | 'error' |'danger';

  showLocalNotification(type: 'success' | 'info' | 'error'|'danger', msg: string): void {
    this.messageType = type;
    this.message = msg;

    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.message = null;
    }, 3000);
  }

  ngOnInit(): void {
    this.initForms();
    this.getMailingpreferenceOptions();
    this.getTagTypes();
    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
      this.mailingForm.patchValue(this.host?.mailingAddress);
      console.log('host: ', this.host);
      this._getActiveSubscriptionCount();
      this._getAssignedTags();
    });
  }

  private initForms(): void {
    this.mailingForm = new FormGroup({
      address1: new FormControl("", Validators.required),
      address2: new FormControl(""),
      city: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      zip: new FormControl("", Validators.required),
    });

    this.mailingForm.valueChanges.subscribe(() => {
      if (this.mailingForm.invalid) {
        if (!this.isRequiredMailingAddress) {
          // this.notificationService.notify(
          //   "notification",
          //   "danger",
          //   "Please fill out the shipping address"
          // );
          this.showLocalNotification('danger', 'Please fill out the shipping address');

          this.isRequiredMailingAddress = true;
        }
      } else {
        this.isRequiredMailingAddress = false;
      }
    });

    this.form = new FormGroup({
      shippingId: new FormControl("", Validators.required),
      orders: new FormArray([], [Validators.required, this.someQuantity()]),
    });
  }

  private someQuantity(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const orders = control.value;

      if (orders.every((order) => !order.count)) {
        return { quantity: true };
      }

      return null;
    };
  }

  saveShippingAddress(): void {
    if (this.mailingForm.invalid) {
      return;
    }

    this.hostService
      .saveHost({
        ...this.host,
        mailingAddress: {
          ...this.mailingForm.value,
          attention: this.host.mailingAddress.attention,
        },
      })
      .subscribe({
        next: () =>
          // this.notificationService.notify(
          //   "notification",
          //   "success",
          //   "Company information is updated"
          // ),
          this.showLocalNotification('success', 'Company information is updated'),
      });
  }

  private initTagTypeForm(tagType: ITagType): FormGroup {
    return new FormGroup({
      tagTypeId: new FormControl(tagType.id),
      count: new FormControl(0, [Validators.min(0)]),
      name: new FormControl(tagType.name),
      price: new FormControl(tagType.price),
    });
  }

  private getMailingpreferenceOptions(): void {
    this.hostService
      .getMailingpreferenceOptions<IMailingPreferenceOption[]>()
      .subscribe({
        next: (res: IMailingPreferenceOption[]) => {
          this.mailingPreferenceOptions = res;
          console.log('mailingPreferenceOptions: ', this.mailingPreferenceOptions);
        }
        ,
        error: () => (this.mailingPreferenceOptions = []),
      });
  }

  private getTagTypes(): void {
    this.orders.clear();
    this.tagOrderingService.getTagTypes<ITagType[]>().subscribe({
      next: (res: ITagType[]) => {
        this.tagTypes = res;
        res.forEach((tagType) => {
          this.orders.push(this.initTagTypeForm(tagType));
        });
      },
      error: () => {
        this.tagTypes = [];
      },
    });
  }

  private _getActiveSubscriptionCount(): void {
    this.vehicleService
      .getVehiclesByHostId<IVehicle[]>(this.host.id)
      .subscribe({
        next: (res: IVehicle[]) => {
          this.activeSubscriptions = res.reduce(
            (acc, cur) => acc + cur.activePassCount,
            0
          );
          console.log('activeSubscriptions: ', this.activeSubscriptions)
        },
        error: () => (this.activeSubscriptions = 0),
      });
  }

  private _getAssignedTags(): void {
    this.hostManagementService
      .getAssignedTagsByCompanyId<IAssignedTag[]>(this.host.id)
      .subscribe({
        next: (res) => {
          this.tags = res.length;
          console.log('tags: ', this.tags)
        },
        error: () => {
          this.tags = 0;
        },
      });
  }
  closeDialog(): void {
    this.dialogRef.close(); // Optionally pass data if needed
  }

  save(): void {
    this.loading = true;

    const orders = this.form.value.orders.map((o) => ({
      ...o,
      count: o.count ?? 0,
    }));

    this.tagOrderingService
      .order(this.host.id, { ...this.form.value, orders })
      .subscribe({
        next: (res: { success: boolean; message: string }) => {
          this.loading = false;
          if (res.success) {
            // this.notificationService.notify(
            //   "notifiction",
            //   "success",
            //   res.message
            // );
            this.showLocalNotification('success', res.message);
            this.form.get("shippingId").setValue(null);
            this.orders.controls.forEach((order) => {
              order.get("count").setValue(0);
            });
            // Close the modal and send result back to parent
            this.dialogRef.close({ refreshList: true });
            //this.router.navigate(["host", "vehicle", "list"]);
          } else {
            // this.notificationService.notify(
            //   "notifiction",
            //   "danger",
            //   res.message
            // );
            this.showLocalNotification('danger', res.message);
          }
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
