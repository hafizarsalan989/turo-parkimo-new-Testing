import { Component, OnInit } from "@angular/core";
import { ReportsService } from "../../services/reports.service";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { ISystemReport } from "../../models/system.model";

@Component({
  selector: "app-system",
  templateUrl: "./system.component.html",
  styleUrls: ["./system.component.scss"],
})
export class SystemComponent implements OnInit {
  columnDefs: ITableColumnDef[] = [
    {
      field: "name",
      title: "Name",
    },
    {
      field: "description",
      title: "Description",
    },
    {
      field: "actions",
    },
  ];
  tableData: ITableData | undefined;

  constructor(private _reportsService: ReportsService) {}

  ngOnInit(): void {
    this._reportsService.getSystemReport<ISystemReport[]>().subscribe({
      next: (res) => {
        this.tableData = {
          totalRows: res.length,
          rows: res,
        };
      },
      error: () => {
        this.tableData = undefined;
      },
    });
  }

  onExport(report: ISystemReport): void {
    this._reportsService.downloadSystemReport(report.apiUrl).subscribe({
      next: (res: any) => {
        let dataType = res.type;
        let binaryData: BlobPart[] = [];
        binaryData.push(res);
        let aTag = document.createElement("a");
        aTag.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        aTag.target = "_blank";
        aTag.download = `${report.name}.csv`;
        document.body.appendChild(aTag);
        aTag.click();
      },
    });
  }
}
