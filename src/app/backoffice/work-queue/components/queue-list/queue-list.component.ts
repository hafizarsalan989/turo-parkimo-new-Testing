import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  IColumnDef,
  IDatatableAction,
} from "src/app/components/datatable/datatable.component";
import { defaultCol } from "src/app/components/datatable/datatable.helper";
import { IWorkQueue } from "../../models/work-queue.model";
import { WorkQueueService } from "../../services/work-queue.service";

@Component({
  selector: "app-queue-list",
  templateUrl: "./queue-list.component.html",
  styleUrls: ["./queue-list.component.scss"],
})
export class QueueListComponent implements OnInit {
  tableId = "backofficeWorkQueueDatatable";
  columnDefs: IColumnDef[] = [
    defaultCol(0, "action", "Action Needed"),
    {
      ...defaultCol(1, "created", "Date Requested"),
      render: (data) => {
        return `<span class='d-none'>${this.datePipe.transform(
          data,
          "yyyy/MM/dd hh:mm"
        )}</span>${this.datePipe.transform(data, "MM/dd/yyyy hh:mm a")}`;
      },
    },
    defaultCol(2, "facility.name", "Facility"),
    defaultCol(3, "host.companyName", "Turo Host"),
    defaultCol(4, "vehicle.name", "Vehicle"),
  ];
  actions: IDatatableAction[] = [
    {
      name: "edit",
      icon: "edit",
      className: "btn-success",
      title: "Edit",
      callback: this.edit.bind(this),
    },
    {
      name: "view",
      icon: "visibility",
      className: "btn-info",
      title: "View",
      callback: this.viewHost.bind(this),
      enabled: [{
        key: "referenceType",
        value: ["host"],
      }],
    },
  ];

  workQueues: IWorkQueue[] = [];

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private workQueueService: WorkQueueService
  ) {}

  ngOnInit(): void {
    this.getWorkQueues();
  }

  private getWorkQueues(): void {
    this.workQueueService.getWorkQueues<IWorkQueue[]>().subscribe({
      next: (workQueues: IWorkQueue[]) => (this.workQueues = workQueues),
    });
  }

  edit(id: string): void {
    this.router.navigate([`/backoffice/work-queue/${id}/view`]);
  }

  viewHost(id: string): void {
    const queue = this.workQueues.find((workQueue) => workQueue.id === id);
    this.router.navigate([
      `backoffice/host-management/${queue.referenceId}/view`,
    ]);
  }
}
