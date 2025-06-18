import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { interval, Subject, takeUntil } from "rxjs";

import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { IParkingActivity } from "../../models/activity.model";
import { ICallCenterHub } from "src/app/call-center/hub/models/call-center-hub.model";
import {
  ICarPark,
  IFacility,
} from "src/app/host/vehicles/models/facility.model";
import { ICallCenterHubSession } from "src/app/call-center/hub/models/call-center-hub.model";

import { ManagementService } from "../../services/management.service";
import { CallCenterService } from "src/app/call-center/hub/services/call-center.service";
import { FacilityService } from "src/app/facility/services/facility.service";

declare const $: any;

@Component({
  selector: "app-activity",
  templateUrl: "./activity.component.html",
  styleUrls: ["./activity.component.scss"],
})
export class ActivityComponent implements OnInit, OnDestroy {
  columnDefs: ITableColumnDef[] = [
    {
      field: "stamp",
      title: "Date",
      format: {
        type: "date",
        param: "MM/dd/yyyy hh:mm a",
      },
    },
    {
      field: "tag",
      title: "Tag",
    },
    {
      field: "vehicle",
      title: "Vehicle",
    },
    {
      field: "facility",
      title: "Facility",
    },
    {
      field: "kiosk",
      title: "Kiosk",
    },
    {
      field: "action",
      title: "Action", // "Entry" or "Exit"
    },
  ];
  tableData: ITableData | undefined;

  searchCriteria: string | undefined;
  hub: ICallCenterHub | undefined;

  activityForm: FormGroup | undefined;
  carParks: ICarPark[] = [];

  selectedSession: ICallCenterHubSession | undefined;

  private destroy$ = new Subject<void>();

  constructor(
    private managementService: ManagementService,
    private callCenterService: CallCenterService,
    private facilityService: FacilityService
  ) {}

  ngOnInit(): void {
    this.getActivities();

    this._initForm();

    interval(30 * 1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getActivities();
      });

    $("#managementCreatingActivityModal").on("hidden.bs.modal", () => {
      this.activityForm.reset();

      Object.keys(this.activityForm.controls).forEach((key) => {
        this.activityForm.get(key).setErrors(null);
      });
    });

    $("#addNewActivity").on("hidden.bs.modal", () => {
      this.searchCriteria = "";
      this.hub = undefined;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getActivities(): void {
    this.managementService
      .getLatestParkingActivities<IParkingActivity[]>()
      .subscribe({
        next: (res: IParkingActivity[]) => {
          console.log("Latest Parking Activities: ", res);
          const rows = res.map(({ company, facility, vehicle, ...rest }) => ({
            ...rest,
            company: company.name ?? "",
            facility: facility.name ?? "",
            vehicle: vehicle.name ?? "",
          }));

          this.tableData = { totalRows: rows.length, rows: rows };
        },
      });
  }

  onSearch(): void {
    if (this.searchCriteria) {
      this.callCenterService.searchHub(this.searchCriteria).subscribe({
        next: (res) => {
          this.hub = res;
          this._getFacility(res.facility.id);
        },
      });
    }
  }

  onSaveActivity(): void {
    let { stamp, ...rest } = this.activityForm.value;

    this.callCenterService
      .addActivity({
        ...rest,
        stamp: stamp.startDate,
        facilityId: this.hub.facility.id,
        subscriptionId: this.hub.subscriptionId,
      })
      .subscribe({
        next: (res) => {
          this.hub = res;
          $("#managementCreatingActivityModal").modal("hide");
        },
        error: () => {
          this.hub = undefined;
        },
      });
  }

  viewActivity(session: ICallCenterHubSession): void {
    this.selectedSession = session;
    $("#vehicleActivityModal").modal("show");
  }

  private _initForm(): void {
    this.activityForm = new FormGroup({
      activity: new FormControl("", [Validators.required]),
      vendedGate: new FormControl(false),
      carParkId: new FormControl("", [Validators.required]),
      stamp: new FormControl(""),
      notes: new FormControl(""),
    });
  }

  private _getFacility(id: string): void {
    this.facilityService.getFacilityById<IFacility>(id).subscribe({
      next: (res) => {
        this.carParks = res.carParks;
      },
      error: () => {
        this.carParks = [];
      },
    });
  }
}
