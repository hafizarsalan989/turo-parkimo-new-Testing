import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import {
  ICredential,
  ICredentialSubItem,
  IHistory,
} from "../../models/credential.model";
import { IColumnDef } from "src/app/components/datatable/datatable.component";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { defaultCol } from "src/app/components/datatable/datatable.helper";
import { ISimpleHost } from "src/app/host/models/host.model";
import { IPermit } from "src/app/shared/models/parking-pass.model";

import { ManagementService } from "../../services/management.service";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import { HostService } from "src/app/host/services/host/host.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-credentials",
  templateUrl: "./credentials.component.html",
  styleUrls: ["./credentials.component.scss"],
})
export class CredentialsComponent implements OnInit {
  readonly tableId = "credentialsDatatable";
  columnDefs: IColumnDef[] = [
    {
      ...defaultCol(0, "credential", "Credential"),
      className: "credential-value",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: ICredential) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(1, "credentialType", "Type"),
      className: "credential-type",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: ICredential) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(2, "status", "Status"),
      className: "credential-status",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: string, _: unknown, row: ICredential) => {
        return `<span data-value="${row.id}">${data ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(3, "facility", "Facility"),
      className: "facility-name",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: ICredentialSubItem, _: unknown, row: ICredential) => {
        return `<span data-value="${row.id}">${data?.name ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(4, "company", "Host"),
      className: "company-name",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: ICredentialSubItem, _: unknown, row: ICredential) => {
        return `<span data-value="${row.id}">${data?.name ?? ""}</span>`;
      },
    },
    {
      ...defaultCol(5, "vehicle", "Vehicle"),
      className: "vehicle-name",
      event: {
        type: "dblclick",
        callback: this._openActionMenuModal.bind(this),
      },
      render: (data: ICredentialSubItem, _: unknown, row: ICredential) => {
        return `<span data-value="${row.id}">${data?.name ?? ""}</span>`;
      },
    },
  ];

  historyColumnDefs: ITableColumnDef[] = [
    {
      field: "localEventTime",
      title: "Date",
      format: {
        type: "date",
        param: "MM/dd/yyyy hh:mm a",
      },
    },
    {
      field: "credentialValue",
      title: "Credential",
    },
    {
      field: "deviceName",
      title: "Device",
    },
    {
      field: "eventType",
      title: "Event",
    },
    {
      field: "facilityName",
      title: "Facility",
    },
  ];
  historyTableData: ITableData | undefined;

  searchForm: FormGroup | undefined;
  searchHostForm: FormGroup | undefined;

  actionsModalId: string = "actionCenterMenuModal";
  viewSubscriptionModalId: string = "viewSubscriptionModal";
  reassignHostModalId: string = "reassignHostModal";
  historyModalId: string = "historyModal";

  credentials: ICredential[] = [];
  selectedCredential: ICredential | undefined;
  selectedVehicle: IVehicle | undefined;
  hosts: ISimpleHost[] = [];
  selectedHost: ISimpleHost | undefined;

  constructor(
    private router: Router,
    private managementService: ManagementService,
    private swalService: SwalService,
    private notificationService: NotificationService,
    private vehicleService: VehicleService,
    private hostService: HostService
  ) {}

  ngOnInit(): void {
    this._initSearchForm();
    this._initSearchHostForm();
  }

  private _initSearchForm(): void {
    this.searchForm = new FormGroup({
      searchCriteria: new FormControl(""),
      credentialType: new FormControl("All"),
    });
  }

  private _initSearchHostForm(): void {
    this.searchHostForm = new FormGroup({
      searchHostCriteria: new FormControl(""),
    });
  }

  onSearchCredential(): void {
    this.managementService
      .searchCredential<ICredential[]>(this.searchForm.value)
      .subscribe({
        next: (res: ICredential[]) => {
          res.map((item: ICredential) => {
            if (item.credentialType === "QR" || item.credentialType === "PIN") {
              item.actionMenu = ["Expire", "History"];
            }

            if (item.credentialType === "Tag") {
              item.actionMenu = ["History"];
              if (
                item.status.toString() !== "assigned" ||
                item.status.toString() === "disabled"
              ) {
                item.actionMenu.push("Reassign Host");
              } else {
                if (item.vehicle?.id) {
                  item.actionMenu.push("View Subscription");
                }
                item.actionMenu.push("Edit Subscription");
              }
            }
          });

          this.credentials = res.map(
            ({ credential, subscription, isEnabledInIsonas, ...rest }) => ({
              id: credential,
              credential,
              ...rest,
            })
          );
        },
        error: () => (this.credentials = []),
      });
  }

  onClickMenu(action: string): void {
    switch (action) {
      case "Expire":
        this.onExpireCredential();
        break;
      case "History":
        this.onCredentialHistoryPull();
        break;
      case "Reassign Host":
        this.onReassignHost();
        break;
      case "Edit Subscription":
        this.onEditSubscription();
        break;
      case "View Subscription":
        this.onViewSubscription();
        break;
      default:
        break;
    }
  }

  onExpireCredential(): void {
    const { credential, facility, credentialType } = this.selectedCredential;

    this.managementService
      .expireCredential({
        value: credential,
        facilityId: facility?.id,
        credentialType,
      })
      .subscribe({
        next: () =>
          this.notificationService.notify(
            "notification",
            "success",
            "The credential has expired successfully"
          ),
      });
  }

  onCredentialHistoryPull(): void {
    const { credential, credentialType } = this.selectedCredential;

    this.managementService
      .getCredentialHistory<IHistory[]>({ value: credential, credentialType })
      .subscribe({
        next: (res: IHistory[]) => {
          this.historyTableData = { totalRows: res.length, rows: res };

          $(`#${this.actionsModalId}`).modal("hide");
          $(`#${this.historyModalId}`).modal("show");
        },
      });
  }

  onReassignHost(): void {
    $(`#${this.actionsModalId}`).modal("hide");
    $(`#${this.reassignHostModalId}`).modal("show");
  }

  onEditSubscription(): void {
    this.router.navigate(
      [
        `backoffice/host-management/${this.selectedCredential.company?.id}/view`,
      ],
      { queryParams: { tab: "permit" } }
    );
  }

  onViewSubscription(): void {
    this.vehicleService
      .getVehicleById<IVehicle>(this.selectedCredential.vehicle?.id)
      .subscribe({
        next: (res: IVehicle) => (this.selectedVehicle = res),
      });

    $(`#${this.actionsModalId}`).modal("hide");
    $(`#${this.viewSubscriptionModalId}`).modal("show");
  }

  onSearchHost(): void {
    const { searchHostCriteria } = this.searchHostForm.value;
    let query = "";

    if (searchHostCriteria) {
      query += `searchCriteria=${searchHostCriteria}`;
    }

    this.hostService
      .searchHostManagement<ISimpleHost[]>(`?${query}`)
      .subscribe({
        next: (res: ISimpleHost[]) => {
          this.hosts = res;
        },
      });
  }

  onChangeHost(host: ISimpleHost): void {
    this.selectedHost = host;
  }

  onAssignTag(): void {
    this.managementService
      .changeCredentialHost({
        companyId: this.selectedHost?.companyId,
        tagNumber: this.selectedCredential?.credential,
      })
      .subscribe({
        next: () => {
          this.notificationService.notify(
            "notification",
            "success",
            "Tag assigned successfully"
          );
          $(`#${this.reassignHostModalId}`).modal("hide");
        },
      });
  }

  private _openActionMenuModal(credential: ICredential): void {
    this.selectedCredential = credential;
    $(`#${this.actionsModalId}`).modal("show");
  }
}
