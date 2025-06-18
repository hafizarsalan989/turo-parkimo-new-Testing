import { Location } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IPermit } from "src/app/shared/models/parking-pass.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { IWorkQueue } from "../../models/work-queue.model";
import { ImgService } from "src/app/shared/services/img/img.service";
import { IFile } from "src/app/shared/models/file.model";
import { IImage } from "src/app/components/img-viewer/img-viewer.component";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { WorkQueueService } from "../../services/work-queue.service";

declare const $: any;

@Component({
  selector: "app-queue-view",
  templateUrl: "./queue-view.component.html",
  styleUrls: ["./queue-view.component.scss"],
})
export class QueueViewComponent implements OnInit {
  @Input() workQueueId: string;

  workQueue: IWorkQueue;
  historyData: IPermit[] = [];
  files: IFile[] = [];
  showPreview = false;
  previewFiles: IImage[] = [];

  rejectForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private workQueueService: WorkQueueService,
    private vehicleService: VehicleService,
    private location: Location,
    private notificationService: NotificationService,
    private imgService: ImgService,
    private swalService: SwalService
  ) {
    this.workQueueId = this.activatedRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.rejectForm = new FormGroup({
      message: new FormControl("", Validators.required),
    });

    this.getWorkQueue();
  }

  private getWorkQueue(): void {
    this.workQueueService
      .getWorkQueueById<IWorkQueue>(this.workQueueId)
      .subscribe({
        next: (workQueue: IWorkQueue) => {
          this.workQueue = workQueue;
          this.getParkingPassHistory();
          this.getAttachments();
        },
      });
  }

  private getParkingPassHistory(): void {
    this.vehicleService
      .getParkingPassSubscriptionsByVehicleId<IPermit[]>(
        this.workQueue.vehicle.id
      )
      .subscribe({
        next: (data: IPermit[]) => (this.historyData = data),
        error: () => (this.historyData = null),
      });
  }

  private getAttachments(): void {
    this.imgService
      .getFiles<IFile>(this.workQueue.referenceId, this.workQueue.referenceType)
      .subscribe({
        next: (res) => {
          this.files = res.map((f) => {
            const thumbnailUrl = f.url.includes(".pdf")
              ? "assets/img/pdf.png"
              : f.thumbnailUrl
              ? f.thumbnailUrl
              : f.url;
            return { ...f, thumbnailUrl };
          });
        },
        error: () => {
          this.files = [];
          this.previewFiles = [];
        },
      });
  }

  onPreview(file: IFile): void {
    if (!file.url.includes(".pdf")) {
      this.previewFiles = [{ image: file.url }];
      this.showPreview = true;
    } else {
      const aTag = document.createElement("a");
      aTag.href = file.url;
      aTag.target = "_blank";
      aTag.download = "Parking_Session.pdf";
      aTag.click();
    }
  }

  onConfirm(): void {
    this.swalService.fire(
      `Sure you want to confirm it?`,
      "Warning",
      "warning",
      "Yes, confirm it",
      "No",
      true,
      () => {
        this.saveStatus(false);
      }
    );
  }

  onReject(): void {
    $("#workQueueRejectModal").modal("show");
  }

  saveStatus(status: boolean, message?: string): void {
    this.workQueueService
      .saveWorkQueueStatus({ backofficeActivityId: this.workQueue.id, status, message })
      .subscribe({
        next: () => {
          this.notificationService.notify(
            "notification",
            "success",
            `Action is ${status ? "completed" : "reject"}`
          );
          this.close();
        },
      });
  }

  close(): void {
    this.location.back();
  }
}
