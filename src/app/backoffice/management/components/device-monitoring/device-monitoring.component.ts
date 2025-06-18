import { Component, OnDestroy, OnInit } from "@angular/core";
import { ManagementService } from "../../services/management.service";
import {
  IDeviceMonitoringReport,
  IDeviceMonitoringReportDeviceDetail,
} from "../../models/device-monitoring.model";
import { ServerEventsService } from "src/app/core/services/server-events/server-events.service";
import { Subscription } from "rxjs";

declare const $: any;

@Component({
  selector: "app-device-monitoring",
  templateUrl: "./device-monitoring.component.html",
  styleUrls: ["./device-monitoring.component.scss"],
})
export class DeviceMonitoringComponent implements OnInit, OnDestroy {
  reports: IDeviceMonitoringReport[] = [];
  activities: IDeviceMonitoringReportDeviceDetail[] = [];

  private _subscription: Subscription | undefined;

  constructor(
    private _managementService: ManagementService,
    private _serverEventsService: ServerEventsService<IDeviceMonitoringReport[]>
  ) {}

  ngOnInit(): void {
    this._getAll();
    this._subscription = this._serverEventsService.message$.subscribe({
      next: (res) => {
        if (res.selector === "cmd.deviceActivityReport") {
          this.reports = res.body;
        }
      },
    });
  }

  viewActivities(activities: IDeviceMonitoringReportDeviceDetail[]): void {
    this.activities = activities;
    $("#deviceActivityModal").modal("show");
  }

  private _getAll(): void {
    this._managementService
      .getDeviceMonitoringReport<IDeviceMonitoringReport[]>()
      .subscribe({
        next: (res) => {
          this.reports = res;
          this._serverEventsService.subscribeToChannels("deviceActivityReport");
        },
        error: () => {
          this.reports = [];
          this._serverEventsService.subscribeToChannels("deviceActivityReport");
        },
      });
  }

  ngOnDestroy(): void {
    this._subscription?.unsubscribe();
    this._serverEventsService.unsubscribeFromChannels("deviceActivityReport");
  }
}
