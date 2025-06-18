import { Component, OnInit } from "@angular/core";
import * as moment from "moment";
import { ApexAxisChartSeries, ApexXAxis } from "ng-apexcharts";

import { HostService } from "../host/services/host/host.service";
import {
  IBackofficeDashboard,
  IFacilityDashboard,
  IHostDashboard,
} from "../shared/models/dashboard.model";
import { SessionService } from "../shared/services/session/session.service";
import { BackofficeService } from "../backoffice/services/backoffice.service";
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  host: IHostDashboard | null;
  facility: IFacilityDashboard | null;
  backoffice: IBackofficeDashboard | null;

  private userType: string | undefined;
  series: ApexAxisChartSeries | undefined;
  xaxis: ApexXAxis | undefined;

  constructor(
    private backofficService: BackofficeService,
    private hostService: HostService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.sessionService.getUser$().subscribe((user) => {
      if (user?.turoUserType === this.userType) {
        return;
      }

      this.userType = user?.turoUserType;
      if (user?.turoUserType === "host") {
        this.getHost();
      }
      if (user?.turoUserType === "facility") {
        this.getFacility();
      }
      if (user?.turoUserType === "backoffice") {
        this.getBackoffice();
      }
    });
  }

  private getHost(): void {
    this.hostService.getHostDashboard<IHostDashboard>().subscribe({
      next: (res: IHostDashboard) => {
        this.host = res;
      },
      error: () => {
        this.host = null;
      },
    });
  }

  private getFacility(): void {
    this.hostService.getFacilityDashboard<IFacilityDashboard>().subscribe({
      next: (res: IFacilityDashboard) => {
        this.facility = res;
      },
      error: () => {
        this.facility = null;
      },
    });
  }

  private getBackoffice(): void {
    this.backofficService.getDashboard<IBackofficeDashboard>().subscribe({
      next: (res: IBackofficeDashboard) => {
        this.backoffice = res;
        this.series = [
          { name: "Activity", data: res?.chart.map((item) => item.count) },
        ];
        this.xaxis = {
          categories: res?.chart.map((item) =>
            moment(item.date).format("MM/DD/YYYY")
          ),
        };
      },
      error: () => {
        this.backoffice = null;
      },
    });
  }
}
