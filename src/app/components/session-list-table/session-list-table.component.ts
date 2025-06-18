import { Component, Input, OnChanges } from "@angular/core";
import * as moment from "moment";
import { ISession } from "src/app/host/vehicles/models/vehicle-session.model";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import { IColumnDef, IDatatableAction } from "../datatable/datatable.component";
import { defaultCol } from "../datatable/datatable.helper";
import { DatePipe } from "@angular/common";

declare const $: any;

@Component({
  selector: "app-session-list-table",
  templateUrl: "./session-list-table.component.html",
  styleUrls: ["./session-list-table.component.scss"],
})
export class SessionListTableComponent implements OnChanges {
  @Input() type: "vehicle" | "company" = "vehicle";
  @Input() id: string;
  @Input() tableId = "sessionsDatatable";

  columnDefs: IColumnDef[] = [];
  actions: IDatatableAction[] = [
    {
      name: "view",
      icon: "visibility",
      className: "btn-info",
      title: "View",
      callback: this.viewActivityDetail.bind(this),
    },
    {
      name: "close",
      icon: "highlight_off",
      className: "btn-success",
      title: "Request session close",
      enabled: [{
        key: "status",
        value: ["active"],
      }],
      callback: this.requestClose.bind(this),
    },
  ];

  sessions: ISession[] = [];
  selectedSession: ISession | null;

  constructor(
    private datePipe: DatePipe,
    private vehicleService: VehicleService
  ) {}

  ngOnChanges(): void {
    this.columnDefs =
      this.type === "vehicle"
        ? [
            defaultCol(0, "facility.name", "Facility"),
            {
              ...defaultCol(1, "entryStamp", "Entry"),
              render: (data) => {
                return `<span class='d-none'>${this.datePipe.transform(
                  data,
                  "yyyy/MM/dd hh:mm"
                )}</span>${this.datePipe.transform(
                  data,
                  "MM/dd/yyyy hh:mm a"
                )}`;
              },
            },
            {
              ...defaultCol(2, "exitStamp", "Exit"),
              render: (data) => {
                if (!data) {
                  return "";
                }

                return `<span class='d-none'>${this.datePipe.transform(
                  data,
                  "yyyy/MM/dd hh:mm"
                )}</span>${this.datePipe.transform(
                  data,
                  "MM/dd/yyyy hh:mm a"
                )}`;
              },
            },
          ]
        : [
            defaultCol(0, "facility.name", "Facility"),
            defaultCol(1, "vehicle.name", "Vehicle"),
            {
              ...defaultCol(2, "entryStamp", "Entry"),
              render: (data) => {
                return `<span class='d-none'>${this.datePipe.transform(
                  data,
                  "yyyy/MM/dd hh:mm"
                )}</span>${this.datePipe.transform(
                  data,
                  "MM/dd/yyyy hh:mm a"
                )}`;
              },
            },
            {
              ...defaultCol(3, "exitStamp", "Exit"),
              render: (data) => {
                if (!data) {
                  return "";
                }

                return `<span class='d-none'>${this.datePipe.transform(
                  data,
                  "yyyy/MM/dd hh:mm"
                )}</span>${this.datePipe.transform(
                  data,
                  "MM/dd/yyyy hh:mm a"
                )}`;
              },
            },
          ];
    this.getParkingSessions();
  }

  private getParkingSessions(): void {
    if (this.id) {
      this.vehicleService
        .getParkingSessionsById<ISession[]>(this.id, this.type)
        .subscribe({
          next: (res: ISession[]) =>
            (this.sessions = res.sort((a, b) =>
              moment(a.entryStamp).isBefore(moment(b.entryStamp)) ? 1 : -1
            )),
          error: () => (this.sessions = []),
        });
    }
  }

  viewActivityDetail(sessionId: string): void {
    this.selectedSession = this.sessions.find((s) => s.id === sessionId);

    setTimeout(() => {
      $("#vehicleActivityModal").modal("show");
    }, 0);
  }

  requestClose(sessionId: string): void {
    this.selectedSession = this.sessions.find((s) => s.id === sessionId);

    setTimeout(() => {
      $("#sessionCloseModal").modal("show");
    }, 0);
  }

  onClosedSession(session: ISession): void {
    const index = this.sessions.findIndex((s) => s.id === session.id);
    if (index > -1) {
      this.sessions[index] = session;
      this.sessions = [...this.sessions];
    }
  }
}
