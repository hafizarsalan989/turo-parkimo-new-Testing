import { Component, Input, OnChanges } from "@angular/core";
import { ISpace } from "src/app/host/reserved-spaces/models/reserved-space.model";
import { ReserveSpaceService } from "src/app/host/reserved-spaces/services/reserve-space.service";
import { IColumnDef } from "../datatable/datatable.component";
import { defaultCol } from "../datatable/datatable.helper";
import {
  CurrencyPipe,
  DatePipe,
  DecimalPipe,
  TitleCasePipe,
} from "@angular/common";

@Component({
  selector: "app-reserved-space-list-table",
  templateUrl: "./reserved-space-list-table.component.html",
  styleUrls: ["./reserved-space-list-table.component.scss"],
})
export class ReservedSpaceListTableComponent implements OnChanges {
  @Input() companyId: string;

  tableId = "reservedSpacesDatatable";
  columnDefs: IColumnDef[] = [
    {
      ...defaultCol(0, "spaceNumber", "Space"),
      render: (data) => {
        return this.decimalPipe.transform(data);
      },
    },
    {
      ...defaultCol(1, "status", "Status"),
      render: (data) => {
        return `
          <span class="${
            data === "canceled"
              ? "text-danger"
              : data === "active"
              ? "text-success"
              : "text-warning"
          }">${this.titleCasePipe.transform(data)}</span>
        `;
      },
    },
    defaultCol(2, "carPark.name", "Car Park"),
    {
      ...defaultCol(3, "startDate", "Start Date"),
      render: (data) => {
        return `<span class='d-none'>${this.datePipe.transform(
          data,
          "yyyy/MM/dd"
        )}</span>${this.datePipe.transform(data, "MM/dd/yyyy")}`;
      },
    },
    {
      ...defaultCol(4, "minEndDate", "End Date"),
      render: (data) => {
        return `<span class='d-none'>${this.datePipe.transform(
          data,
          "yyyy/MM/dd"
        )}</span>${this.datePipe.transform(data, "MM/dd/yyyy")}`;
      },
    },
    {
      ...defaultCol(5, "monthlyRate", "Monthly Price"),
      render: (data) => {
        return this.currencyPipe.transform(data, "USD");
      },
    },
    defaultCol(6, "notes", "Notes"),
  ];

  spaces: ISpace[] = [];

  constructor(
    private decimalPipe: DecimalPipe,
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private reservedSpaceService: ReserveSpaceService
  ) {}

  ngOnChanges(): void {
    this.getSpaces();
  }

  getSpaces(): void {
    if (this.companyId) {
      this.reservedSpaceService
        .getReservedSpacesByCompanyId<ISpace[]>(this.companyId)
        .subscribe({
          next: (res: ISpace[]) => (this.spaces = res),
          error: () => (this.spaces = []),
        });
    }
  }
}
