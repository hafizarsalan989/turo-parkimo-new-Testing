import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  debounceTime,
  filter,
  map,
  Observable,
  startWith,
  switchMap,
  tap,
} from "rxjs";

import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { VehicleSearchService } from "../../services/vehicle-search.service";
import { IImage } from "src/app/components/img-viewer/img-viewer.component";
import {
  IColumnDef,
  IDatatableAction,
} from "src/app/components/datatable/datatable.component";
import { defaultCol } from "src/app/components/datatable/datatable.helper";

declare const $: any;

@Component({
  selector: "app-vehicle-search",
  templateUrl: "./vehicle-search.component.html",
  styleUrls: ["./vehicle-search.component.scss"],
})
export class VehicleSearchComponent implements OnInit {
  tagControl = new FormControl("");
  tags: string[];

  searched: boolean = false;
  private vehicles: IVehicle[] = [];
  filteredVehicles: IVehicle[] = [];
  previewImages: IImage[] = [];
  showPreview: boolean = false;

  selectedVehicle: IVehicle;
  imageIndex: number;
  messageForm: FormGroup;
  loading: boolean = false;

  tableId = "permitsDatatable";
  columnDefs: IColumnDef[] = [
    defaultCol(0, "name", "Name"),
    {
      ...defaultCol(1, "isDeleted", "Status"),
      render: (data) => {
        return data ? "Inactive" : "Active";
      },
    },
    {
      ...defaultCol(2, "imgFront", "Image"),
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
  ];
  actions: IDatatableAction[] = [
    {
      name: "send",
      icon: "send",
      className: "btn-info",
      title: "Send Message",
      callback: this.openMessageModal.bind(this),
    },
  ];

  constructor(
    private vehicleSearchService: VehicleSearchService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.tagControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(500),
        filter((val) => val.length > 2),
        switchMap(() => {
          return this.searchOptions();
        })
      )
      .subscribe((res: string[]) => (this.tags = res));

    this.initForm();
  }

  private searchOptions(): Observable<string[]> {
    return this.vehicleSearchService
      .search<IVehicle[]>(this.tagControl.value)
      .pipe(
        tap((vehicles: IVehicle[]) => (this.vehicles = vehicles)),
        map((vehicles: IVehicle[]) =>
          vehicles
            .map((vehicle: IVehicle) => vehicle["aviCredentialTag"])
            .filter((tag: string) => !!tag)
        )
      );
  }

  displayFn(option: string): string {
    return option ?? "";
  }

  onOptionSelected(): void {
    this.searched = true;
    setTimeout(() => {
      const tag = this.tagControl.value;
      this.filteredVehicles = this.vehicles.filter(
        (vehicle: IVehicle) => vehicle.aviCredentialTag === tag
      );
    });
  }

  clear(): void {
    this.tagControl.setValue("");
    this.searched = false;
    this.vehicles = [];
  }

  openImgViewer(vehicle: IVehicle, index: number = 0): void {
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

    this.imageIndex = index;
    this.showPreview = true;
  }

  private initForm(): void {
    this.messageForm = new FormGroup({
      vehicleId: new FormControl(""),
      subject: new FormControl("", [Validators.required]),
      message: new FormControl("", [Validators.required]),
    });
  }

  openVehicleDetailModal(vehicle: IVehicle): void {
    this.selectedVehicle = vehicle;
    $("#vehicleDetailModal").modal("show");
  }

  openMessageModal(vehicleId: string): void {
    this.messageForm.get("vehicleId").setValue(vehicleId);
    $("#vehicleSearchMessageModal").modal("show");
  }

  sendMessage(): void {
    this.vehicleSearchService.sendMessage(this.messageForm.value).subscribe({
      next: () => {
        this.notificationService.notify(
          "notification",
          "success",
          "Message sent successfully"
        );
        $("#vehicleSearchMessageModal").modal("hide");
      },
    });
  }
}
