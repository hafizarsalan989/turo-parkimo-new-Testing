import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { ManagementService } from "../../services/management.service";
import { IDocument } from "../../models/document.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-document",
  templateUrl: "./document.component.html",
  styleUrls: ["./document.component.scss"],
})
export class DocumentComponent implements OnInit {
  documentType: string = "Terms of Service";
  columnDefs: ITableColumnDef[] = [
    {
      field: "activeDate",
      title: "Active Date",
      format: {
        type: "date",
      },
    },
    {
      field: "version",
      title: "Version",
    },
    {
      field: "description",
      title: "Description",
    },
  ];
  tableData: ITableData | undefined;

  documentForm: FormGroup;
  currentMajorVersion: number | undefined;
  currentMinorVersion: number | undefined;
  minDate = new Date();

  constructor(
    private managementService: ManagementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.documentForm = new FormGroup(
      {
        documentType: new FormControl(this.documentType),
        majorVersion: new FormControl(0, [Validators.required]),
        minorVersion: new FormControl(0, [Validators.required]),
        activeDate: new FormControl("", [Validators.required]),
        description: new FormControl("", [Validators.required]),
      },
      {
        validators: this._checkVersion(),
      }
    );

    this.getDocuments();

    $("#newVersionDocModal").on("hidden.bs.modal", () => {
      this.documentForm.reset({
        documentType: this.documentType,
        majorVersion: this.currentMajorVersion,
        minorVersion: this.currentMinorVersion + 1,
      });

      Object.keys(this.documentForm.controls).forEach((key) => {
        this.documentForm.get(key).setErrors(null);
      });
    });
  }

  getDocuments(): void {
    this.managementService
      .getDocumentByType<IDocument[]>(this.documentType)
      .subscribe({
        next: (res) => {
          const tempArr = res.map((doc) => ({
            ...doc,
            version: `${doc.majorVersion}.${doc.minorVersion}`,
          }));

          this.tableData = { totalRows: res.length, rows: tempArr };
          this.documentForm.get("documentType").setValue(this.documentType);

          if (res.length > 0) {
            const latestDocument = res.reduce(
              (max, item) => {
                if (
                  item.majorVersion > max.majorVersion ||
                  (item.majorVersion === max.majorVersion &&
                    item.minorVersion > max.minorVersion)
                ) {
                  return item;
                }

                return max;
              },
              { majorVersion: -Infinity, minorVersion: -Infinity }
            );

            this.currentMajorVersion = latestDocument.majorVersion;
            this.currentMinorVersion = latestDocument.minorVersion;
            this.documentForm
              .get("majorVersion")
              .setValue(this.currentMajorVersion);
            this.documentForm
              .get("minorVersion")
              .setValue(this.currentMinorVersion + 1);
          } else {
            this.currentMajorVersion = undefined;
            this.currentMinorVersion = undefined;
            this.documentForm.get("majorVersion").setValue(0);
            this.documentForm.get("minorVersion").setValue(1);
          }
        },
        error: () => {
          this.tableData = undefined;
        },
      });
  }

  saveDocument(): void {
    if (this.documentForm.invalid) return;

    this.managementService.saveDocument(this.documentForm.value).subscribe({
      next: (res: IDocument) => {
        this.notificationService.notify("", "success", "Version was updated");

        const { majorVersion, minorVersion, ...rest } = res;

        const temp = {
          ...rest,
          version: `${majorVersion}.${minorVersion}`,
        };

        this.tableData = {
          totalRows: this.tableData.totalRows + 1,
          rows: [...this.tableData.rows, temp],
        };

        $("#newVersionDocModal").modal("hide");

        this.currentMajorVersion = majorVersion;
        this.currentMinorVersion = minorVersion;
      },
    });
  }

  private _checkVersion(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const majorVersion = control.get("majorVersion").value;
      const minorVersion = control.get("minorVersion").value;

      if (
        !majorVersion ||
        !minorVersion ||
        majorVersion < this.currentMajorVersion ||
        (majorVersion === this.currentMajorVersion &&
          minorVersion <= this.currentMinorVersion)
      ) {
        return { version: true };
      }

      return null;
    };
  }
}
