import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { forkJoin, of } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";
import { HostManagementService } from "src/app/backoffice/host-management/services/host-management.service";
import { INote } from "src/app/backoffice/tag-shipping/models/note.model";
import { IFile } from "src/app/shared/models/file.model";
import { IUser } from "src/app/shared/models/user.model";
import { ImgService } from "src/app/shared/services/img/img.service";
import { SessionService } from "src/app/shared/services/session/session.service";

declare const $: any;

@Component({
  selector: "app-notes-modal",
  templateUrl: "./notes-modal.component.html",
  styleUrls: ["./notes-modal.component.scss"],
})
export class NotesModalComponent implements OnInit {
  @Input() referenceId: string | undefined;
  @Input() noteType: string | undefined;
  @Input() isPreview: boolean = false;
  @Output() created: EventEmitter<INote> = new EventEmitter();

  editor = ClassicEditor;
  config = {
    toolbar: {
      removeItems: ["link", "uploadImage", "mediaEmbed"],
    },
  };
  messageCtrl = new FormControl("", [Validators.required]);
  files: FileList | undefined;
  fileNames: string[] = [];

  notes: INote[] = [];

  private user: IUser | undefined;

  constructor(
    private hostManagementService: HostManagementService,
    private sessionService: SessionService,
    private fileService: ImgService
  ) {}

  ngOnInit(): void {
    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
    });
    if (this.isPreview) {
      $("#notesModal").on("shown.bs.modal", () => {
        if (this.referenceId && this.noteType) {
          this.getNote();
        }
      });
    }
    $("#notesModal").on("hidden.bs.modal", () => {
      this.notes = [];
      this.fileNames = [];
    });
  }

  onAttach(): void {
    $("#noteFiles").trigger("click");
  }

  onSelecteFiles(event: Event): void {
    this.files = event.target["files"];
    this.fileNames = Array.from(this.files).map((file) => file["name"]);
  }

  onDeleteFile(name: string): void {
    const index = this.fileNames.findIndex((fileName) => fileName === name);
    this.fileNames.splice(index, 1);
  }

  onSave(): void {
    const payload = {
      userEmail: this.user.email,
      message: this.messageCtrl.value,
      noteType: this.noteType,
      referenceType: "company",
      referenceId: this.referenceId,
    };

    this.hostManagementService
      .saveNote<INote>(payload)
      .pipe(
        switchMap((res: INote) => {
          if (this.fileNames.length > 0) {
            const reqs = [];
            for (let i = 0; i < this.files.length; i++) {
              const file = this.files.item(i);
              const index = this.fileNames.findIndex(
                (name) => name === file.name
              );
              if (index > -1) {
                const formdata = new FormData();
                formdata.append("file", file as Blob);
                formdata.append("name", file.name);
                formdata.append("referenceId", res.id);
                formdata.append("referenceType", "note");

                reqs.push(this.fileService.uploadFile(formdata));
              }
            }

            return forkJoin(reqs).pipe(
              switchMap((files: IFile[]) => of({ ...res, files }))
            );
          } else {
            return of(res);
          }
        })
      )
      .subscribe({
        next: (res) => {
          this.notes = [...this.notes, res];
          this.messageCtrl.setValue("");
          this.fileNames = [];
          if (!this.isPreview) {
            this.created.emit(res);
          }
        },
      });
  }

  onDownload(file: IFile): void {
    const aTag = document.createElement("a");
    aTag.href = file.url;
    aTag.target = "_blank";
    aTag.download = file.name;
    aTag.click();
  }

  private getNote(): void {
    this.hostManagementService
      .getNote<INote[]>({
        referenceType: "company",
        referenceId: this.referenceId,
        noteType: this.noteType,
      })
      .pipe(
        switchMap((notes: INote[]) => {
          const reqs = notes.map((note) =>
            this.fileService
              .getFiles<IFile>(note.id, "note")
              .pipe(catchError(() => of([])))
          );
          return forkJoin(reqs).pipe(
            switchMap((files: IFile[][]) =>
              of(notes.map((note, index) => ({ ...note, files: files[index] })))
            )
          );
        })
      )
      .subscribe({
        next: (res) => {
          this.notes = res;
        },
        error: () => {
          this.notes = [];
        },
      });
  }
}
