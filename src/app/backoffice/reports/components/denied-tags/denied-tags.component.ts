import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { IDateRange } from "src/app/components/daterange-picker/daterange-picker.component";
import { ReportsService } from "../../services/reports.service";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { UtilService } from "src/app/shared/services/util/util.service";
import { IDeniedTag } from "../../models/denied-tags.model";

@Component({
  selector: "app-denied-tags",
  templateUrl: "./denied-tags.component.html",
  styleUrls: ["./denied-tags.component.scss"],
})
export class DeniedTagsComponent implements OnInit {
  readonly defaultRange: IDateRange = {
    startDate: moment().subtract(29, "days").format("MM/DD/YYYY"),
    endDate: moment().format("MM/DD/YYYY"),
  };
  currentRange: IDateRange = this.defaultRange;

  columnDefs: ITableColumnDef[] = [
    {
      field: "tag",
      title: "Tag",
    },
    {
      field: "device",
      title: "Device",
    },
    {
      field: "stamp",
      title: "Date",
      format: {
        type: 'date',
        param: 'MM/dd/YYYY HH:mm a'
      }
    },
    {
      field: "eventType",
      title: "Event Type",
    },
    {
      field: "companyName",
      title: "Company Name",
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
    const name = `Denied_Tags_${startDate}_${endDate}`;
    const header = this.columnDefs.map((col) => col.title);
    const data = this.tableData.rows.map(
      ({ tag, device, stamp, eventType, companyName }) => [
        tag,
        device,
        stamp,
        eventType,
        companyName,
      ]
    );
    this.utilService.exportCsv({ name, header, data });
  }

  private getReports(): void {
    const { startDate, endDate } = this.currentRange;
    this.reportsService
      .getDeniedTags<IDeniedTag[]>(`startDate=${startDate}&endDate=${endDate}`)
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
