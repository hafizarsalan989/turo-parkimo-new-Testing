import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { IDateRange } from "src/app/components/daterange-picker/daterange-picker.component";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { UtilService } from "src/app/shared/services/util/util.service";
import { ReportsService } from "../../services/reports.service";
import { ITravelerInvoice } from "../../models/traveler-invoice.model";

@Component({
  selector: "app-traveler-invoices",
  templateUrl: "./traveler-invoices.component.html",
  styleUrls: ["./traveler-invoices.component.scss"],
})
export class TravelerInvoicesComponent implements OnInit {
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
      field: "facilityName",
      title: "Facility Name",
    },
    {
      field: "invoiceDate",
      title: "Invoice Date",
      format: {
        type: "date",
      },
    },
    {
      field: "amount",
      title: "Amount",
      format: {
        type: "currency",
      },
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
    const name = `Traveler_Sales_Invoices_${startDate}_${endDate}`;
    const header = this.columnDefs.map((col) => col.title);
    const data = this.tableData.rows.map(
      ({ marketName, companyName, facilityName, invoiceDate, amount }) => [
        marketName,
        companyName,
        facilityName,
        invoiceDate,
        amount,
      ]
    );
    this.utilService.exportCsv({ name, header, data });
  }

  private getReports(): void {
    const { startDate, endDate } = this.currentRange;
    this.reportsService
      .getTravelerInvoices<ITravelerInvoice[]>(
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
