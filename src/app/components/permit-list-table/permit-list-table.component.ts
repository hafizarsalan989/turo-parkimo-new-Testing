import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormArray,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import {
  IBarcode,
  IPermit,
  IPermitAddon,
} from "src/app/shared/models/parking-pass.model";
import { IImage } from "../img-viewer/img-viewer.component";
import { environment } from "src/environments/environment";
import { IColumnDef, IDatatableAction } from "../datatable/datatable.component";
import { CurrencyPipe, DatePipe, TitleCasePipe } from "@angular/common";
import { defaultCol } from "../datatable/datatable.helper";
import { FacilityService } from "src/app/facility/services/facility.service";
import {
  IFacility,
  IFacilityMarket,
} from "src/app/host/vehicles/models/facility.model";
import { forkJoin, tap } from "rxjs";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { HostManagementService } from "src/app/backoffice/host-management/services/host-management.service";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";

declare const $: any;

@Component({
  selector: "app-permit-list-table",
  templateUrl: "./permit-list-table.component.html",
  styleUrls: ["./permit-list-table.component.scss"],
})
export class PermitListTableComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() companyId: string;
  @Input() changedRow?: IPermit;

  tableId = "permitesDatatable";
  columnDefs: IColumnDef[] = [
    {
      ...defaultCol(0, "vehicle.name", "Vehicle Name"),
      render: (data, _, row) => {
        const activeAddons = row.addOnUnlimiteds.filter(
          (addon) => addon.status === "active"
        );
        if (activeAddons.length) {
          const description = activeAddons
            .map((addon) => addon.description)
            .join(", ");
          return `<i class="material-icons addon" title="${description}">info</i> ${data}`;
        }
        return data;
      },
    },
    {
      ...defaultCol(1, "status", "Status"),
      render: (data, _, row) => {
        if (data === "canceled") {
          return `
            <div>
              <span class="${
                data === "canceled"
                  ? "text-danger"
                  : data === "active"
                  ? "text-success"
                  : "text-warning"
              }">${this.titleCasePipe.transform(data)}</span>
              <br />
              <span>(${this.datePipe.transform(
                row.modified,
                "MM/dd/yyyy"
              )})</span>
            </div>
          `;
        }
        return `
          <span class="${
            data === "canceled"
              ? "text-danger"
              : data === "active"
              ? "text-success"
              : "text-warning"
          }">${this.titleCasePipe.transform(data)}</span>
        `;
      },
    },
    defaultCol(2, "facility.name", "City"),
    {
      ...defaultCol(3, "aviCredentialTag", "Tag"),
      className: "img-barcode",
      event: {
        type: "click",
        callback: this.openBarcode.bind(this),
      },
      render: (_, __, row) => {
        const src = row.barcodeUrls[0];
        return row.aviCredentialTag
          ? `${row.aviCredentialTag}`
          : src
          ? `
            <img src=${src} data-value=${row.id} width="58" alt="Barcode" role="button" title="Click to see large barcode" />
          `
          : "";
      },
    },
    {
      ...defaultCol(4, "monthlyPrice", "Monthly Price"),
      render: (data) => {
        return this.currencyPipe.transform(data, "USD");
      },
    },
    {
      ...defaultCol(5, "created", "Date Registered"),
      render: (data) => {
        return `<span class='d-none'>${this.datePipe.transform(
          data,
          "yyyy/MM/dd hh:mm"
        )}</span>${this.datePipe.transform(data, "MM/dd/yyyy hh:mm a")}`;
      },
    },
  ];
  actions: IDatatableAction[] = [
    {
      name: "addOnUnlimiteds",
      label: "U",
      className: "btn-warning btn-success",
      getClassName: (addOnUnlimiteds) => {
        return addOnUnlimiteds.length > 0 ? "btn-success" : "btn-warning";
      },
      title: "Unlimited Addon",
      callback: this.openAddonModal.bind(this),
      enabled: [
        {
          key: "showAddOnUnlimitedButton",
          value: [true],
        },
      ],
    },
    {
      name: "replaceTag",
      icon: "sell",
      className: "btn-info",
      title: "Replace Tag",
      callback: this.openPermitReplaceTagModal.bind(this),
      enabled: [
        {
          key: "status",
          value: ["active"],
        },
      ],
    },
    {
      name: "cancel",
      icon: "cancel",
      className: "btn-danger",
      title: "Cancel",
      callback: this.openCancelPermitsModal.bind(this),
      enabled: [
        {
          key: "status",
          value: ["active", "pending"],
        },
      ],
    },
  ];
  toolbar = `
    <input id="showCanceledCityPass" type="checkbox" class="mr-2 align-middle" style="width: 20px; height: 20px" /><span class="font-weight-bold">Show Canceled</span>
  `;

  private permits: IPermit[] = [];
  showCanceld = false;
  filteredPermits: IPermit[] = [];

  barcodes: IImage[] = [];
  showBarcodes: boolean = false;

  cancelPermitModalId: string = "cancelCityPassModal";
  selectedPermit: IPermit | null;

  permitReplaceTagModalId: string = "permitReplaceTagModal";

  private facilities: IFacility[] = [];
  addonFacilities: IFacility[] = [];
  addonFacilityIds: Record<string, string | boolean>[] = [];

  unlimitedAddon: IPermitAddon[] = [];
  unlimitedAddonForm: FormGroup | undefined;
  carParkId: string | "";

  constructor(
    private titleCasePipe: TitleCasePipe,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private hostManagementService: HostManagementService,
    private facilityService: FacilityService,
    private swalService: SwalService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit(): void {
    $("#unlimitedAddonModal").on("hidden.bs.modal", () => {
      this.selectedPermit = undefined;
      this.addonFacilities = [];
      this.addonFacilityIds = [];
    });
    $("#editUnlimitedAddonModal").on("hidden.bs.modal", () => {
      const discounts = this.unlimitedAddonForm.get("discounts") as FormArray;
      const fees = this.unlimitedAddonForm.get("fees") as FormArray;
      discounts.clear();
      fees.clear();
      this.carParkId = "";
    });
    this.initForms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getSubscriptions();
    this.getFacilities();
    if (changes["changedRow"]?.currentValue) {
      this.onChange(changes["changedRow"].currentValue);
    }
  }

  ngAfterViewInit(): void {
    const self = this;
    $("input[type='checkbox']").click(function () {
      if ($(this).attr("id") === "showCanceledCityPass") {
        self.showCanceld = this.checked;
        self.onFilter();
      }
    });
  }

  private getSubscriptions(): void {
    if (this.companyId) {
      this.hostManagementService
        .getPermitSubscriptionsByCompanyId<IPermit[]>(this.companyId)
        .subscribe({
          next: (res: IPermit[]) => {
            this.permits = res.map((item: IPermit) => ({
              ...item,
              barcodeUrls: item.barcodes.map(
                (b: IBarcode) =>
                  `${environment.api}image/barcode?data=${b.barcode}&size=2&facilityName=${item.facility.name}&vehicleName=${item.vehicle.name}`
              ),
            }));
            this.onFilter();
          },
          error: () => {
            this.permits = [];
            this.filteredPermits = [];
          },
        });
    }
  }

  private onFilter(): void {
    this.filteredPermits = this.permits.filter((f) => {
      if (this.showCanceld) {
        return true;
      } else {
        return f.status !== "canceled";
      }
    });
  }

  private getFacilities(): void {
    if (this.companyId) {
      this.facilityService
        .getFacilitiesByCompanyId<IFacility[]>(this.companyId)
        .subscribe({
          next: (res) => {
            this.facilities = res;
          },
          error: () => {
            this.facilities = [];
          },
        });
    }
  }

  private initForms(): void {
    this.unlimitedAddonForm = new FormGroup({
      discounts: new FormArray([]),
      fees: new FormArray([]),
    });
  }

  populateUnlimitedAddonForm(unlimitedAddon: IPermitAddon): void {
    this.unlimitedAddonForm.patchValue({
      discounts: unlimitedAddon?.discounts?.items ?? [],
      fees: unlimitedAddon?.fees?.items ?? [],
    });

    const discounts = this.unlimitedAddonForm.get("discounts") as FormArray;
    discounts.clear();
    const fees = this.unlimitedAddonForm.get("fees") as FormArray;
    fees.clear();

    (unlimitedAddon?.discounts?.items ?? []).forEach((item) => {
      discounts.push(
        new FormGroup({
          name: new FormControl(item.name, [Validators.required]),
          adjustmentAmount: new FormControl(item.adjustmentAmount, [
            Validators.required,
            Validators.min(0),
            Validators.max(100),
          ]),
          isPercent: new FormControl(item.isPercent),
        })
      );
    });

    (unlimitedAddon?.fees?.items ?? []).forEach((item) => {
      fees.push(
        new FormGroup({
          name: new FormControl(item.name, [Validators.required]),
          adjustmentAmount: new FormControl(item.adjustmentAmount, [
            Validators.required,
            Validators.min(0),
            Validators.max(100),
          ]),
          isPercent: new FormControl(item.isPercent),
        })
      );
    });
  }

  get hasValidAddons(): boolean {
    return this.unlimitedAddon?.some((addon) => addon.rate > 0);
  }

  get discounts(): FormArray {
    return this.unlimitedAddonForm.get("discounts") as FormArray;
  }

  get fees(): FormArray {
    return this.unlimitedAddonForm.get("fees") as FormArray;
  }

  openBarcode(permit: IPermit): void {
    this.barcodes = permit.barcodeUrls.map((url: string) => {
      return {
        image: url.replace("size=2", "size=12"),
        title: `${permit.vehicle.name} @ ${permit.facility.name}`,
      };
    });
    this.showBarcodes = true;
  }

  openCancelPermitsModal(permitId: string): void {
    this.selectedPermit = this.permits.find((permit) => permit.id === permitId);

    $(`#${this.cancelPermitModalId}`).modal("show");
  }

  onChange(permit: IPermit): void {
    let index = this.permits.findIndex((f: IPermit) => f.id === permit.id);
    this.permits[index] = permit;

    index = this.filteredPermits.findIndex((f: IPermit) => f.id === permit.id);
    this.filteredPermits[index] = {
      ...permit,
      barcodeUrls: permit.barcodes.map(
        (b: IBarcode) =>
          `${environment.api}image/barcode?data=${b.barcode}&size=2&facilityName=${permit.facility.name}&vehicleName=${permit.vehicle.name}`
      ),
    };
    this.filteredPermits = this.filteredPermits.slice(0);
  }

  openPermitReplaceTagModal(permitId: string): void {
    this.selectedPermit = this.permits.find((permit) => permit.id === permitId);

    $(`#${this.permitReplaceTagModalId}`).modal("show");
  }

  openAddonModal(permitId: string): void {
    const facilityNames = [],
      carParkIds = [],
      carParkNames = [],
      rates = [];
    this.unlimitedAddon = [];
    this.addonFacilities = [];
    this.selectedPermit = this.permits.find((permit) => permit.id === permitId);

    this.unlimitedAddon = this.selectedPermit?.addOnUnlimiteds.filter(
      (addon) => addon.facilityId === this.selectedPermit.parkingFacilityId
    );

    this.addonFacilities = this.facilities.filter(
      (f) =>
        f.id === this.selectedPermit.parkingFacilityId && f.allowAddOnUnlimited
    );

    this.addonFacilities.map((facility) => {
      if (facility.carParks.length > 0) {
        facility.carParks.map((carPark) => {
          facilityNames.push(facility.name);
          carParkIds.push(carPark?.id);
          carParkNames.push(carPark?.name);
          rates.push(carPark?.addOnUnlimitedRates.currentRate?.amount);
        });
      }
    });

    if (carParkIds.length > 0) {
      this.unlimitedAddon.map((addon) => {
        const index = carParkIds.indexOf(addon.carParkId);
        if (index !== -1) {
          this.unlimitedAddon[index] = {
            ...addon,
            facilityName: facilityNames[index],
            carParkName: carParkNames[index],
            rate: rates[index],
          };
        }
      });
    }

    this.addonFacilityIds = [];

    $("#unlimitedAddonModal").modal("show");
  }

  isAddon(addon: IPermitAddon): boolean {
    return addon.status === "active";
  }

  isCheckboxDisabled(currentAddon: IPermitAddon): boolean {
    return this.unlimitedAddon.some(
      (addon) => addon !== currentAddon && this.isAddon(addon)
    );
  }

  onChangeAddon(checked: boolean, addon: IPermitAddon): void {
    const { facilityId, carParkId } = addon;
    this.carParkId = carParkId;

    if (checked) {
      addon.status = "active";
    } else {
      addon.status = "canceled";
    }

    const index = this.addonFacilityIds.findIndex(
      (addon) =>
        addon["facilityId"] === facilityId && addon["carParkId"] === carParkId
    );
    if (index > -1) {
      this.addonFacilityIds[index].checked = checked;
    } else {
      this.addonFacilityIds.push({ checked, facilityId, carParkId });
    }
  }

  saveAddon(): void {
    const reqs$ = [];
    const payload = [];
    const canceledFacilities = [];
    const addedFacilities = [];
    this.addonFacilityIds.forEach((addon) => {
      const index = this.selectedPermit.addOnUnlimiteds.findIndex(
        (item) =>
          item.facilityId === addon.facilityId && item.status === "active"
      );
      const facilityName = this.addonFacilities.find(
        (f) => f.id === addon.facilityId
      )?.name;
      if (index > -1 && !addon.checked) {
        const req$ = this.hostManagementService
          .cancelAddonUnlimited<IPermitAddon>({
            addOnUnlimitedId: this.selectedPermit.addOnUnlimiteds[index].id,
          })
          .pipe(
            tap((res) => {
              const index = this.selectedPermit.addOnUnlimiteds.findIndex(
                (item) => item.facilityId === res.facilityId
              );
              this.selectedPermit.addOnUnlimiteds[index] = res;
            })
          );
        reqs$.push(req$);
        canceledFacilities.push(facilityName);
      }

      if (index === -1 && addon.checked) {
        payload.push({
          vehicleId: this.selectedPermit.vehicleId,
          facilityId: addon.facilityId,
          carParkId: this.carParkId,
        });
        addedFacilities.push(facilityName);
      }
    });

    const cancelMsg =
      canceledFacilities.length > 0
        ? `We are canceling the Unlimited pass at ${canceledFacilities.join(
            ", "
          )} and it will not be renewed at the end of the month`
        : "";

    const addMsg =
      addedFacilities.length > 0
        ? `We are adding the Unlimited pass at ${addedFacilities.join(
            ", "
          )} you will be billed prorated amount for this month and full amount starting the lst of next month`
        : "";

    this.swalService.fire(
      `${cancelMsg ? cancelMsg + "<br/>" : ""}${addMsg}`,
      "Warning",
      "warning",
      "Save",
      "Cancel",
      true,
      () => {
        if (payload.length > 0) {
          const req$ = this.vehicleService
            .createAddonUnlimited<IPermitAddon[]>(payload)
            .pipe(
              tap((res) => {
                this.selectedPermit.addOnUnlimiteds =
                  this.selectedPermit.addOnUnlimiteds.map((item) => {
                    const matchingItem = res.find(
                      (r) => r.id === item.id && r.carParkId === item.carParkId
                    );

                    return matchingItem
                      ? { ...item, status: matchingItem.status }
                      : { ...item, ...matchingItem };
                  });
              })
            );
          reqs$.push(req$);
        }
        forkJoin(reqs$).subscribe(() => {
          this.onChange(this.selectedPermit);
          $("#unlimitedAddonModal").modal("hide");
        });
      }
    );
  }

  hasChangedAddon(): boolean {
    let result = false;

    this.addonFacilityIds.forEach((addon) => {
      const index = this.selectedPermit.addOnUnlimiteds.findIndex(
        (item) =>
          item.facilityId === addon.facilityId && item.status === "active"
      );
      if ((index > -1 && !addon.checked) || (index === -1 && addon.checked)) {
        result = true;
      }
    });

    return result;
  }

  editUnlimitedAddon(addon: { carParkId: string }): void {
    const { carParkId } = addon;
    this.carParkId = carParkId;
    const selectedUnlimitedAddon = this.unlimitedAddon.find(
      (addon) => addon.carParkId === this.carParkId
    );
    this.populateUnlimitedAddonForm(selectedUnlimitedAddon);
    $("#editUnlimitedAddonModal").modal("show");
  }

  addDiscount(): void {
    this.discounts.push(this.createDiscountOrFee());
  }

  addFee(): void {
    this.fees.push(this.createDiscountOrFee());
  }

  createDiscountOrFee(): FormGroup {
    return new FormGroup({
      name: new FormControl("", []),
      adjustmentAmount: new FormControl("", [
        Validators.min(0),
        Validators.max(100),
      ]),
      isPercent: new FormControl(false),
    });
  }

  onFieldFocus(control: AbstractControl): void {
    const currentValidators: ValidatorFn[] = control.validator
      ? [control.validator]
      : [];
    control.setValidators(
      Validators.compose([Validators.required, ...currentValidators])
    );
    control.updateValueAndValidity();
  }

  onFieldBlur(control: AbstractControl): void {
    control.markAsTouched();
    control.updateValueAndValidity();
  }

  deleteDiscount(index: number): void {
    const discount = this.discounts.at(index);
    discount.get("name")?.clearValidators();
    discount.get("adjustmentAmount")?.clearValidators();
    discount.updateValueAndValidity();
    this.discounts.removeAt(index);
  }

  deleteFee(index: number): void {
    const fee = this.fees.at(index);
    fee.get("name")?.clearValidators();
    fee.get("adjustmentAmount")?.clearValidators();
    fee.updateValueAndValidity();
    this.fees.removeAt(index);
  }

  hasChanged(): boolean {
    const discounts = this.unlimitedAddonForm.get("discounts") as FormArray;
    const fees = this.unlimitedAddonForm.get("fees") as FormArray;
    const selectedUnlimitedAddon = this.unlimitedAddon.find(
      (addon) => addon.carParkId === this.carParkId
    );

    let discountChanged = false;
    let feeChanged = false;

    if (discounts.length !== selectedUnlimitedAddon?.discounts?.items?.length) {
      discountChanged = true;
    } else {
      discounts.controls.forEach((control, index) => {
        const originalDiscount =
          selectedUnlimitedAddon?.discounts?.items[index];
        if (
          !originalDiscount ||
          control.value.name !== originalDiscount.name ||
          control.value.adjustmentAmount !==
            originalDiscount.adjustmentAmount ||
          control.value.isPercent !== originalDiscount.isPercent
        ) {
          discountChanged = true;
        }
      });
    }

    if (fees.length !== selectedUnlimitedAddon?.fees?.items?.length) {
      feeChanged = true;
    } else {
      fees.controls.forEach((control, index) => {
        const originalFee = selectedUnlimitedAddon?.fees?.items[index];
        if (
          !originalFee ||
          control.value.name !== originalFee.name ||
          control.value.adjustmentAmount !== originalFee.adjustmentAmount ||
          control.value.isPercent !== originalFee.isPercent
        ) {
          feeChanged = true;
        }
      });
    }

    return discountChanged || feeChanged;
  }

  saveDiscountAndFee(): void {
    let payload = {};
    const selectedUnlimitedAddon = this.unlimitedAddon.find(
      (addon) => addon.carParkId === this.carParkId
    );
    if (selectedUnlimitedAddon) {
      const { created, description, modified, isDeleted, ...rest } =
        selectedUnlimitedAddon;
      const discounts = this.unlimitedAddonForm.get("discounts") as FormArray;
      const fees = this.unlimitedAddonForm.get("fees") as FormArray;

      payload = {
        ...rest,
        discounts: { items: discounts.value },
        fees: { items: fees.value },
      };
    } else {
      const discounts = this.unlimitedAddonForm.get("discounts") as FormArray;
      const fees = this.unlimitedAddonForm.get("fees") as FormArray;

      payload = {
        facilityId: this.selectedPermit?.parkingFacilityId,
        carParkId: this.carParkId,
        companyId: this.selectedPermit?.companyId,
        parkingPassSubscriptionId: this.selectedPermit?.id,
        discounts: { items: discounts.value },
        fees: { items: fees.value },
        status: "active",
      };
    }

    this.vehicleService.addonUnlimitedUpdate<IPermitAddon>(payload).subscribe({
      next: (res) => {
        const index = this.selectedPermit?.addOnUnlimiteds.findIndex(
          (addon) => addon.facilityId === res.facilityId
        );
        if (index !== -1) {
          this.selectedPermit.addOnUnlimiteds[index] = res;
        }
      },
    });
  }
}
