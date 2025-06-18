import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

import { ActionCenterService } from "../../services/action-center.service";
import { IActionItem, IActionLog } from "../../models/action-item.model";
import { IFile } from "src/app/shared/models/file.model";

declare const $: any;

@Component({
  selector: "app-action-center",
  templateUrl: "./action-center.component.html",
  styleUrls: ["./action-center.component.scss"],
})
export class ActionCenterComponent implements OnInit {
  private _id: string | undefined;

  actionItem: IActionItem | undefined;
  logSearch: string | undefined;

  get filteredLogs(): IActionLog[] {
    return this.logSearch ? this.actionItem?.log.filter(
      (log) =>
        log.emailAddress?.toLowerCase().includes(this.logSearch) ||
        log.message?.toLowerCase().includes(this.logSearch)
    ) : this.actionItem?.log ?? [];
  }

  logModalId: string = "actionCenterLogModal";
  isAttachment: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _actionCenterService: ActionCenterService,
    private location: Location
  ) {
    this._id = this._activatedRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this._getActionItem();
  }

  back(): void {
    this.location.back();
  }

  onClickMenu(action: string): void {
    switch (action) {
      case "AddLog":
        $(`#${this.logModalId}`).modal("show");
        break;
      case "AddAttachment":
        this.openLogFileDialog();
        break;
      default:
        this._saveActionMenu(action);
        break;
    }
  }

  openLogFileDialog(): void {
    $(`#${this.logModalId}Files`).trigger("click");
    this.isAttachment = true;
  }

  onSaveLogFile(e: { log?: IActionLog; attachments?: IFile[] }): void {
    if (e.log) {
      this.actionItem.log = [...this.actionItem.log, e.log];
    }

    if (e.attachments?.length > 0) {
      this.actionItem.log = [
        ...this.actionItem.log,
        {
          message: `File ${e.attachments
            .map((a) => a.name)
            .join(", ")} was uploaded`,
          emailAddress: e.attachments[0].uploadedEmail,
        },
      ];
      this.actionItem.attachments = [
        ...this.actionItem.attachments,
        ...e.attachments,
      ];
    }

    this._saveActionItem(this.actionItem);
  }

  private _getActionItem(): void {
    this._actionCenterService.getById<IActionItem>(this._id).subscribe({
      next: (item: IActionItem) => {
        this.actionItem = item;
      },
    });
  }

  private _saveActionItem(item: IActionItem): void {
    this._actionCenterService.save<IActionItem>(item).subscribe({
      next: (item: IActionItem) => {
        this.actionItem = item;
        this.isAttachment = false;
      },
    });
  }

  private _saveActionMenu(action: string): void {
    this._actionCenterService
      .action<IActionItem>({
        actionItemId: this.actionItem.id,
        action,
      })
      .subscribe({
        next: (res) => {
          this.actionItem = res;
        },
      });
  }
}
