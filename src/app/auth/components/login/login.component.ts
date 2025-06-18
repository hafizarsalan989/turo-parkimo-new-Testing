import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { AuthService } from "../../services/auth.service";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IAuth } from "../../models/auth.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { ThemeService } from "src/app/shared/services/theme/theme.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit, OnDestroy {
  logo: string;
  form: FormGroup;
  loading: boolean = false;

  bgPrimaryCSS: string;

  constructor(
    private router: Router,
    private authService: AuthService,
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
  }

  private initForm(): void {
    this.form = new FormGroup({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      password: new FormControl("", [Validators.required]),
    });
  }

  submit(): void {
    this.loading = true;
    this.authService.login<IAuth>(this.form.value).subscribe({
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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName("body")[0];
    body.classList.remove("login-page");
    body.classList.remove("off-canvas-sidebar");
  }
}
