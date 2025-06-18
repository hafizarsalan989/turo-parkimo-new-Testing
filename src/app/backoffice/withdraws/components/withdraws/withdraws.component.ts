import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import moment from "moment";

import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { WithdrawService } from "../../services/withdraw.service";
import { IWithdraw } from "../../models/withdraw.model";
import { SwalService } from "src/app/shared/services/swal/swal.service";

declare const $: any;

@Component({
  selector: "app-withdraws",
  templateUrl: "./withdraws.component.html",
  styleUrls: ["./withdraws.component.scss"],
})
export class WithdrawsComponent implements OnInit {
  columnDefs: ITableColumnDef[] = [
    {
      field: "status",
      title: "Status",
    },
    {
      field: "amount",
      title: "Amount",
      format: {
        type: "currency",
      },
    },
    {
      field: "hostName",
      title: "Host Name",
    },
    {
      field: "created",
      title: "Date Requested",
      format: {
        type: "date",
      },
    },
    {
      field: "abaNumber",
      title: "ABA",
    },
    {
      field: "accountNumber",
      title: "Account Number",
    },
    {
      field: "bankName",
      title: "Bank Name",
    },
    {
      field: "accountOwnerName",
      title: "Account Owner Name",
    },
    {
      field: "accountOwnerPhone",
      title: "Account Owner Phone",
    },
    {
      field: "notes",
      title: "Notes",
    },
    { field: "actions" },
  ];
  tableData: ITableData | undefined;

  notes = new FormControl("", [Validators.required]);

  private _selectedId: string | undefined;

  constructor(
    private withdrawService: WithdrawService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.getWithdraws();
  }

  saveStatus(companyBankWithdrawalId: string): void {
    this.swalService.fire(
      "Do you want to mark as funded",
      "Warning",
      "warning",
      "Yes",
      "No",
      true,
      () => {
        this.withdrawService
          .updateStatus<IWithdraw>({ companyBankWithdrawalId })
          .subscribe({
            next: (res) => {
              const index = this.tableData.rows.findIndex(
                (withdraw) => withdraw.id === companyBankWithdrawalId
              );
              if (index > -1) {
                this.tableData.rows[index] = res;
                this.tableData = { ...this.tableData };
              }
            },
          });
      }
    );
  }

  openNoteModal(id: string): void {
    this._selectedId = id;
    $("#withdrawNotesModal").modal("show");
  }

  saveNotes(): void {
    this.withdrawService
      .updateNotes<IWithdraw>({
        companyBankWithdrawalId: this._selectedId,
        notes: this.notes.value,
      })
      .subscribe({
        next: (res) => {
          const index = this.tableData.rows.findIndex(
            (withdraw) => withdraw.id === this._selectedId
          );
          if (index > -1) {
            this.tableData.rows[index] = res;
            this.tableData = { ...this.tableData };
          }
          $("#withdrawNotesModal").modal("hide");
        },
      });
  }

  private getWithdraws(): void {
    this.withdrawService.getAll<IWithdraw[]>().subscribe({
      next: (res) => {
        this.tableData = {
          rows: this._sortData(res),
          totalRows: res.length,
        };
      },
      error: () => {
        this.tableData = {
          rows: [],
          totalRows: 0,
        };
      },
    });
  }

  private _sortData(data: IWithdraw[]): IWithdraw[] {
    return data
      .sort((a, b) => {
        if (a.status === "pending") {
          return -1;
        }

        if (b.status === "pending") {
          return 1;
        }

        return 0;
      })
      .sort((a, b) => {
        return moment(a.created).isBefore(moment(b.created)) ? 1 : -1;
      });
  }
}
