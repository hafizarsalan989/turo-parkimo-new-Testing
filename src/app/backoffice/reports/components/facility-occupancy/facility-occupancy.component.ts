import { Component, OnInit } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexPlotOptions,
  ApexXAxis,
} from "ng-apexcharts";
import moment from "moment";

import { IDateRange } from "src/app/components/daterange-picker/daterange-picker.component";
import { IFacilityOccupancy } from "../../models/facility-occupancy.model";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { UtilService } from "src/app/shared/services/util/util.service";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { ReportsService } from "../../services/reports.service";

@Component({
  selector: "app-facility-occupancy",
  templateUrl: "./facility-occupancy.component.html",
  styleUrls: ["./facility-occupancy.component.scss"],
})
export class FacilityOccupancyComponent implements OnInit {
  facilityIds: string[] = ["all"];
  facilities: IFacility[] = [];

  get facilitiesLabel(): string {
    const label =
      this.facilityIds[0] === "all"
        ? "All"
        : this.facilities.find(
            (facility) => facility.id === this.facilityIds[0]
          )?.name ?? "";

    if (this.facilityIds.length > 1) {
      return `${label} +${this.facilityIds.length - 1} ${
        this.facilityIds.length === 2 ? "other" : "others"
      }`;
    } else {
      return label;
    }
  }

  readonly defaultRange: IDateRange = {
    startDate: moment().subtract(29, "days").format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
  };
  currentRange: IDateRange = this.defaultRange;
  readonly minDate: string = moment().year(2024).month(0).date(1).toISOString();

  readonly slots: Record<string, string>[] = [
    { key: "Daily", value: "daily" },
    { key: "Weekly", value: "dayOfWeek" },
    { key: "Hourly", value: "hourly" },
  ];
  currentSlot = this.slots[0].value;

  readonly chartTypes: Record<string, string>[] = [
    { key: "show_chart", value: "line" },
    { key: "bar_chart", value: "column" },
    { key: "sort", value: "bar" },
    { key: "table_rows", value: "table" },
  ];
  currentType = this.chartTypes[0].value;

  series: ApexAxisChartSeries | undefined;
  xaxis: ApexXAxis | undefined;
  chart: ApexChart = {
    type: "line",
  };
  plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
    },
  };

  columnDefs: ITableColumnDef[] = [
    {
      field: "label",
      title: "",
      disabled: true,
    },
    {
      field: "min",
      title: "Min",
    },
    {
      field: "avg",
      title: "Avg",
    },
    {
      field: "max",
      title: "Max",
    },
  ];
  tableData: ITableData | undefined;

  private occupancy: IFacilityOccupancy | undefined;

  constructor(
    private facilityService: FacilityService,
    private reportsService: ReportsService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.getFacilities();
  }

  onSelectFacilities({ value }: { value: string[] }): void {
    const allIndex = value.findIndex((facilityId) => facilityId === "all");

    if (allIndex > -1) {
      if (this.facilityIds.includes("all")) {
        value.splice(allIndex, 1);
        this.facilityIds = [...value];
      } else {
        this.facilityIds = ["all"];
      }
    } else {
      if (value.length === 0) {
        this.facilityIds = ["all"];
      } else {
        this.facilityIds = [...value];
      }
    }
  }

  onClosedSelect(e: boolean): void {
    if (!e) {
      this.getReports();
    }
  }

  onRangeChanged(e: IDateRange): void {
    this.currentRange = e;
    this.getReports();
  }

  toggleData(slot: string): void {
    this.currentSlot = slot;
    this.updateChart();
  }

  toggleType(type: "line" | "column" | "bar" | "table"): void {
    this.currentType = type;

    if (type !== "table") {
      this.chart = {
        type: type === "column" ? "bar" : type,
      };
      if (type === "column" || type === "bar") {
        this.plotOptions = {
          bar: {
            horizontal: type === "bar",
          },
        };
      }
    }

    this.updateChart();
  }

  exportCsv(): void {
    const name = `Facility_Occupancy_${this.currentSlot}`;
    const header = ["", "Min", "Avg", "Max"];
    const data = this.tableData.rows.map(({ label, min, avg, max }) => [
      label,
      min,
      avg,
      max,
    ]);
    this.utilService.exportCsv({ name, header, data });
  }

  private getFacilities(): void {
    this.facilityService.getFacilitiesByUser<IFacility[]>().subscribe({
      next: (res) => {
        this.facilities = res;
      },
      error: () => {
        this.facilities = [];
      },
    });
  }

  private getReports(): void {
    const payload = {
      facilityIds: this.facilityIds,
      ...this.currentRange,
    };

    this.reportsService
      .getFacilityOccupancy<IFacilityOccupancy>(payload)
      .subscribe({
        next: (res) => {
          this.occupancy = res;
          setTimeout(() => {
            this.updateChart();
          });
        },
      });
  }

  private updateChart(): void {
    const mins = [],
      avgs = [],
      maxs = [],
      categories = [];
    const rows = (this.occupancy?.data[this.currentSlot] ?? []).map(
      ({ avg, ...rest }) => ({ ...rest, avg: Math.round(avg) })
    );
    rows.forEach(({ label, min, avg, max }) => {
      mins.push(min);
      avgs.push(avg);
      maxs.push(max);
      categories.push(label);
    });
    this.series = [
      { name: "Min", data: mins },
      { name: "Avg", data: avgs },
      { name: "Max", data: maxs },
    ];
    this.xaxis = { categories };

    this.tableData = {
      rows,
      totalRows: rows.length,
    };
  }
}
