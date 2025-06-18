import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { IHost } from "src/app/host/models/host.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { FuelTankService } from "../../services/fuel-tank.service";
import { FuelTank } from "../../models/fuel-tank.model";

@Component({
  selector: "app-fuel-tank-withdraw",
  templateUrl: "./fuel-tank-withdraw.component.html",
  styleUrls: ["./fuel-tank-withdraw.component.scss"],
})
export class FuelTankWithdrawComponent implements OnInit {
  form: FormGroup;
  host: IHost | undefined;
  totalWithdrawalAvailable = 0;
  loading = false;

  constructor(
    private sessionService: SessionService,
    private fuelTankService: FuelTankService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
      this.form.get("companyId").setValue(host?.id);
      if (host) {
        this.getBank();
      }
    });
  }

  private initForm(): void {
    this.form = new FormGroup({
      companyId: new FormControl(""),
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
      amount: new FormControl("", [
        Validators.required,
        Validators.max(this.totalWithdrawalAvailable),
      ]),
      status: new FormControl(false),
    });
  }

  getBank(): void {
    this.fuelTankService.getBank<FuelTank>(this.host.id).subscribe({
      next: (res) => {
        this.totalWithdrawalAvailable = res.totalWithdrawalAvailable;
        this.form
          .get("amount")
          .setValidators([
            Validators.required,
            Validators.max(this.totalWithdrawalAvailable),
          ]);
      },
    });
  }

  onWithdraw(): void {
    this.loading = true;
    this.fuelTankService.withdraw(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["host", "fuel-tank", "list"]);
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onCancel(): void {
    this.router.navigate(["host", "fuel-tank", "list"]);
  }
}
