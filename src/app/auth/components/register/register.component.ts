import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import {
  checkPasswords,
  CustomErrorStateMatcher,
} from "src/app/shared/utils/custom-error-state-matcher/custom-error-state-matcher";
import { IAuth } from "../../models/auth.model";
import { ThemeService } from "src/app/shared/services/theme/theme.service";
import { IState, STATE_LIST } from "src/app/shared/utils/states";
import { CompanyNameValidator } from "./company-name.validator";
import moment from "moment";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  logo: string;
  form: FormGroup;
  markets: string[] = [];
  states: IState[] = STATE_LIST;
  passwordMatcher = new CustomErrorStateMatcher();
  loading: boolean = false;

  bgPrimaryCSS: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private themeService: ThemeService,
    private companyNameValidator: CompanyNameValidator,
    private activatedRoute: ActivatedRoute
  ) {
    this.logo = this.themeService.getLogoWhitePath();
    this.bgPrimaryCSS = this.themeService.getBgPrimary();
  }

  ngOnInit(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.add("login-page");
    body.classList.add("off-canvas-sidebar");
    const card = document.getElementsByClassName("card-hidden")[0];
    setTimeout(function () {
      card.classList.remove("card-hidden");
    }, 700);

    this.initForm();

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["referralCode"]) {
        this.setReferralCode(params["referralCode"]);

        if (!this.form.value.referralCode) {
          this.form.get("referralCode")?.setValue(params["referralCode"]);
        }
      }
    });

    this.getMarketList();
  }

  private initForm(): void {
    const referralCode = this.getReferralCode();

    this.form = new FormGroup(
      {
        firstname: new FormControl("", [Validators.required]),
        lastname: new FormControl("", [Validators.required]),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern(PATTERNS.EMAIL),
        ]),
        phone: new FormControl("", [
          Validators.required,
          Validators.pattern(PATTERNS.PHONE),
        ]),
        companyName: new FormControl(
          "",
          [Validators.required],
          [this.companyNameValidator.validate.bind(this.companyNameValidator)]
        ),
        companyAddress: new FormControl("", [Validators.required]),
        companyCity: new FormControl("", [Validators.required]),
        companyState: new FormControl("", [Validators.required]),
        companyZip: new FormControl("", [Validators.required]),
        referralCode: new FormControl(referralCode),
        password: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
        ]),
        confirmPassword: new FormControl("", [Validators.required, checkPasswords]),
        rentalPlatformUsername: new FormControl("", [Validators.required]),
        vehicleCount: new FormControl(1, [
          Validators.required,
          Validators.min(0),
          Validators.pattern("^-?[0-9]+$"),
        ]),
        market: new FormControl("", [Validators.required]),
        agrreeTos: new FormControl(false),
        allowSms: new FormControl(true),
      },
    );
  }

  submit(): void {
    this.loading = true;
    this.authService.register<IAuth>(this.form.value).subscribe({
      next: (res: IAuth) => {
        this.notificationService.notify(
          "notification",
          "success",
          "User is registered. Please verify your email address"
        );

        this.router.navigate(["/verify-email"], {
          queryParams: {
            email: res.user.email,
            verifyId: res.emailVerificationId,
          },
        });

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }

  private setReferralCode(referralCode: string): void {
    const referral: string = localStorage.getItem("referral");
    const [code, expiry] = (referral ?? "").split("/");
    if (!code || moment().isAfter(moment(expiry).add(60, "days"))) {
      localStorage.setItem(
        "referral",
        `${referralCode}/${moment().format("yyyy-MM-DD hh:mm:ss")}`
      );
    }
  }

  private getReferralCode(): string | undefined {
    const referral: string = localStorage.getItem("referral");
    const [code, expiry] = (referral ?? "").split("/");
    if (code && !moment().isAfter(moment(expiry).add(60, "days"))) {
      return code;
    }

    return undefined;
  }

  onVehicleCountKeydown(event: KeyboardEvent): void {
    if (event.key === ".") {
      event.preventDefault();
    }

    if (event.key === "-" || event.key === "e") {
      event.preventDefault();
    }
  }

  onVehicleCountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    if (value !== "0") {
      value = value.replace(/^0+/, "");
    }

    input.value = value;
  }

  getMarketList(): void {
    this.authService.getMarketList<string[]>().subscribe({
      next: (res: string[]) => (this.markets = res),
      error: () => (this.markets = []),
    });
  }
}
