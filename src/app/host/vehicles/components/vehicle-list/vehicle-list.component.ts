import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { formatDate } from "@angular/common";
import { forkJoin } from "rxjs";

import { IColumnDef } from "src/app/components/datatable/datatable.component";
import { defaultCol } from "src/app/components/datatable/datatable.helper";
import { FacilityService } from "src/app/facility/services/facility.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { IFacility } from "../../models/facility.model";
import { IVehicle, IAddon } from "../../models/vehicle.model";
import { VehicleService } from "../../services/vehicle.service";
import { IHost } from "src/app/host/models/host.model";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { TagOrderingComponent } from "src/app/host/tag-ordering/components/tag-ordering/tag-ordering.component";
import { ReservedSpaceListComponent } from "src/app/host/reserved-spaces/components/reserved-space-list/reserved-space-list.component";
import { VehicleRegisterComponent } from "../vehicle-register/vehicle-register.component";
// Remove incorrect bootstrap import

declare const $: any;

@Component({
  selector: "app-vehicle-list",
  templateUrl: "./vehicle-list.component.html",
  styleUrls: ["./vehicle-list.component.scss"],

})
export class VehicleListComponent implements OnInit, AfterViewInit {
  host: IHost | undefined;
  private activeEditingContainer?: HTMLElement;


  statusFilter: string = '';
  facilityFilter: string = '';

  allStatuses: string[] = [];
  allFacilities: string[] = [];

  vehicles: IVehicle[] = [];
  filteredVehicles: IVehicle[] = [];

  readonly tableId = "hostVehiclesDatatable";
  columnDefs: IColumnDef[] = [
    {
      ...defaultCol(0, "id", ""),
      orderable: false,
      className: "vehicle-id",
      event: {
        type: "change",
        callback: this._onBulkSelected.bind(this),
      },
      render: (data: string) => {
        return `<input type="checkbox" data-value="${data}">`;
      },
    },
    {
      ...defaultCol(1, "name", "Name"),
      className: "vehicle-name",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: string, _: unknown, row: IVehicle) => {
        return `<span data-value="${row.id}">${data}</span>`;
      },
    },
    {
      ...defaultCol(2, "status", "Status"),
      className: "vehicle-status",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: string, _: unknown, row: IVehicle) => {
        return data === "Active"
          ? `<span class="text-success" data-value="${row.id}">${data}</span>`
          : `<span class="text-danger" data-value="${row.id}">${data}</span>`;
      },
    },
    {
      ...defaultCol(3, "subscriptionTag", "Tag"),
      className: "vehicle-subscriptionTag",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: string, _: unknown, row: IVehicle) => {
        return !!data
          ? `<span class="text-success" data-value="${row.id}">${data}</span>`
          : `<span class="text-danger" data-value="${row.id}">Unassigned</span>`;
      },
    },
    {
      ...defaultCol(4, "subscriptionFacilityName", "Facility"),
      className: "vehicle-subscriptionFacilityName",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: string, _: unknown, row: IVehicle) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(5, "addOnUnlimiteds", "Unlimited"),
      className: "vehicle-addOnUnlimiteds",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: IAddon[], _: unknown, row: IVehicle) => {
        if (data.length === 0) {
          return `<span data-value="${row.id}"></span>`;
        }

        let column = "";
        data.forEach(({ status, cancelDate, carParkName }, index) => {
          const name =
            status === "canceled"
              ? `${carParkName}<br/><small class="text-danger">(Until ${formatDate(
                cancelDate,
                "MM/dd/yyyy",
                "en-us"
              )})</small>`
              : carParkName;
          column += !index
            ? `<div data-value="${row.id}">${name}</div>`
            : `<div>${name}</div>`;
        });
        return column;
      },
    },
    {
      ...defaultCol(6, "model", "Model"),
      className: "vehicle-model",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: string, _: unknown, row: IVehicle) => {
        return `<span data-value="${row.id}">${data}</span>`;
      },
    },
    {
      ...defaultCol(7, "licensePlate", "License Plate"),
      className: "vehicle-license-plate",
      event: {
        type: "dblclick",
        callback: this._openActionsModal.bind(this),
      },
      render: (data: string, _: unknown, row: IVehicle) => {
        return `<div data-value="${row.id}" class="d-flex align-items-center justify-content-start license-plate-container">
                  <button class="btn btn-success btn-link btn-round btn-fab btn-sm edit-license-plate-btn" title="Edit">
                    <i class="material-icons">edit</i>
                  </button>
                  <span class="license-plate-text">${data}</span>
                  <input
                    type="text"
                    class="license-plate-input form-control d-none"
                    value="${data}"
                    data-id="${row.id}"
                  />
                  <div class="license-plate-actions d-flex">
                    <button class="btn btn-success btn-link btn-round btn-fab btn-sm save-license-plate-btn d-none" title="Save">
                      <i class="material-icons">check</i>
                    </button>
                    <button class="btn btn-danger btn-link btn-round btn-fab btn-sm cancel-license-plate-btn d-none" title="Cancel">
                      <i class="material-icons">close</i>
                    </button>
                  </div>
                </div>`;
      },
    },
    {
      ...defaultCol(8, "actions", "Actions"),
      orderable: false,
      className: "vehicle-actions",
      event: {
        type: "click",
        callback: this._openActionsModal.bind(this),
      },
      render: (_: string[], __, row: IVehicle) => {
        return `
          <button mat-raised-button class="btn btn-info btn-link" data-value="${row.id}">
            <i class="material-icons">more_horiz</i>
          </button>`;
      },
    },
  ];
  // vehicles: IVehicle[] = [];

  selectedVehicle: IVehicle | undefined;

  cancelPermitModalId = "cancelVehiclePermitModal";

  changeMarketModalId = "changeMarketModal";
  facilityForm!: FormGroup;
  facilities: IFacility[] = [];

  replaceTagModalId = "replaceVehicleTagModal";

  addUnlimitedPassModalId = "addUnlimitedPassModal";
  unlimitedPassForm!: FormGroup;
  unlimitedPassFacilities: IFacility[] = [];

  actionsModalId = "vehicleActionsModal";

  bulkVehicles: IVehicle[] = [];
  
  hasActiveVehicleSubscription: boolean = false;
  // dialogRef: any;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private vehicleService: VehicleService,
    private swalService: SwalService,
    private notificationService: NotificationService,
    private facilityService: FacilityService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this._initForms();
    this._getFacilities();
    this._initCustomFilters();
  }
  private _initCustomFilters(): void {
    this.customFilters = [
      {
        label: 'Status',
        value: '',
        options: [],
        onChange: (value: string) => {
          this.statusFilter = value;
          this.applyFilters();
        }
      },
      {
        label: 'Facility',
        value: '',
        options: [],
        onChange: (value: string) => {
          this.facilityFilter = value;
          this.applyFilters();
        }
      }
    ];
  }

  ngAfterViewInit(): void {
    const self = this;
    $(`#${this.tableId}`).on(
      "click",
      "td.td-actions .dropdown-menu a",
      function (e: Event) {
        e.preventDefault();

        const action = $(this).text();
        self.selectedVehicle = self.vehicles.find(
          (v) => v.id === $(this).data("value")
        );

        self.onClickAction(action);
      }
    );

    $(document).on("click", ".edit-license-plate-btn", (event: Event) => {
      event.preventDefault();
      this._toggleLicensePlateEditing(event, true);
    });

    $(document).on("click", ".save-license-plate-btn", (event: Event) => {
      event.preventDefault();
      this._saveLicensePlate(event);
    });

    $(document).on("click", ".cancel-license-plate-btn", (event: Event) => {
      event.preventDefault();
      this._toggleLicensePlateEditing(event, false);
    });
  }

  closeModal(): void {
    // Use Bootstrap Modal from global window object
    const modal = (window as any).bootstrap?.Modal.getInstance(document.getElementById(this.actionsModalId));
    if (modal) {
      console.log("Closing modal:", this.actionsModalId);
      modal.hide();
    }
  }
  addVehicle(): void {
    // this.router.navigate(["/host/vehicle/add"]);
    const dialogRef = this.dialog.open(VehicleRegisterComponent, {
      width: '90vw',       // almost full viewport width
      maxHeight: '80vh',   // max height 80% of viewport height, allows scroll
      disableClose: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'transparent-backdrop',
      data: {
        exampleKey: 'exampleValue',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.refreshList) {
        // Do something like reload data if needed
      }
    });
  }



  buyTags(): void {
    //   this.router.navigate(["/host/tag-ordering"]);

    const dialogRef = this.dialog.open(TagOrderingComponent, {
      width: '90vw',       // almost full viewport width
      maxHeight: '80vh',   // max height 80% of viewport height, allows scroll
      disableClose: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'transparent-backdrop',
      data: {
        exampleKey: 'exampleValue',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.refreshList) {
        // Do something like reload data if needed
      }
    });
  }

  reservSpace(): void {
    // this.router.navigate(["/host/reserved-space/list"]);
    const dialogRef = this.dialog.open(ReservedSpaceListComponent, {
      width: '90vw',       // almost full viewport width
      maxHeight: '80vh',   // max height 80% of viewport height, allows scroll
      disableClose: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'transparent-backdrop',
      data: {
        exampleKey: 'exampleValue',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.refreshList) {
        // Do something like reload data if needed
      }
    });
  }

  onBulkActivate(e: Event): void {
    e.preventDefault();

    if (this.bulkVehicles.length === 0) {
      this.notificationService.notify(
        "notification",
        "info",
        "Please select vehicles"
      );

      return;
    } else if (this.bulkVehicles.some((v) => v.status === "Active")) {
      this.notificationService.notify(
        "notification",
        "warning",
        "Can only bulk activate inactive vehicles."
      );

      return;
    } else {
      this.router.navigate(["/host/vehicle/activate/bulk"], {
        queryParams: { ids: this.bulkVehicles.map(({ id }) => id).join(",") },
      });
    }
  }

  /**
   * Callback cancel permit
   */
  onCancelPermit(): void {
    this._getCompanyVehicles();

    $(`#${this.cancelPermitModalId}`).modal("hide");
  }

  /**
   * Submit facility change request
   */
  onSaveFacility(): void {
    this.vehicleService
      .saveFacilityBySubscriptionId(this.facilityForm.value)
      .subscribe({
        next: () => {
          this._getCompanyVehicles();
          $(`#${this.changeMarketModalId}`).modal("hide");
        },
      });
  }

  /**
   * Event submit tag change request
   */
  onChangeTag(): void {
    this._getCompanyVehicles();
    $(`#${this.replaceTagModalId}`).modal("hide");
  }

  /**
   * Save unlimited pass
   */
  onSaveUnlimitedPass(): void {
    const [facilityId, carParkId] = this.unlimitedPassForm
      .get("facilityId")
      .value.split(" - ");
    this.unlimitedPassForm.get("facilityId").setValue(facilityId);
    this.unlimitedPassForm.get("carParkId").setValue(carParkId);

    const facility = this.unlimitedPassFacilities.find(
      (f) => f.id === this.unlimitedPassForm.value.facilityId
    );
    const msg = `We are adding the Unlimited pass at ${facility.name} you will be billed prorated amount for this month and full amount starting the lst of next month`;
    this.swalService.fire(
      msg,
      "Warning",
      "warning",
      "Save",
      "Cancel",
      true,
      () => {
        this.vehicleService
          .createAddonUnlimited<IAddon[]>([this.unlimitedPassForm.value])
          .subscribe({
            next: () => {
              this._getCompanyVehicles();

              $(`#${this.addUnlimitedPassModalId}`).modal("hide");
            },
          });
      }
    );
  }

  onClickAction(action: string): void {
    switch (action) {
      case "Edit/View Vehicle":
        this._editVehicle();
        break;
      case "Activity":
        this._viewActivity();
        break;
      case "Activate Vehicle":
        this._activateVehicle();
        break;
      case "Deactivate Vehicle":
        $(`#${this.cancelPermitModalId}`).modal("show");
        break;
      case "Delete Vehicle":
        this._deleteVehicle();
        break;
      case "Change Market":
        this._openMarketModal();
        break;
      case "Assign Tag":
      case "Replace Tag":
        $(`#${this.replaceTagModalId}`).modal("show");
        break;
      case "Add Unlimited Pass":
        this._openAddUnlimitedPassModal();
        break;
      case "Cancel Unlimited Pass":
        this._cancelUnlimitedPass();
        break;
      default:
        break;
    }

    $(`#${this.actionsModalId}`).modal("hide");
  }

  private _initForms(): void {
    this.facilityForm = new FormGroup({
      subscriptionId: new FormControl(""),
      facilityId: new FormControl("", [Validators.required]),
    });

    $(`#${this.changeMarketModalId}`).on("hidden.bs.modal", () => {
      this.facilityForm.reset();
    });

    this.unlimitedPassForm = new FormGroup({
      vehicleId: new FormControl(""),
      facilityId: new FormControl("", [Validators.required]),
      carParkId: new FormControl(""),
    });

    $(`#${this.addUnlimitedPassModalId}`).on("hidden.bs.modal", () => {
      this.unlimitedPassForm.reset();
    });
  }
  private _getCompanyVehicles(): void {
  if (this.host) {
    this.vehicleService
      .getVehiclesByHostId<IVehicle[]>(this.host.id)
      .subscribe({
        next: (res: IVehicle[]) => {
          this.vehicles = res.map((item) => {
            let carParkName = "";
            if (item.addOnUnlimiteds?.length) {
              item.addOnUnlimiteds.forEach((addOn, index) => {
                this.facilities.forEach(facility => {
                  facility.carParks.forEach(carPark => {
                    if (carPark.id === addOn.carParkId) {
                      carParkName = carPark.name;
                    }
                  });
                });
                addOn.carParkName = carParkName;
              });
            }

            return {
              ...item,
              canRemove: item.activePassCount === 0,
            };
          });

          this.hasActiveVehicleSubscription = res.some(
            (item) => item.status === "Active"
          );

          // Get unique values
          this.allStatuses = [...new Set(this.vehicles.map(v => v.status).filter(Boolean))];
          this.allFacilities = [...new Set(this.vehicles.map(v => v.subscriptionFacilityName).filter(Boolean))];

          // ✅ Update dropdown options without resetting them
          if (this.customFilters.length) {
            this.customFilters[0].options = this.allStatuses;
            this.customFilters[1].options = this.allFacilities;
          }

          this.applyFilters(); // ✅ Only refresh table rows
        },
        error: () => (this.vehicles = []),
      });
  }
}


  applyFilters(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      return (!this.statusFilter || vehicle.status === this.statusFilter)
        && (!this.facilityFilter || vehicle.subscriptionFacilityName === this.facilityFilter);
    });
  }
  
  customFilters: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
  }[] = [];

  private _updateCustomFilters(): void {
    this.customFilters = [
      {
        label: 'Status',
        value: this.statusFilter,
        options: this.allStatuses,
        onChange: (value: string) => {
          this.statusFilter = value;
          this.applyFilters();
        }
      },
      {
        label: 'Facility',
        value: this.facilityFilter,
        options: this.allFacilities,
        onChange: (value: string) => {
          this.facilityFilter = value;
          this.applyFilters();
        }
      }
    ];
  }

  private _getFacilities(): void {
    this.facilityService.getActiveFacilities().subscribe({
      next: (res: IFacility[]) => {
        this.facilities = res;
        console.log("Facilities: ", this.facilities);
        this.sessionService.getHost$().subscribe((host) => {
          this.host = host;
          if (!this.host?.allowAddOnUnlimited) {
            this.columnDefs = this.columnDefs
              .filter((def) => def.data !== "addOnUnlimiteds")
              .map((def, index) => ({ ...def, targets: index }));
          }
          this._getCompanyVehicles();
        });
      },
      error: () => {
        this.facilities = [];
      },
    });
  }

  private _editVehicle(): void {
    this.router.navigate([`/host/vehicle/${this.selectedVehicle.id}/edit`]);
  }

  private _viewActivity(): void {
    this.router.navigate([`/host/vehicle/${this.selectedVehicle.id}/activity`]);
  }

  private _activateVehicle(): void {
    this.router.navigate([`/host/vehicle/${this.selectedVehicle.id}/activate`]);
  }

  private _deleteVehicle(): void {
    const index = this.vehicles.findIndex(
      (v) => v.id === this.selectedVehicle.id
    );

    this.swalService.fire(
      `Sure you want to delete this vehicle - ${this.vehicles[index].name}`,
      "Warning",
      "warning",
      "Yes, delete it",
      "No",
      true,
      () => {
        this.vehicleService.deleteVehicle(this.selectedVehicle.id).subscribe({
          next: () => {
            this.notificationService.notify(
              "notification",
              "danger",
              "Vehicle is deleted"
            );
            this.vehicles.splice(index, 1);
            this.vehicles = [...this.vehicles];
          },
        });
      }
    );
  }

  private _openMarketModal(): void {
    const { subscriptionId, parkingFacilityId } = this.selectedVehicle;
    this.facilityForm.patchValue({
      subscriptionId,
      facilityId: parkingFacilityId,
    });

    $(`#${this.changeMarketModalId}`).modal("show");
  }

  private _openAddUnlimitedPassModal(): void {
    const facility = this.facilities.find(
      (f) => f.id === this.selectedVehicle.subscriptionFacilityId
    );
    this.unlimitedPassFacilities = facility?.allowAddOnUnlimited
      ? [facility]
      : [];

    this.unlimitedPassForm.get("vehicleId").setValue(this.selectedVehicle.id);

    if (this.unlimitedPassForm.get("carParkId").value) {
      this.unlimitedPassForm
        .get("carParkId")
        .setValue(this.selectedVehicle.addOnUnlimiteds[0].carParkId);
    }

    $(`#${this.addUnlimitedPassModalId}`).modal("show");
  }

  private _cancelUnlimitedPass(): void {
    const facility = this.facilities.find(
      (f) => f.id === this.selectedVehicle.subscriptionFacilityId
    );

    const msg = facility?.unlimitedOnlyFacility
      ? `We are canceling your unlimited pass and vehicle subscription at ${facility.name} now.`
      : `We are canceling the Unlimited pass at ${facility.name} and it will not be renewed at the end of the month`;

    const reqs = facility?.unlimitedOnlyFacility
      ? [
        this.vehicleService.cancelAddonUnlimited<IAddon>({
          addOnUnlimitedId: this.selectedVehicle.addOnUnlimiteds[0].id,
        }),
        this.vehicleService.cancelParkingPass<IAddon>(
          this.selectedVehicle.subscriptionId
        ),
      ]
      : this.vehicleService.cancelAddonUnlimited<IAddon>({
        addOnUnlimitedId: this.selectedVehicle.addOnUnlimiteds[0].id,
      });

    this.swalService.fire(msg, "Warning", "warning", "Yes", "No", true, () => {
      forkJoin(reqs).subscribe({
        next: () => {
          this._getCompanyVehicles();
        },
      });
    });
  }

  private _openActionsModal(vehicle: IVehicle): void {
    if (document.querySelector(".license-plate-input:not(.d-none)")) {
      return;
    }

    this.selectedVehicle = vehicle;
    this.selectedVehicle.actions = this.selectedVehicle.actions.filter(action => action !== 'Change Facility');

    $(`#${this.actionsModalId}`).modal("show");
  }

  private _onBulkSelected(vehicle: IVehicle): void {
    const index = this.bulkVehicles.findIndex((v) => v.id === vehicle.id);
    if (index > -1) {
      this.bulkVehicles.splice(index, 1);
    } else {
      this.bulkVehicles.push(vehicle);
    }
  }

  private _toggleLicensePlateEditing(event: Event, enable: boolean): void {
    const target = event.target as HTMLElement;
    const container = target.closest(".license-plate-container") as HTMLElement;
    if (!container) return;

    if (
      enable &&
      this.activeEditingContainer &&
      this.activeEditingContainer !== container
    ) {
      const cancelButton = this.activeEditingContainer.querySelector(
        ".cancel-license-plate-btn"
      ) as HTMLElement;
      cancelButton.click();
    }

    this.activeEditingContainer = enable ? container : undefined;

    const textElement = container.querySelector(
      ".license-plate-text"
    ) as HTMLElement;
    const inputElement = container.querySelector(
      ".license-plate-input"
    ) as HTMLInputElement;
    const editButton = container.querySelector(
      ".edit-license-plate-btn"
    ) as HTMLElement;
    const saveButton = container.querySelector(
      ".save-license-plate-btn"
    ) as HTMLElement;
    const cancelButton = container.querySelector(
      ".cancel-license-plate-btn"
    ) as HTMLElement;

    if (enable) {
      textElement.classList.add("d-none");
      inputElement.classList.remove("d-none");
      editButton.classList.add("d-none");
      saveButton.classList.remove("d-none");
      cancelButton.classList.remove("d-none");
      inputElement.focus();
    } else {
      inputElement.value = textElement.textContent || "";
      textElement.classList.remove("d-none");
      inputElement.classList.add("d-none");
      editButton.classList.remove("d-none");
      saveButton.classList.add("d-none");
      cancelButton.classList.add("d-none");
    }
  }

  private _saveLicensePlate(event: Event): void {
    const target = event.target as HTMLElement;
    const container = target.closest(".license-plate-container") as HTMLElement;
    if (!container) return;

    const inputElement = container.querySelector(
      ".license-plate-input"
    ) as HTMLInputElement;
    const textElement = container.querySelector(
      ".license-plate-text"
    ) as HTMLElement;
    const vehicleId = inputElement.dataset.id;
    const newLicensePlate = inputElement.value.trim();

    if (!newLicensePlate || !vehicleId) return;

    this.vehicleService
      .updateLicensePlate<IVehicle>({
        vehicleId,
        licensePlate: newLicensePlate,
      })
      .subscribe({
        next: (res: IVehicle) => {
          textElement.textContent = res.licensePlate;
          this._toggleLicensePlateEditing(event, false);
          this.notificationService.notify(
            "notification",
            "success",
            "License plate updated successfully"
          );
        },
      });
  }
}
