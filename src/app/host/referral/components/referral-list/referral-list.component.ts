import { Component, OnInit, Input } from "@angular/core";
import {
  ITableColumnDef,
  ITableData,
} from "src/app/components/table/table.model";
import { ReferralService } from "../../services/referral.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IHost } from "src/app/host/models/host.model";
import { IReferral, IReferralActivity } from "../../models/referral.model";
import { FuelTankService } from "src/app/host/fuel-tank/services/fuel-tank.service";
import { FuelTank } from "src/app/host/fuel-tank/models/fuel-tank.model";
import { Location } from "@angular/common";
import { HostService } from "src/app/host/services/host/host.service";

declare const $: any;

@Component({
  selector: "app-referral-list",
  templateUrl: "./referral-list.component.html",
  styleUrls: ["./referral-list.component.scss"],
})

export class ReferralListComponent implements OnInit {
  company: IHost | undefined;
  bank: FuelTank | undefined;
  userType: string = '';
  totalEarned: number | undefined;
  referralUrl: string | undefined;
  achUrl = `${location.origin}/my-account?section=headingEight`;
  tableData: ITableData = {
    totalRows: 0,
    rows: [],
  };

  columnDefs: ITableColumnDef[] = [
    {
      field: "companyName",
      title: "Host",
    },
    {
      field: "startDate",
      title: "Start",
      format: {
        type: "date",
      },
    },
    {
      field: "endDate",
      title: "End",
      format: {
        type: "date",
      },
    },
    {
      field: "totalEarned",
      title: "Total Earned",
      format: {
        type: "currency",
      },
    },
    { field: "actions" },
  ];


  isDisabledPolicy = true;

  activities: IReferralActivity[] = [];

  constructor(
    private referralService: ReferralService,
    private sessionService: SessionService,
    private fuelTankService: FuelTankService,
    private loc: Location,
    private hostService: HostService
  ) { }

  @Input() companyId: string;


  ngOnInit(): void {

    if (this.companyId != '' && this.companyId != null && this.companyId != undefined) {
      this.companyId;

      this.hostService.getHostById<IHost>(this.companyId).subscribe({
        next: (host) => {
          this.company = host;

          if (this.company?.id) {
            this.getBank();
            this.getReferral();
          }

          if (!this.company?.referralCode && this.company?.referralCode != undefined) {
            $("#termsOfReferralServiceModal").modal("show");

            $("#termsOfReferralServiceModal a").on("click", () => {
              this.isDisabledPolicy = false;
            });
          } else {
            this.referralUrl = `${location.origin}/register?referralCode=${this.company.referralCode}`;
          }
        },
        error: (err) => {
          console.error('Failed to load host:', err);
        }
      });
      
    }
    else {
      this.sessionService.getHost$().subscribe((host) => {
        this.company = host;

        if (this.company?.id) {
          this.getBank();
          this.getReferral();
        }

        if (!this.company?.referralCode && this.company?.id) {
          $("#termsOfReferralServiceModal").modal("show");

          $("#termsOfReferralServiceModal a").on("click", () => {
            this.isDisabledPolicy = false;
          });
        } else {
          this.referralUrl = `${location.origin}/register?referralCode=${this.company.referralCode}`;
        }
      });
    }

  }

  onAccept(): void {
    this.referralService.acceptReferral<string>(this.company.id).subscribe({
      next: (res) => {
        this.company.referralCode = res;
        this.referralUrl = `${location.origin}/register?referralCode=${this.company.referralCode}`;
        this.sessionService.setHost$(this.company);
        $("#termsOfReferralServiceModal").modal("hide");
      },
    });
  }

  onCancel(): void {
    this.loc.back();
  }

  viewActivity(id: string): void {
    this.referralService
      .getReferralActivityById<IReferralActivity[]>(id)
      .subscribe({
        next: (res) => {
          this.activities = res;
          $("#referralActivityModal").modal("show");
        },
        error: () => {
          this.activities = [];
        },
      });
  }

  private getBank(): void {
    this.fuelTankService.getBank<FuelTank>(this.company.id).subscribe({
      next: (res) => {
        this.bank = res;
      },
    });
  }

  private getReferral(): void {
    this.referralService
      .getReferralByCompanyId<IReferral[]>(this.company.id)
      .subscribe({
        next: (res) => {
          this.totalEarned = res.reduce((acc, item) => (acc + item.totalEarned), 0);
          this.tableData = {
            totalRows: res.length,
            rows: res,
          };
        },
        error: () => {
          this.totalEarned = 0;
          this.tableData = {
            totalRows: 0,
            rows: [],
          };
        },
      });
  }
}
