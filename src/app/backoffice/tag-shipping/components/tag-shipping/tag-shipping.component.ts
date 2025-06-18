import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { IAviCredential } from "../../models/aviCredential.model";
import { AviTagService } from "../../services/avi-tag.service";
import { IHost } from "src/app/host/models/host.model";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-tag-shipping",
  templateUrl: "./tag-shipping.component.html",
  styleUrls: ["./tag-shipping.component.scss"],
})
export class TagShippingComponent implements OnInit {
  credentials: IAviCredential[] = [];
  startTags: Record<string, number> = {};
  trackingLinks: Record<string, number> = {};

  referenceId: string | undefined;

  constructor(
    private router: Router,
    private aviTagService: AviTagService,
    private swalService: SwalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  private getData(): void {
    this.aviTagService.management<IAviCredential[]>().subscribe({
      next: (res) => {
        this.credentials = res;
      },
      error: () => {
        this.credentials = [];
      },
    });
  }

  fullAddress(company: IHost): string {
    const { companyName, mailingAddress } = company;
    const { address1, address2, attention, city, state, zip } = mailingAddress;

    let result = `${companyName ?? ""}`;
    if (attention) {
      result += `\nAttention: ${attention}`;
    }

    if (address1) {
      result += `\n${address1}`;
    }

    if (address2) {
      result += `\n${address2}`;
    }

    if (city) {
      result += `\n${city}, `;
    } else {
      result += "\n";
    }

    result += `${state} ${zip}`;

    return result.trim();
  }

  toggle(companyId: string): void {
    this.startTags[companyId] = null;

    const index = this.credentials.findIndex(
      (credential) => credential.company.id === companyId
    );
    if (index > -1) {
      this.credentials[index].tags.forEach((tag, i) => {
        tag.tag = null;
      });
    }
  }

  fillTag(companyId: string): void {
    const index = this.credentials.findIndex(
      (credential) => credential.company.id === companyId
    );
    if (index > -1) {
      this.credentials[index].tags.forEach((tag, i) => {
        tag.tag = `${this.startTags[companyId] + i}`;
      });
    }
  }

  hasAllTag(credential: IAviCredential): boolean {
    return credential?.tags.every((tag) => tag.tag);
  }

  print(credential: IAviCredential): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(["/external/print-tag-mailer"])
    );
    const newWin = window.open(url, "_blank");
    newWin["credential"] = credential;
  }

  mail(credential: IAviCredential): void {
    this.aviTagService
      .mailed({
        tags: credential.tags,
        trackingLink: this.trackingLinks[credential.company.id],
      })
      .subscribe({
        next: () => {
          const index = this.credentials.findIndex(
            (c) => c.company.id === credential.company.id
          );

          this.credentials.splice(index, 1);
        },
      });
  }

  cancel(credential: IAviCredential, index: number): void {
    this.swalService.fire(
      `Are you sure you want to delete the mailing and remove the tags`,
      "Warning",
      "warning",
      "Yes",
      "No",
      true,
      () => {
        this.aviTagService.cancel({ tags: credential.tags }).subscribe({
          next: () => {
            this.notificationService.notify(
              "notification",
              "success",
              "Order was canceled successfully"
            );

            this.credentials.splice(index, 1);
          },
        });
      }
    );
  }

  onNote(credential: IAviCredential): void {
    this.referenceId = credential.company.id;
    $("#notesModal").modal({ focus: false, show: true });
  }
}
