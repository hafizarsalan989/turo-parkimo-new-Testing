import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { SessionService } from "src/app/shared/services/session/session.service";
import {
  checkPasswords,
  CustomErrorStateMatcher,
} from "src/app/shared/utils/custom-error-state-matcher/custom-error-state-matcher";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { IAuth } from "../../models/auth.model";
import { ThemeService } from "src/app/shared/services/theme/theme.service";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  logo: string;
  form: FormGroup;
  passwordMatcher = new CustomErrorStateMatcher();
  loading: boolean = false;

  bgPrimaryCSS: string;

  constructor(
    private router: Router,
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
      if (params["resetId"]) {
        this.form.controls["resetId"].setValue(params["resetId"]);
      }
      if (params["code"]) {
        this.form.controls["code"].setValue(params["code"]);
      }
    });

    this.loadingService.loading$.subscribe(
      (loading: number) => (this.loading = loading > 0)
    );
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      resetId: new FormControl(""),
      code: new FormControl(""),
      password: new FormControl(""),
      confirmPassword: new FormControl(""),
    });
  }

  submit(): void {
    if (!this.form.value.resetId) {
      this.authService
        .forgotPassword({ email: this.form.value.email })
        .subscribe({
          next: (res: string) => {
            this.form.controls["resetId"].setValue(res);
            this.form.controls["code"].setValidators([Validators.required]);
            this.form.controls["password"].setValidators([
              Validators.required,
              Validators.minLength(6),
            ]);
            this.form.controls["confirmPassword"].setValidators([
              Validators.required,
              checkPasswords,
            ]);
          },
        });
    } else {
      this.authService.resetPassword<IAuth>(this.form.value).subscribe({
        next: (res: IAuth) => {
          if (res.user.isEmailVerified) {
            localStorage.setItem("X-AccessToken", res.accessToken);
            this.sessionService.setUser$(res.user);

            this.authService.navigateByUserType(
              res.user.turoUserType,
              res.user.id
            );
          } else {
            this.notificationService.notify(
              "notification",
              "info",
              "Email is not verifed. Please verify your email address"
            );

            this.router.navigate(["/verify-email"], {
              queryParams: {
                email: res.user.email,
                verifyId: res.emailVerificationId,
              },
            });
          }
        },
      });
    }
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }
}
