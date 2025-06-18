import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ITableColumnDef, ITableData } from "../table/table.model";
import { switchMap, catchError, of, forkJoin } from "rxjs";
import { IFile } from "src/app/shared/models/file.model";
import { ImgService } from "src/app/shared/services/img/img.service";
import { INote } from "src/app/backoffice/tag-shipping/models/note.model";
import { HostManagementService } from "src/app/backoffice/host-management/services/host-management.service";

declare const $: any;

@Component({
  selector: "app-host-note-list-table",
  templateUrl: "./host-note-list-table.component.html",
  styleUrls: ["./host-note-list-table.component.scss"],
})
export class HostNoteListTableComponent implements OnChanges {
  @Input() companyId: string | undefined;

  columnDefs: ITableColumnDef[] = [
    { field: "userEmail", title: "Email" },
    { field: "created", title: "Stamp", format: {type: 'date', param: 'MM/dd/yyyy hh:mm a'} },
    { field: "message", title: "Notes", format: {type: 'html'} },
    { field: "files", title: "Attaches", format: {type: 'files'} },
  ];
  tableData: ITableData | undefined;

  noteType: string = "company";

  constructor(
    private hostManagementService: HostManagementService,
    private fileService: ImgService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["companyId"]?.currentValue) {
      this.getNote();
    }
  }

  openNoteModal(): void {
    $("#notesModal").modal({ focus: false, show: true });
  }

  onCreatedNote(note: INote): void {
    this.tableData = {
      rows: [note, ...this.tableData.rows],
      totalRows: this.tableData.totalRows + 1,
    };
  }

  private getNote(): void {
    this.hostManagementService
      .getNote<INote[]>({
        referenceType: "company",
        referenceId: this.companyId,
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
          this.tableData = {
            rows: res,
            totalRows: res.length,
          };
        },
        error: () => {
          this.tableData = {
            rows: [],
            totalRows: 0,
          };
        },
      });
  }
}
