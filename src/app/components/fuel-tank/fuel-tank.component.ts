import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";

import { FuelTank } from "src/app/host/fuel-tank/models/fuel-tank.model";
import { FuelTankService } from "src/app/host/fuel-tank/services/fuel-tank.service";
import { IHost } from "src/app/host/models/host.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { ITableData } from "../table/table.model";
import { IUser } from "src/app/shared/models/user.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { HostService } from "src/app/host/services/host/host.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

declare const $: any;

@Component({
  selector: "app-fuel-tank",
  templateUrl: "./fuel-tank.component.html",
  styleUrls: ["./fuel-tank.component.scss"],
})
export class FuelTankComponent implements OnInit, OnChanges {
  @Input() host: IHost | undefined;

  user: IUser | undefined;

  data: FuelTank | undefined;
  tableData: ITableData | undefined;

  // columnDefs = [
    
  //   { field: "stamp", title: "Date", format: { type: "date" } },
  //   { field: "ledgerType", title: "" },
  //   { field: "referenceType", title: "Type" },
  //   {
  //     field: "invoiceNumber",
  //     title: "Invoice",
  //     // format: {
  //     //   type: "link",
  //     //   param: { url: "external/pay/[value]", key: "referenceId" },
  //     // },
  //     format: {
  //       type: "link",
  //       param: { url: "external/invoice/[value]", key: "referenceId" },
  //     },
  //   },
  //   { field: "description", title: "Description" },
  //   { field: "amount", title: "Amount", format: { type: "currency" } },
  // ];

  columnDefs = [
  { field: "stamp", title: "Date", format: { type: "date" } },
  { field: "ledgerType", title: "" },
  { field: "referenceType", title: "Type" },
  {
    field: "invoiceNumber",
    title: "Invoice",
    format: {
      type: "link",
      param: { key: "referenceId" }, // Only provide the key
    },
  },
  { field: "description", title: "Description" },
  { field: "amount", title: "Amount", format: { type: "currency" } },
];

  achForm: FormGroup | undefined;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private fuelTankService: FuelTankService,
    private hostService: HostService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.achForm = new FormGroup({
      abaNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d{1,}$/),
      ]),
      accountNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\d{1,}$/),
      ]),
      bankName: new FormControl("", Validators.required),
      accountOwnerName: new FormControl("", Validators.required),
      accountOwnerPhone: new FormControl("", Validators.required),
    });

    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["host"]?.currentValue) {
      this.getBank();

      this.achForm.patchValue(changes["host"]?.currentValue.ach);
    }
  }

  // getBank(): void {
  //   this.fuelTankService.getBank<FuelTank>(this.host.id).subscribe({
  //     next: (res) => {
  //       console.log("Fuel Tank Data: ", res);
  //       this.data = res;
  //       this.tableData = {
  //         totalRows: res.ledger.length,
  //         rows: res.ledger,
  //       };
  //     },
  //   });
  // }
  getBank(): void {
    this.fuelTankService.getBank<FuelTank>(this.host.id).subscribe({
      next: (res) => {
        this.data = res;
       // console.log("Fuel Tank Data: ", res);
        // Sort ledger by date in descending order
        const sortedLedger = res.ledger.sort((a, b) => {
          return new Date(b.created).getTime() - new Date(a.created).getTime(); 
        });
        this.tableData = {
          totalRows: sortedLedger.length,
          rows: sortedLedger,
        };
        //console.log("Sorted Ledger: ", this.tableData.rows);

      },
    });
  }


  onWithdraw(): void {
    this.router.navigate(["host", "fuel-tank", "withdraw"]);
  }

  onExport(): void {
    this.fuelTankService.download(this.host?.id).subscribe({
      next: (res: any) => {
        let dataType = res.type;
        let binaryData: BlobPart[] = [];
        binaryData.push(res);
        let aTag = document.createElement("a");
        aTag.href = window.URL.createObjectURL(
          new Blob(binaryData, { type: dataType })
        );
        aTag.target = "_blank";
        aTag.download = `${this.host?.companyName}_pms_bank-${moment().format(
          "YYYYMMDD_hhmmss"
        )}.csv`;
        document.body.appendChild(aTag);
        aTag.click();
      },
    });
  }

  saveAch(): void {
    this.hostService
      .saveAch<IHost>(this.host.id, this.achForm.value)
      .subscribe({
        next: (res) => {
          $("#achInfoModal").modal("hide");

          this.notificationService.notify(
            "notification",
            "success",
            "ACH is updated"
          );

          this.sessionService.setHost$(res);
        },
      });
  }
}
