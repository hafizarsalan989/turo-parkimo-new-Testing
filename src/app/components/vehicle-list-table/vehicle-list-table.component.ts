import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin, tap } from "rxjs";

import { IAddon, IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { IImage } from "../img-viewer/img-viewer.component";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import { IColumnDef, IDatatableAction } from "../datatable/datatable.component";
import { defaultCol } from "../datatable/datatable.helper";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";

declare const $: any;

@Component({
  selector: "app-vehicle-list-table",
  templateUrl: "./vehicle-list-table.component.html",
  styleUrls: ["./vehicle-list-table.component.scss"],
})
export class VehicleListTableComponent implements OnInit, OnChanges {
  @Input() companyId: string;
  @Input() editable = true;
  @Input() userRole: string;
  @Input() filterCriteria: { searchCriteria?: string } = {};

  tableId = "vehiclesDatatable";
  columnDefs: IColumnDef[] = [];
  actions: IDatatableAction[] = [
    {
      name: "addOnUnlimiteds",
      label: "U",
      className: "btn-warning btn-success",
      getClassName: (addOnUnlimiteds) => {
        return addOnUnlimiteds?.length ? "btn-warning" : "btn-success";
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
      name: "edit",
      icon: "edit",
      className: "btn-info",
      title: "Edit",
      callback: this.editVehicle.bind(this),
    },
    {
      name: "remove",
      icon: "close",
      className: "btn-danger",
      title: "Delete",
      enabled: [
        {
          key: "canRemove",
          value: [true],
        },
      ],
      callback: this.removeVehicle.bind(this),
    },
  ];

  vehicles: IVehicle[] = [];
  previewImages: IImage[] = [];
  showPreview: boolean = false;

  facilities: IFacility[] = [];
  facilityForm: FormGroup;

  tagChangeModalId = "changeTagInVehicleListPage";
  subscriptionId: string | undefined;

  addonFacilities: IFacility[] = [];
  addonFacilityIds: Record<string, string | boolean>[] = [];
  private selectedVehicle: IVehicle | null;

  constructor(
    private router: Router,
    private vehicleService: VehicleService,
    private swalService: SwalService,
    private notificationService: NotificationService,
    private facilityService: FacilityService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.filterCriteria = {
        searchCriteria: params['searchCriteria'] || '',
      };
    });

    this.initForms();
    this._initializeColumnDefs();

    $("#changeFacilityModal").on("hidden.bs.modal", () => {
      this.facilityForm.reset();
    });
  }

  ngOnChanges(): void {
    this.getFacilityMarkets();
    this.getVehicles();
  }

  private _initializeColumnDefs(): void {
    this.columnDefs = [
      {
        ...defaultCol(0, "imgFront", "Image"),
        className: "img-vehicle",
        event: {
          type: "click",
          callback: this.openImgViewer.bind(this),
        },
        render: (data, _, row) => {
          const src = data
            ? data
            : row["imgDriverSide"]
              ? row["imgDriverSide"]
              : row["imgPassengerSide"]
                ? row["imgPassengerSide"]
                : row["imgRearWithPlate"]
                  ? row["imgRearWithPlate"]
                  : "./assets/img/image_placeholder.jpg";

          return `
            <img src=${src} data-value=${row.id} class="rounded" width="48px" title="Click to see large image" role="button" />
          `;
        },
      },
      {
        ...defaultCol(1, "name", "Name"),
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
      defaultCol(2, "model", "Model"),
      defaultCol(3, "year", "Year"),
      {
        ...defaultCol(4, "subscriptionFacilityId", "Facility"),
        className: "subscriptionFacilityId",
        render: (data, _, row) => {
          const facility = this.facilities.find((fm) => fm.id === data);
          return `<span>${facility?.name ?? ""}</span>`;
        },
      },
      {
        ...defaultCol(5, "subscriptionTag", "Tag"),
        className: "subscriptionTag",
        event:
          this.userRole !== "callcenter"
            ? {
              type: "click",
              callback: this.openTagModal.bind(this),
            }
            : undefined,
        render: (data, _, row) => {
          if (this.userRole !== "callcenter") {
            return `<span class="cursor-pointer" data-value=${row.id
              } title="Change Tag">${data ?? ""
              }</span><i class="material-icons ml-2 icon-edit">edit</i>`;
          } else {
            return `<span>${data ?? ""}</span>`;
          }
        },
      },
    ];
  }

  openImgViewer(vehicle: IVehicle): void {
    this.previewImages = [];
    if (vehicle.imgFront) {
      this.previewImages.push({
        image: vehicle.imgFront,
        title: "Front",
      });
    }
    if (vehicle.imgDriverSide) {
      this.previewImages.push({
        image: vehicle.imgDriverSide,
        title: "Driver Side",
      });
    }
    if (vehicle.imgPassengerSide) {
      this.previewImages.push({
        image: vehicle.imgPassengerSide,
        title: "Passenger Side",
      });
    }
    if (vehicle.imgRearWithPlate) {
      this.previewImages.push({
        image: vehicle.imgRearWithPlate,
        title: "Rear W/Plate",
      });
    }

    this.showPreview = true;
  }

  editVehicle(vehicleId: string): void {
    this.router.navigate([`/host/vehicle/${vehicleId}/edit`]);
  }

  removeVehicle(vehicleId: string): void {
    const index = this.vehicles.findIndex((v) => v.id === vehicleId);

    this.swalService.fire(
      `Sure you want to delete this vehicle - ${this.vehicles[index].name}`,
      "Warning",
      "warning",
      "Yes, delete it",
      "No",
      true,
      () => {
        this.vehicleService.deleteVehicle(vehicleId).subscribe({
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

  onChangeTag(): void {
    this.getVehicles();
    this.subscriptionId = undefined;
    $(`#${this.tagChangeModalId}`).modal("hide");
  }

  openAddonModal(vehicleId: string): void {
    this.selectedVehicle = this.vehicles.find(
      (vehicle) => vehicle.id === vehicleId
    );

    const facility = this.facilities.find(
      (fm) => fm.id === this.selectedVehicle.subscriptionId
    );
    this.addonFacilities = facility.allowAddOnUnlimited ? [facility] : [];
    this.addonFacilityIds = [];

    $("#unlimitedAddonModal").modal("show");
  }

  isAddon(facilityId: string): boolean {
    return (
      this.selectedVehicle?.addOnUnlimiteds.findIndex(
        (addon) => addon.facilityId === facilityId && addon.status === "active"
      ) > -1
    );
  }

  onChangeAddon(checked: boolean, facilityId: string): void {
    const index = this.addonFacilityIds.findIndex(
      (addon) => addon["facilityId"] === facilityId
    );
    if (index > -1) {
      this.addonFacilityIds[index].checked = checked;
    } else {
      this.addonFacilityIds.push({ checked, facilityId });
    }
  }

  saveAddon(): void {
    const reqs$ = [];
    const payload = [];
    const canceledFacilities = [];
    const addedFacilities = [];
    this.addonFacilityIds.forEach((addon) => {
      const index = this.selectedVehicle.addOnUnlimiteds.findIndex(
        (item) =>
          item.facilityId === addon.facilityId && item.status === "active"
      );
      const facilityName = this.addonFacilities.find(
        (f) => f.id === addon.facilityId
      )?.name;
      if (index > -1 && !addon.checked) {
        const req$ = this.vehicleService
          .cancelAddonUnlimited<IAddon>({
            addOnUnlimitedId: this.selectedVehicle.addOnUnlimiteds[index].id,
          })
          .pipe(
            tap((res) => {
              const index = this.selectedVehicle.addOnUnlimiteds.findIndex(
                (item) => item.facilityId === res.facilityId
              );
              this.selectedVehicle.addOnUnlimiteds[index] = res;
            })
          );
        reqs$.push(req$);
        canceledFacilities.push(facilityName);
      }

      if (index === -1 && addon.checked) {
        payload.push({
          vehicleId: this.selectedVehicle.id,
          facilityId: addon.facilityId,
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
            .createAddonUnlimited<IAddon[]>(payload)
            .pipe(
              tap((res) => {
                this.selectedVehicle.addOnUnlimiteds = [
                  ...this.selectedVehicle.addOnUnlimiteds,
                  ...res,
                ];
              })
            );
          reqs$.push(req$);
        }
        forkJoin(reqs$).subscribe(() => {
          let index = this.vehicles.findIndex(
            (v: IVehicle) => v.id === this.selectedVehicle.id
          );
          this.vehicles[index] = this.selectedVehicle;
          this.vehicles = this.vehicles.slice();
          $("#unlimitedAddonModal").modal("hide");
        });
      }
    );
  }

  hasChangedAddon(): boolean {
    let result = false;

    this.addonFacilityIds.forEach((addon) => {
      const index = this.selectedVehicle.addOnUnlimiteds.findIndex(
        (item) =>
          item.facilityId === addon.facilityId && item.status === "active"
      );
      if ((index > -1 && !addon.checked) || (index === -1 && addon.checked)) {
        result = true;
      }
    });

    return result;
  }

  private getVehicles(): void {
    if (this.companyId) {
      this.vehicleService
        .getVehiclesByHostId<IVehicle[]>(this.companyId)
        .subscribe({
          next: (res: IVehicle[]) =>
          (this.vehicles = res.map((item) => ({
            ...item,
            canRemove: item.activePassCount === 0,
          }))),
          error: () => (this.vehicles = []),
        });
    }
  }

  private getFacilityMarkets(): void {
    this.facilityService.getActiveFacilities().subscribe({
      next: (res: IFacility[]) => {
        this.facilities = res;
      },
      error: () => {
        this.facilities = [];
      },
    });
  }

  private initForms(): void {
    this.facilityForm = new FormGroup({
      subscriptionId: new FormControl(""),
      facilityId: new FormControl("", [Validators.required]),
    });
  }

  private openTagModal(vehicle: IVehicle): void {
    this.subscriptionId = vehicle.subscriptionId;
    $(`#${this.tagChangeModalId}`).modal("show");
  }
}
