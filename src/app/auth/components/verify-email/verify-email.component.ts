import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IAuth } from "../../models/auth.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { ThemeService } from "src/app/shared/services/theme/theme.service";

@Component({
  selector: "app-verify-email",
  templateUrl: "./verify-email.component.html",
  styleUrls: ["./verify-email.component.scss"],
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  logo: string;
  form: FormGroup;
  loading: boolean = false;

  bgPrimaryCSS: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private loadingService: LoadingService,
    private sessionService: SessionService,
    private notificationService: NotificationService,
    private themeService: ThemeService
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
      if (params["email"]) {
        this.form.controls["email"].setValue(params["email"]);
      }
      if (params["code"]) {
        this.form.controls["code"].setValue(params["code"]);
      }
      if (params["verifyId"]) {
        this.form.controls["verifyId"].setValue(params["verifyId"]);
      }
    });

    this.loadingService.loading$.subscribe(
      (loading: number) => (this.loading = loading > 0)
    );
  }

  private initForm(): void {
    this.form = new FormGroup({
      verifyId: new FormControl(""),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      code: new FormControl("", [Validators.required]),
    });
  }

  resendCode(): void {
    this.authService.resendCode(this.form.value.email).subscribe({
      next: () =>
        this.notificationService.notify(
          "notification",
          "success",
          "Email with new code was sent successfully"
        ),
    });
  }

  submit(): void {
    this.authService.verify(this.form.value).subscribe({
      next: (res: IAuth) => {
        localStorage.setItem("X-AccessToken", res.accessToken);
        this.sessionService.setUser$(res.user);

        this.authService.navigateByUserType(
          res.user.turoUserType,
          res.user.id,
          null
        );
      },
    });
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }
}
