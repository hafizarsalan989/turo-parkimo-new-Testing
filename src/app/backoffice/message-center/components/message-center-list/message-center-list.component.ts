import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { MessageCenterService } from "../../services/message-center.service";
import { IMessage } from "../../models/message.model";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewMessageComponent } from "../new-message/new-message.component";

declare const $: any;

@Component({
  selector: "app-message-center-list",
  templateUrl: "./message-center-list.component.html",
  styleUrls: ["./message-center-list.component.scss"],
})
export class MessageCenterListComponent implements OnInit {
  columnDefs: ITableColumnDef[] = [
    {
      field: "facilityName",
      title: "Facility",
    },
    {
      field: "created",
      title: "Date Sent",
      format: {
        type: "date",
        param: "MM/dd/yyyy hh:mm a",
      },
    },
    {
      field: "subject",
      title: "Subject",
    },
    {
      field: "recipients",
      title: "Users",
      format: {
        type: "length",
      },
    },
    {
      field: "acknowledgedCount",
      title: "Acknowledged",
      format: {
        type: "number",
      },
    },
    {
      field: "acknowledgedPercent",
      title: "% Acknowledged",
      format: {
        type: "percent",
      },
    },
    { field: "actions" },
  ];
  tableData: ITableData | undefined;

  editor = ClassicEditor;

  selectedMessage: IMessage | undefined;

  detailColumnDefs: ITableColumnDef[] = [
    {
      field: "email",
      title: "Email",
    },
    {
      field: "phoneNumber",
      title: "Phone",
    },
    {
      field: "acknowledged",
      title: "Date Acknowledged",
      format: {
        type: "date",
      },
    },
    {
      field: "hostName",
      title: "Host Name",
    },
  ];
  detailTableData: ITableData | undefined;

  constructor(
    private messageCenterService: MessageCenterService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getAllMessages();
  }
  close(): void {
    this.dialog.closeAll();
  }
  newMessage(): void {
    //this.router.navigate(["backoffice/message-center/new"]);

    const dialogRef = this.dialog.open(NewMessageComponent, {

      maxHeight: '80vh',
      disableClose: true,
      panelClass: 'custom-dialog-container',
      backdropClass: 'transparent-backdrop',
      data: {
        exampleKey: 'exampleValue',
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getAllMessages(); // refresh message list after dialog closes
    });

  }

  viewMessage(message: IMessage): void {
    this.selectedMessage = message;
    this.detailTableData = {
      rows: this.selectedMessage.recipients,
      totalRows: this.selectedMessage.recipients.length,
    };

    $("#viewMessageModal").modal("show");
  }

  private getAllMessages(): void {
    this.messageCenterService.getAll<IMessage[]>().subscribe({
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
