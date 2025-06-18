import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { IDateRange } from "src/app/components/daterange-picker/daterange-picker.component";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { UtilService } from "src/app/shared/services/util/util.service";
import { ICityPassCount } from "../../models/city-pass-count.model";
import { ReportsService } from "../../services/reports.service";

@Component({
  selector: "app-city-pass-count",
  templateUrl: "./city-pass-count.component.html",
  styleUrls: ["./city-pass-count.component.scss"],
})
export class CityPassCountComponent implements OnInit {
  readonly defaultRange: IDateRange = {
    startDate: moment().subtract(29, "days").format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
  };
  currentRange: IDateRange = this.defaultRange;

  columnDefs: ITableColumnDef[] = [
    {
      field: "marketName",
      title: "Market Name",
    },
    {
      field: "companyName",
      title: "Company Name",
    },
    {
      field: "ownerName",
      title: "Owner Name",
    },
    {
      field: "subscriptionCount",
      title: "Count",
      format: {
        type: 'number'
      }
    },
  ];
  tableData: ITableData | undefined;

  constructor(
    private reportsService: ReportsService,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {}

  onRangeChanged(e: IDateRange): void {
    this.currentRange = e;
    this.getReports();
  }

  exportCsv(): void {
    const { startDate, endDate } = this.currentRange;
    const name = `City_Pass_Count_${startDate}_${endDate}`;
    const header = this.columnDefs.map((col) => col.title);
    const data = this.tableData.rows.map(
      ({ marketName, companyName, ownerName, subscriptionCount }) => [
        marketName,
        companyName,
        ownerName,
        subscriptionCount,
      ]
    );
    this.utilService.exportCsv({ name, header, data });
  }

  private getReports(): void {
    const { startDate, endDate } = this.currentRange;
    this.reportsService
      .getCityPassCount<ICityPassCount[]>(
        `startDate=${startDate}&endDate=${endDate}`
      )
      .subscribe({
        next: (res) => {
          this.tableData = {
            totalRows: res.length,
            rows: res,
          };
        },
        error: () => {
          this.tableData = {
            totalRows: 0,
            rows: [],
          };
        },
      });
  }
}
