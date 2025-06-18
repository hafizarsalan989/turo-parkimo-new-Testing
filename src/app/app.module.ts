import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Router, RouterModule } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatListModule } from "@angular/material/list";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTabsModule } from "@angular/material/tabs";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { ClipboardModule } from "@angular/cdk/clipboard";

import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

import { AppComponent } from "./app.component";

import { SidebarModule } from "./shared/components/sidebar/sidebar.module";
import { FooterModule } from "./shared/components/footer/footer.module";
import { NavbarModule } from "./shared/components/navbar/navbar.module";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";

import { AppRoutes } from "./app.routing";
import { AuthenticatorInterceptor } from "./core/interceptors/authenticator/authenticator.interceptor";
import { LoadingInterceptor } from "./core/interceptors/loading/loading.interceptor";
import { AuthService } from "./auth/services/auth.service";
import { IUser } from "./shared/models/user.model";
import { HostService } from "./host/services/host/host.service";
import { SwalService } from "./shared/services/swal/swal.service";
import { VehicleService } from "./host/vehicles/services/vehicle.service";
import { NON_AUTH_ROUTES } from "./core/constants/non-auth-routes";
import { MatTreeModule } from '@angular/material/tree';
function initializeAppFactory(
  authService: AuthService,
  router: Router
): () => Observable<unknown> {
  /** Auto reload after a day */
  setTimeout(() => {
    window.location.reload();
  }, 1000 * 3600 * 24);

  const { pathname, search } = window.location;

  if (localStorage.getItem("X-AccessToken")) {
    return () =>
      authService.validateUser<IUser>().pipe(
        tap((res: IUser) => {
          if (!res.isEmailVerified || res.isDeleted) {
            router.navigate(["/login"]);
          } else {
            let url = null;
            if (
              pathname !== "/" &&
              pathname !== "/login" &&
              pathname !== "/register" &&
              pathname !== "/reset-password" &&
              pathname !== "/verify-email"
            ) {
              url = `${pathname}${search}`;
            }

            authService.navigateByUserType(res.turoUserType, res.id, url);
          }
        })
      );
  } else {
    return () =>
      of(null).pipe(
        tap(() => {
          let isNonAuth = false;
          NON_AUTH_ROUTES.forEach((r) => {
            if (pathname.includes(r)) {
              isNonAuth = true;
            }
          });

          if (!isNonAuth) {
            router.navigate(["/login"]);
          }
        })
      );
  }
}

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatCheckboxModule,
    MatStepperModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatNativeDateModule,
    ClipboardModule,
      MatTreeModule,
  ],
})
export class MaterialModule {}

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes),
    HttpClientModule,
    CKEditorModule,
    MaterialModule,
    SidebarModule,
    NavbarModule,
    FooterModule,
  ],
  declarations: [AppComponent, AdminLayoutComponent, AuthLayoutComponent],
  providers: [
    MatNativeDateModule,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      deps: [AuthService, Router, HostService, VehicleService, SwalService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticatorInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
