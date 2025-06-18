import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
} from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from "@angular/material-moment-adapter";
import * as moment from "moment";

import { FinancialService } from "src/app/facility/reports/services/financial.service";
import { IFacilityFinancialSummary } from "src/app/facility/reports/models/financial-summary.model";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { ITableColumnDef, ITableData } from "../table/table.model";

export const MY_FORMATS = {
  parse: {
    dateInput: "MM/YY",
  },
  display: {
    dateInput: "MMM, YYYY",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
  },
};

@Component({
  selector: "app-facility-financials",
  templateUrl: "./facility-financials.component.html",
  styleUrls: ["./facility-financials.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FacilityFinancialsComponent implements OnInit {
  facilityId: string | undefined;
  facilities: IFacility[] = [];

  date = new FormControl(moment(), Validators.required);
  min = moment().year(2024).month(0).hour(0).minute(0).second(0);
  max = moment().hour(24).minute(59).second(59);

  get isDisabledPrev(): boolean {
    return this.min.isAfter(moment(this.date.value).subtract(1, "M"));
  }

  get isDisabledNext(): boolean {
    return this.max.isBefore(moment(this.date.value).add(1, "M"));
  }

  tableData: ITableData | undefined;

  columnDefs: ITableColumnDef[] = [
    { field: "product", title: "Product", className: "w-50" },
    { field: "qty", title: "Quantity", format: { type: "number" } },
    {
      field: "amountFacility",
      title: "Amount(Facility)",
      format: { type: "currency" },
      showFooter: true,
    },
  ];

  constructor(
    private financialService: FinancialService,
    private facilityService: FacilityService
  ) {}

  ngOnInit(): void {
    this.getFacilities();
  }

  setMonthAndYear(
    normalizedMonthAndYear: moment.Moment,
    datepicker: MatDatepicker<moment.Moment>
  ): void {
    const ctrlValue = moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();

    this.getSummary();
  }

  onPrev(): void {
    this.date.setValue(moment(this.date.value).subtract(1, "M"));
    this.getSummary();
  }

  onNext(): void {
    this.date.setValue(moment(this.date.value).add(1, "M"));
    this.getSummary();
  }

  getSummary(): void {
    const [month, year] = moment(this.date.value).format("M/YYYY").split("/");
    const query = `?facilityId=${this.facilityId}&year=${year}&month=${month}`;

    this.financialService
      .getFinancialSummary<IFacilityFinancialSummary[]>(query)
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

  private getFacilities(): void {
    this.facilityService.getFacilitiesByUser<IFacility[]>().subscribe({
      next: (res) => {
        this.facilities = res;
        if (this.facilities.length > 0) {
          this.facilityId = this.facilities[0].id;
          this.getSummary();
        }
      },
      error: () => {
        this.facilities = [];
      },
    });
  }
}
