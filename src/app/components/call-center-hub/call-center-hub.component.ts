import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  debounceTime,
  filter,
  Observable,
  startWith,
  switchMap,
  tap,
} from "rxjs";

import {
  ICallCenterHub,
  ICallCenterHubSession,
} from "src/app/call-center/hub/models/call-center-hub.model";
import { CallCenterService } from "src/app/call-center/hub/services/call-center.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { HostService } from "src/app/host/services/host/host.service";
import { FacilityService } from "src/app/facility/services/facility.service";
import { UserService } from "src/app/users/services/user.service";
import {
  ICarPark,
  IFacility,
} from "src/app/host/vehicles/models/facility.model";
import { IUser } from "src/app/shared/models/user.model";
import { IHost } from "src/app/host/models/host.model";

declare const $: any;
@Component({
  selector: "app-call-center-hub",
  templateUrl: "./call-center-hub.component.html",
  styleUrls: ["./call-center-hub.component.scss"],
})
export class CallCenterHubComponent implements OnInit {
  hostControl = new FormControl("");
  hosts: IHost[] = [];
  host: IHost | null;
  owner: IUser | null;
  dataTable: any;
  searchCriteria: string | undefined;
  hub: ICallCenterHub | undefined;

  activityForm: FormGroup | undefined;
  carParks: ICarPark[] = [];

  selectedSession: ICallCenterHubSession | undefined;

  user: IUser | undefined;

  searched: boolean = false;

  constructor(
    private callCenterService: CallCenterService,
    private facilityService: FacilityService,
    private sessionService: SessionService,
    private hostService: HostService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
    });
    setTimeout(() => {
      this.dataTable = ($('#sessionTable') as any).DataTable();
    }, 0);
    this.hostControl.valueChanges
      .pipe(
        startWith(""),
        debounceTime(500),
        filter((val) => val.length > 2),
        switchMap(() => {
          return this.searchHostOptions();
        })
      )
      .subscribe((res: IHost[]) => (this.hosts = res));

    this._initForm();

    $("#callCenterHubActivityModal").on("hidden.bs.modal", () => {
      this.activityForm.reset();
    });
  }
  ngOnDestroy(): void {
    if (this.dataTable) {
      this.dataTable.destroy();
    }
  }
  private searchHostOptions(): Observable<IHost[]> {
    const query = `searchCriteria=${this.hostControl.value}`;
    return this.hostService
      .searchHostManagement<IHost[]>(`?${query}`)
      .pipe(tap((hosts: IHost[]) => (this.hosts = hosts)));
  }

  onSearchHub(): void {
    this.hostControl.setValue("");
    this.searched = false;
    this.hosts = [];
    this.host = null;
    this.owner = null;

    if (this.searchCriteria) {
      this.callCenterService.searchHub(this.searchCriteria).subscribe({
        next: (res) => {
          this.hub = res;
          this._getHostById(res.company.id);
          this._getFacility(res.facility.id);
        },
        error: () => {
          this.hub = undefined;
          this.carParks = [];
        },
      });
    }
  }

  onSaveActivity(): void {
    this.callCenterService
      .addActivity({
        ...this.activityForm.value,
        facilityId: this.hub.facility.id,
        subscriptionId: this.hub.subscriptionId,
      })
      .subscribe({
        next: (res) => {
          this.hub = res;
          $("#callCenterHubCreatingActivityModal").modal("hide");
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

  displayFn(option: IHost | string): string {
    if (typeof option === "string") {
      return option;
    }
    return option && option.companyName ? option.companyName : "";
  }

  onOptionSelected(event: any): void {
    this.hub = undefined;
    this.searchCriteria = undefined;
    this.host = null;
    this.owner = null;

    this.searched = true;
    const selectedHost = event.option.value;
    this.hostControl.setValue(selectedHost.companyName);
    this._getHostById(selectedHost.companyId);
  }

  onClear(): void {
    this.hostControl.setValue("");
    this.searched = false;
    this.hosts = [];
    this.host = null;
    this.owner = null;
    this.hub = undefined;
    this.searchCriteria = undefined;
  }

  private _getHostById(id: string): void {
    this.hostService.getHostById<IHost>(id).subscribe({
      next: (res: IHost) => {
        this.host = res;
        this._getOwnerDetails(this.host.ownerId);
      },
      error: () => (this.host = null),
    });
  }

  private _getOwnerDetails(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (res: IUser) => {
        this.owner = res;
      },
      error: () => (this.owner = null),
    });
  }

  private _initForm(): void {
    this.activityForm = new FormGroup({
      activity: new FormControl("", [Validators.required]),
      vendedGate: new FormControl(false),
      carParkId: new FormControl("", [Validators.required]),
      notes: new FormControl(""),
    });
  }

  private _getFacility(id: string): void {
    this.facilityService.getFacilityById<IFacility>(id).subscribe({
      next: (res) => {
        this.carParks = res?.carParks;
      },
      error: () => {
        this.carParks = [];
      },
    });
  }
}
