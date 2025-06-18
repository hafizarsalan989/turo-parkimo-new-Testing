import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { HostManagementService } from "src/app/backoffice/host-management/services/host-management.service";
import { IPermit } from "src/app/shared/models/parking-pass.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-cancel-permit-modal",
  templateUrl: "./cancel-permit-modal.component.html",
  styleUrls: ["./cancel-permit-modal.component.scss"],
})
export class CancelPermitModalComponent implements OnInit {
  @Input() modalId: string = "cancelPermitModal";
  @Input() permit: IPermit;
  @Output() cancel: EventEmitter<IPermit> = new EventEmitter<IPermit>();

  constructor(
    private hostManagementService: HostManagementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {}

  cancelPermit(): void {
    this.hostManagementService.cancelParkingPass(this.permit.id).subscribe({
      next: (res: IPermit) => {
        this.notificationService.notify(
          "notification",
          "success",
          "Subscription was canceled"
        );
        this.cancel.emit(res);
        $(`#${this.modalId}`).modal("hide");
      },
    });
  }
}
