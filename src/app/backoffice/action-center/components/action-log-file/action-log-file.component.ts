import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { forkJoin } from "rxjs";

import { IActionLog } from "../../models/action-item.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IUser } from "src/app/shared/models/user.model";
import { ImgService } from "src/app/shared/services/img/img.service";
import { IFile } from "src/app/shared/models/file.model";

declare const $: any;

@Component({
  selector: "app-action-log-file",
  templateUrl: "./action-log-file.component.html",
  styleUrls: ["./action-log-file.component.scss"],
})
export class ActionLogFileComponent implements OnInit {
  @Input() actionItemId: string | undefined;
  @Input() isAttachment: boolean = false;
  @Input() logModalId: string = "actionCenterLogModal";
  @Output() saved: EventEmitter<{ log?: IActionLog; attachments?: IFile[] }> =
    new EventEmitter();

  messageCtrl = new FormControl("", [Validators.required]);
  editor = ClassicEditor;
  config = {
    toolbar: {
      removeItems: ["link", "uploadImage", "mediaEmbed"],
    },
  };
  files: FileList | undefined;
  fileNames: string[] = [];

  private _user: IUser | undefined;

  constructor(
    private _sessionService: SessionService,
    private _fileService: ImgService
  ) {}

  ngOnInit(): void {
    this._sessionService.getUser$().subscribe((user) => {
      this._user = user;
    });
  }

  openLogFileDialog(): void {
    $(`#${this.logModalId}Files`).trigger("click");
  }

  onSelectLogFiles(event: Event): void {
    this.files = event.target["files"];
    this.fileNames = Array.from(this.files).map((file) => file["name"]);

    if (this.isAttachment && this.fileNames.length > 0) {
      this._saveFiles(this.files);
    }
  }

  onDeleteFile(name: string): void {
    const index = this.fileNames.findIndex((fileName) => fileName === name);
    this.fileNames.splice(index, 1);
  }

  onSaveLog(): void {
    const log: IActionLog = {
      emailAddress: this._user.email,
      message: this.messageCtrl.value,
    };

    if (this.fileNames.length > 0) {
      this._saveFiles(this.files, log);
    } else {
      this.saved.emit({ log });
    }

    $(`#${this.logModalId}`).modal("hide");
  }

  private _saveFiles(files: FileList, log?: IActionLog): void {
    const reqs = [];
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      const index = this.fileNames.findIndex((name) => name === file.name);

      if (index > -1) {
        const formdata = new FormData();

        formdata.append("file", file as Blob);
        formdata.append("name", file.name);
        formdata.append("referenceId", this.actionItemId);
        formdata.append("referenceType", "actionCenter");

        reqs.push(this._fileService.uploadFile<IFile[]>(formdata));
      }
    }

    forkJoin(reqs).subscribe({
      next: (res) => {
        this.saved.emit({ attachments: res, log });
        this.files = undefined;
        this.fileNames = [];
        this.messageCtrl.setValue("");
      },
    });
  }
}
