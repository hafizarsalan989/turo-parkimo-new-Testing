import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CurrencyPipe, DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import moment from "moment";

import { IColumnDef } from "src/app/components/datatable/datatable.component";
import { ActionCenterService } from "../../services/action-center.service";
import {
  IActionFine,
  IActionItem,
  IActionLog,
  IActionMenu,
} from "../../models/action-item.model";
import { defaultCol } from "src/app/components/datatable/datatable.helper";
import { IFile } from "src/app/shared/models/file.model";

declare const $: any;

@Component({
  selector: "app-action-center-list",
  templateUrl: "./action-center-list.component.html",
  styleUrls: ["./action-center-list.component.scss"],
})
export class ActionCenterListComponent implements OnInit, AfterViewInit {
  readonly tableId: string = "actionCenterListTable";
  columnDefs: IColumnDef[] = [
    {
      ...defaultCol(0, "created", "Date"),
      className: "action-item-created",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        const value = this._datePipe.transform(data, "MM/dd/yyyy hh:mm a");
        return `<span data-value="${row.id}">${value}</span>`;
      },
    },
    {
      ...defaultCol(1, "created", "Elapsed"),
      className: "action-item-elapsed",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        const value = moment(data).fromNow();
        return `<span data-value="${row.id}">${value}</span>`;
      },
    },
    {
      ...defaultCol(2, "status", "Status"),
      className: "action-item-status",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(3, "itemTypeDescription", "Type"),
      className: "action-item-type",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(4, "marketName", "Market"),
      className: "action-item-market",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(5, "facilityName", "Facility"),
      className: "action-item-facility",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(6, "companyName", "Host"),
      className: "action-item-host",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(7, "vehicleName", "Vehicle"),
      className: "action-item-vehicle",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: IActionItem) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(8, "fine", "Amount"),
      className: "action-item-amount",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: IActionFine, _: unknown, row: IActionItem) => {
        const value = !!data
          ? this._currencyPipe.transform(data.amount, "USD")
          : "";
        return `<span data-value="${row.id}">${value}</span>`;
      },
    },
    {
      ...defaultCol(9, "actionMenu", "Actions"),
      orderable: false,
      className: "td-actions px-3",
      render: (data: IActionMenu[], _, row: IActionItem) => {
        let actions = `
          <li>
            <a href="#" data-action="View" data-actionItemId="${row.id}">View</a>
          </li>`;
        data.forEach((item: IActionMenu) => {
          actions += `
            <li>
              <a href="#" data-action="${item.id}" data-actionItemId="${row.id}">${item.description}</a>
            </li>`;
        });

        return `
          <button mat-raised-button href="#" class="btn btn-info btn-link" data-toggle="dropdown">
            <i class="material-icons">more_horiz</i>
          </button>
          <ul class="dropdown-menu dropdown-menu-right">
            ${actions}
          </ul>`;
      },
    },
  ];
  actionStatus: string = "open";
  actionType: string = "all";
  // get filteredData(): IActionItem[] {
  //   let data = this._data.filter((item) => item.status === this.actionStatus);
  //   if (this.actionType !== "all") {
  //     return data.filter((item) => item.itemTypeId === this.actionType);
  //   }

  //   return data;
  // }
  filteredData: IActionItem[] = [];
  private _data: IActionItem[] = [];

  selectedActionItem: IActionItem | undefined;
  isAttachment: boolean = false;
  logModalId: string = "actionCenterLogModal";

  actionsModalId: string = "actionCenterMenuModal";

  constructor(
    private _datePipe: DatePipe,
    private _currencyPipe: CurrencyPipe,
    private _actionCenterService: ActionCenterService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._getActionItems();
  }

  ngAfterViewInit(): void {
    const self = this;
    $(`#${this.tableId}`).on(
      "click",
      "td.td-actions .dropdown-menu a",
      function (e: Event) {
        e.preventDefault();

        const action = $(this).data("action");
        self.selectedActionItem = self._data.find(
          (item) => item.id === $(this).data("actionitemid")
        );

        self.onClickMenu(action);
      }
    );
  }

  filterData(): void {
    this.filteredData = this._data.filter(
      
      (item) => item.status === this.actionStatus,
      console.log("Filtering data with status:", this.actionStatus)
    );

    if (this.actionType !== "all") {
      this.filteredData = this.filteredData.filter(
        (item) => item.itemTypeId === this.actionType
      );
    }
  }

  onClickMenu(action: string): void {
    switch (action) {
      case "View":
        this._viewItem();
        break;
      case "AddLog":
        $(`#${this.actionsModalId}`).modal("hide");
        $(`#${this.logModalId}`).modal("show");
        break;
      case "AddAttachment":
        $(`#${this.actionsModalId}`).modal("hide");
        $(`#${this.logModalId}Files`).trigger("click");
        this.isAttachment = true;
        break;
      default:
        this._saveActionMenu(action);
        break;
    }
  }

  onSaveLogFile(e: { log?: IActionLog; attachments?: IFile[] }): void {
    if (e.log) {
      this.selectedActionItem.log = [...this.selectedActionItem.log, e.log];
    }

    if (e.attachments?.length > 0) {
      this.selectedActionItem.attachments = [
        ...this.selectedActionItem.attachments,
        ...e.attachments,
      ];
    }

    this._saveActionItem(this.selectedActionItem);
  }

  private _getActionItems(): void {
    this._actionCenterService.getAll<IActionItem[]>().subscribe({
      next: (res) => {
        this._data = res;
        this.filterData();
      },
      error: () => {
        this._data = [];
        this.filteredData = [];
      },
    });
  }

  private _viewItem(): void {
    this._router.navigate([
      `/backoffice/action-center/${this.selectedActionItem.id}/view`,
    ]);
  }

  private _saveActionMenu(action: string): void {
    this._actionCenterService
      .action<IActionItem>({
        actionItemId: this.selectedActionItem.id,
        action,
      })
      .subscribe({
        next: (res) => {
          const index = this._data.findIndex((item) => item.id === res.id);
          if (index > -1) {
            this._data[index] = res;
            this._data = [...this._data];
          }
          this.filterData();
          this.selectedActionItem = undefined;
          this.isAttachment = false;
          $(`#${this.actionsModalId}`).modal("hide");
        },
      });
  }

  private _saveActionItem(item: IActionItem): void {
    this._actionCenterService.save<IActionItem>(item).subscribe({
      next: (res: IActionItem) => {
        const index = this._data.findIndex(
          (item) => item.id === this.selectedActionItem.id
        );
        if (index > -1) {
          this._data[index] = res;
          this._data = [...this._data];
        }
        this.filterData();
        this.selectedActionItem = undefined;
        this.isAttachment = false;
      },
    });
  }

  private _openActionMenuModal(actionItem: IActionItem): void {
    this.selectedActionItem = actionItem;
    $(`#${this.actionsModalId}`).modal("show");
  }
}
