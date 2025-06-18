import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { IAviCredentialStatus } from "src/app/backoffice/tag-shipping/models/aviCredential.model";
import { AviTagService } from "src/app/backoffice/tag-shipping/services/avi-tag.service";
import { ITableColumnDef, ITableData } from "../table/table.model";
import { CustomErrorStateMatcher } from "src/app/shared/utils/custom-error-state-matcher/custom-error-state-matcher";

declare const $: any;

@Component({
  selector: "app-tag-list-table",
  templateUrl: "./tag-list-table.component.html",
  styleUrls: ["./tag-list-table.component.scss"],
})
export class TagListTableComponent implements OnInit, OnChanges {
  @Input() companyId: string | undefined;

  columnDefs: ITableColumnDef[] = [
    { field: "tag", title: "Tag", className: "w-25" },
    { field: "tagTypeName", title: "Tag Type", className: "w-25" },
    { field: "status", title: "Status", className: "w-25" },
    { field: "vehicleName", title: "Vehicle Name", className: "w-25" },
  ];
  tableData: ITableData | undefined;

  form: FormGroup | undefined;
  endTagErrorMatcher = new CustomErrorStateMatcher();

  constructor(private aviTagService: AviTagService) {}

  ngOnInit(): void {
    this.initForm();

    $("#newTagModal").on("hidden.bs.modal", () => {
      this.form?.reset();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["companyId"]?.currentValue) {
      this.getTags();
    }
  }

  save(): void {
    this.aviTagService
      .save<IAviCredentialStatus[]>({
        companyId: this.companyId,
        ...this.form.value,
      })
      .subscribe({
        next: (res) => {
          this.tableData = {
            rows: [...this.tableData.rows, ...res],
            totalRows: this.tableData.totalRows + 1,
          };
          $("#newTagModal").modal("hide");
        },
      });
  }

  private getTags(): void {
    this.aviTagService
      .status<IAviCredentialStatus[]>(this.companyId)
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

  private initForm(): void {
    this.form = new FormGroup({
      startTag: new FormControl("", [Validators.required]),
      endTag: new FormControl("", [
        Validators.required,
        greaterThanValidator("startTag"),
      ]),
    });
  }
}

export function greaterThanValidator(competitor: string): ValidatorFn {
  return (control: AbstractControl) => {
    const controlB = control.parent?.get(competitor);

    const valueA = parseFloat(control.value);
    const valueB = parseFloat(controlB?.value);

    if (!isNaN(valueA) && !isNaN(valueB) && valueA < valueB) {
      return { greaterThan: true };
    }

    return null;
  };
}
