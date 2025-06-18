import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { AviTagService } from "src/app/backoffice/tag-shipping/services/avi-tag.service";
import {
  IHost,
  IMailingPreferenceOption,
} from "src/app/host/models/host.model";
import { IPermit } from "src/app/shared/models/parking-pass.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { of, switchMap } from "rxjs";
import { IBase } from "src/app/shared/models/base.model";
import { HostManagementService } from "src/app/backoffice/host-management/services/host-management.service";

declare const $: any;

@Component({
  selector: "app-permit-replace-tag-modal",
  templateUrl: "./permit-replace-tag-modal.component.html",
  styleUrls: ["./permit-replace-tag-modal.component.scss"],
})
export class PermitReplaceTagModalComponent implements OnChanges {
  @Input() modalId: string = "permitReplaceTagModal";
  @Input() companyId: string;
  @Input() permitId: string;
  @Input() prevTag: string | undefined;
  @Output() replace: EventEmitter<IPermit> = new EventEmitter<IPermit>();

  host: IHost | undefined;
  tags: string[] = [];
  tag: string | undefined;
  isManual: boolean = false;

  constructor(
    private aviTagService: AviTagService,
    private hostManagementService: HostManagementService,
    private notificationService: NotificationService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["companyId"]?.currentValue) {
      this.getAssignedTags();
    }
  }

  getAssignedTags(): void {
    this.hostManagementService
      .getAssignedTagsByCompanyId<IAssignedTag[]>(this.companyId)
      .subscribe({
        next: (res) => {
          this.tags = res.map((item) => item.tag);
        },
        error: () => {
          this.tags = [];
        },
      });
  }

  replaceTag(): void {
    const req1 = this.aviTagService.refresh({
      fastPassId: this.permitId,
      tag: this.tag,
    });

    const req2 = this.hostManagementService
      .validateTags<IValidTag[]>({
        tags: [this.tag],
      })
      .pipe(
        switchMap((res) => {
          if (res[0].isValidated) {
            return req1;
          } else {
            return of(null);
          }
        })
      );

    (this.isManual ? req2 : req1).subscribe({
      next: (res: IPermit | null) => {
        if (!res) {
          this.notificationService.notify(
            "notification",
            "warning",
            "Invalid tag(s), see below for which ones and correct"
          );
        } else {
          this.notificationService.notify(
            "notification",
            "success",
            `Tag was ${this.prevTag ? "replaced" : "assigned"}`
          );
          this.replace.emit(res);
          $(`#${this.modalId}`).modal("hide");
          const index = this.tags.findIndex((tag) => tag === this.tag);
          if (this.prevTag) {
            this.tags.splice(index, 1, this.prevTag);
          } else {
            this.tags.splice(index, 1);
          }
        }
      },
    });
  }
}

export interface IAssignedTag extends IBase {
  companyId: string;
  tag: string;
  tagTypeId: string;
  status: string;
  shippingOption: IMailingPreferenceOption;
}

export interface IValidTag {
  isValidated: boolean;
  tag: string;
}
