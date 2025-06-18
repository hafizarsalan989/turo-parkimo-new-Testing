import { Component, OnInit } from "@angular/core";
import { IColumnDef } from "src/app/components/datatable/datatable.component";
import { defaultCol } from "src/app/components/datatable/datatable.helper";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { TagMasterService } from "../../services/tag-master.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-tag-master-exports-list",
  templateUrl: "./tag-master-exports-list.component.html",
  styleUrls: ["./tag-master-exports-list.component.scss"],
})
export class TagMasterExportsListComponent implements OnInit {
  facilities: IFacility[] = [];
  columnDefs: IColumnDef[] = [
    defaultCol(0, "name", "Facility"),
    defaultCol(1, "address.state", "State"),
    {
      ...defaultCol(2, "link1", "New Users"),
      orderable: false,
      render: (_, __, row) => {
        return `
          <button id="${row.id}**${row.name}" mat-raised-button class="btn btn-primary btn-link px-0 py-1 export-new-user-file">
            Export New User File
          </button>
        `;
      },
    },
    {
      ...defaultCol(3, "link2", "Update User"),
      orderable: false,
      render: (_, __, row) => {
        return `
          <button id="${row.id}**${row.name}" mat-raised-button class="btn btn-primary btn-link px-0 py-1 export-user-update-file">
          Export User Update File
          </button>
        `;
      },
    },
    {
      ...defaultCol(4, "link3", "Activity"),
      orderable: false,
      render: (_, __, row) => {
        return `
          <button id="${row.id}" mat-raised-button class="btn btn-primary btn-link px-0 py-1 import-activity-file">
          Import Activity
          </button>
          <input id="activity-file-${row.id}" type="file" hidden accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
        `;
      },
    },
  ];

  constructor(
    private facilityService: FacilityService,
    private tagMasterService: TagMasterService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.facilityService.getActiveFacilities<IFacility[]>().subscribe({
      next: (res) => (this.facilities = res),
      error: () => (this.facilities = []),
    });

    const self = this;
    $(`#tagMasterExportsDatatable`).on(
      "click",
      ".export-new-user-file",
      function () {
        const [id, name] = $(this).attr("id")?.split("**");
        self.download("new", id, `${name}_new_user_export.csv`);
      }
    );
    $(`#tagMasterExportsDatatable`).on(
      "click",
      ".export-user-update-file",
      function () {
        const [id, name] = $(this).attr("id")?.split("**");
        self.download("update", id, `${name}_user_update_export.csv`);
      }
    );
    $(`#tagMasterExportsDatatable`).on(
      "click",
      ".import-activity-file",
      function () {
        const facilityId = $(this).attr("id");
        const id = `#activity-file-${facilityId}`;
        $(id).trigger("click");
        $(id).on("change", () => {
          self.upload(facilityId, $(id).prop("files")[0]);
        });
      }
    );
  }

  download(type: string, id: string, fileName: string): void {
    this.tagMasterService.downloadUser(type, id).subscribe({
      next: (res: any) => {
        let dataType = res.type;
        let binaryData: BlobPart[] = [];
        binaryData.push(res);
        let aTag = document.createElement("a");
        aTag.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        aTag.target = "_blank";
        aTag.download = fileName;
        document.body.appendChild(aTag);
        aTag.click();
      },
    });
  }

  upload(facilityId: string, file: File): void {
    const formData: FormData = new FormData();
    formData.append("facilityId", facilityId);
    formData.append("fileType", "Tag Master Import Activity");
    formData.append("file", file);

    this.tagMasterService.uploadActivityFile(formData).subscribe({
      next: () => {
        this.notificationService.notify(
          "notification",
          "success",
          "Activity was imported successfully"
        );
      },
    });
  }
}
