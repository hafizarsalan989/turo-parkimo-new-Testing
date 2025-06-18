import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { of, switchMap } from "rxjs";
import { ISession } from "src/app/host/vehicles/models/vehicle-session.model";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import { ImgService } from "src/app/shared/services/img/img.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SessionService } from "src/app/shared/services/session/session.service";

declare const $: any;

@Component({
  selector: "app-session-close-modal",
  templateUrl: "./session-close-modal.component.html",
  styleUrls: ["./session-close-modal.component.scss"],
})
export class SessionCloseModalComponent implements OnInit {
  @Input() session: ISession | null;
  @Output() closed: EventEmitter<ISession> = new EventEmitter<ISession>();

  form: FormGroup;
  loading: boolean = false;
  userType: string;
  file: Blob;

  constructor(
    private sessionService: SessionService,
    private vehicleService: VehicleService,
    private imgService: ImgService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      sessionId: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
    });

    this.sessionService.getUser$().subscribe((user) => {
      this.userType = user?.turoUserType;
    });

    $("#sessionCloseModal").on("shown.bs.modal", () => {
      this.file = null;
      this.form.patchValue({
        sessionId: this.session.id,
        reason: "",
      });
    });
  }

  onChangeFile(e: any): void {
    if (e.target.files && e.target.files[0]) {
      this.file = e.target.files[0];
    }
  }

  request(): void {
    this.loading = true;

    this.vehicleService
      .requestParkingSessionClose(this.form.value)
      .pipe(
        switchMap((res: ISession) => {
          const formdata = new FormData();
          formdata.append("file", this.file as Blob);
          formdata.append("ReferenceId", res.id);
          formdata.append("ReferenceType", "parkingsession");

          return this.imgService
            .uploadFile(formdata)
            .pipe(switchMap(() => of(res)));
        })
      )
      .subscribe({
        next: (res: ISession) => {
          this.notificationService.notify(
            "notification",
            "success",
            this.userType === "backoffice"
              ? "Session closed"
              : "Session close requested"
          );
          this.loading = false;
          $("#sessionCloseModal").modal("hide");
          this.closed.emit(res);
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
