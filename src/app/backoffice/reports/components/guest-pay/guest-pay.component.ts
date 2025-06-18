import { Component, OnInit } from "@angular/core";

import { ReportsService } from "../../services/reports.service";
import {
  IGuestPay,
  IGuestPayDaily,
  IGuestPaySummary,
} from "../../models/guest-pay.model";

@Component({
  selector: "app-guest-pay",
  templateUrl: "./guest-pay.component.html",
  styleUrls: ["./guest-pay.component.scss"],
})
export class GuestPayComponent implements OnInit {
  summary: IGuestPaySummary[] = [];
  daily: IGuestPayDaily[] = [];

  constructor(private _reportsService: ReportsService) {}

  ngOnInit(): void {
    this._getReports();
  }

  private _getReports(): void {
    this._reportsService.getGuestPayReport<IGuestPay>().subscribe({
      next: (res) => {
        const summaryTotal = res.summaryData.reduce(
          (totals, facility) => {
            totals.todayTotal += facility.todayTotal;
            totals.yesterdayTotal += facility.yesterdayTotal;
            totals.last7DaysTotal += facility.last7DaysTotal;
            totals.last7DaysAvg += facility.last7DaysAvg;
            totals.last30DaysTotal += facility.last30DaysTotal;
            totals.last30DaysAvg += facility.last30DaysAvg;
            totals.last90DaysTotal += facility.last90DaysTotal;
            totals.last90DaysAvg += facility.last90DaysAvg;

            return totals;
          },
          {
            todayTotal: 0,
            yesterdayTotal: 0,
            last7DaysTotal: 0,
            last7DaysAvg: 0,
            last30DaysTotal: 0,
            last30DaysAvg: 0,
            last90DaysTotal: 0,
            last90DaysAvg: 0,
          }
        );
        this.summary = [
          ...res.summaryData,
          {},
          { ...summaryTotal, facilityname: "Total" },
        ];

        const dailyTotal = {
          facilityId: "Total",
          facilityname: "Total",
          data: [
            { dayOfWeek: "Sun", total: 0, dailyAvg: 0 },
            { dayOfWeek: "Mon", total: 0, dailyAvg: 0 },
            { dayOfWeek: "Tue", total: 0, dailyAvg: 0 },
            { dayOfWeek: "Wed", total: 0, dailyAvg: 0 },
            { dayOfWeek: "Thu", total: 0, dailyAvg: 0 },
            { dayOfWeek: "Fri", total: 0, dailyAvg: 0 },
            { dayOfWeek: "Sat", total: 0, dailyAvg: 0 },
          ],
        };
        res.dayOfWeekData.forEach((facility) => {
          facility.data.forEach((dayData, index) => {
            dailyTotal.data[index].total += dayData.total;
            dailyTotal.data[index].dailyAvg += dayData.dailyAvg;
          });
        });

        this.daily = [
          ...res.dayOfWeekData,
          { data: [{}, {}, {}, {}, {}, {}, {}] },
          dailyTotal,
        ];
      },
    });
  }
}
