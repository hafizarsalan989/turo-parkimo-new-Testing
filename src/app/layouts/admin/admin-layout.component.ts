import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { FormGroup, FormArray, Validators, FormControl } from "@angular/forms";
import { Router, NavigationEnd } from "@angular/router";

import { Subscription, of } from "rxjs";
import { filter, switchMap } from "rxjs/operators";

import PerfectScrollbar from "perfect-scrollbar";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { HostService } from "src/app/host/services/host/host.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { IUser } from "src/app/shared/models/user.model";
import { IDocument } from "src/app/backoffice/management/models/document.model";
import { IMessage } from "src/app/backoffice/message-center/models/message.model";
import { AuthService } from "src/app/auth/services/auth.service";
import { ManagementService } from "src/app/backoffice/management/services/management.service";

declare const $: any;

@Component({
  selector: "app-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit, AfterViewInit, OnDestroy {
  loading: boolean = false;

  @ViewChild(NavbarComponent, { static: false })
  private navbar: NavbarComponent;
  private subscription: Subscription;

  noWelcome: boolean = false;
  hasTags: boolean = false;
  hasVehicles: boolean = false;
  hasPermits: boolean = false;
  closeWelcome: boolean = false;

  private user: IUser | undefined;

  hostMessage: IMessage | undefined;
  editor = ClassicEditor;

  documentsForm: FormGroup;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loadingService: LoadingService,
    private hostService: HostService,
    private sessionService: SessionService,
    private authService: AuthService,
    private managementService: ManagementService
  ) {}

  ngOnInit() {
    this.documentsForm = new FormGroup({
      checkboxes: new FormArray([]),
    });

    this.sessionService.getUser$().subscribe((user) => {
      if (this.user?.id !== user?.id && user?.turoUserType === "host") {
        this.getHostMessages(user.id);

        setInterval(() => this.getHostMessages(), 5 * 60 * 1000);
      }

      this.user = user;
    });

    this.sessionService.getCurrentHostMessage$().subscribe((msg) => {
      this.hostMessage = msg;
    });

    this.loadingService.loading$.subscribe((loading: number) => {
      this.loading = loading > 0;
      this.cdr.detectChanges();
      const html = document.getElementsByTagName("html")[0];
      if (loading) {
        html.classList.add("overflow-hidden");
      } else {
        html.classList.remove("overflow-hidden");
      }
    });

    this.authService.validateUser().subscribe((user: IUser) => {
      const documents = user?.documentsNeedingAgreement || [];

      if (documents.length > 0 && user.turoUserType === "host") {
        this.initCheckboxes(documents);
        $("#documentsAgreeModal").modal("show");
      }
    });

    const elemMainPanel: HTMLElement = <HTMLElement>(
      document.querySelector(".main-panel")
    );
    const elemSidebar: HTMLElement = <HTMLElement>(
      document.querySelector(".sidebar .sidebar-wrapper")
    );

    this.subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((_: NavigationEnd) => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;

        this.navbar.sidebarClose();
      });

    const html = document.getElementsByTagName("html")[0];
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      html.classList.add("perfect-scrollbar-on");
    } else {
      html.classList.add("perfect-scrollbar-off");
    }

    // this.checkHostStatus();
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  initCheckboxes(documents: IDocument[]): void {
    const checkboxesArr = documents.map((doc) => {
      const version = `${doc.majorVersion.toString()}.${doc.minorVersion.toString()}`;
      return new FormGroup({
        documentId: new FormControl(doc.id),
        documentType: new FormControl(doc.documentType),
        documentVersion: new FormControl(version),
        viewDocument: new FormControl(false, Validators.requiredTrue),
        agreeDocument: new FormControl(
          { value: false, disabled: true },
          Validators.requiredTrue
        ),
      });
    });

    this.documentsForm.setControl("checkboxes", new FormArray(checkboxesArr));
  }

  get checkboxes(): FormArray {
    return this.documentsForm.get("checkboxes") as FormArray;
  }

  onCloseWelcome(isAssignTag = false): void {
    this.closeWelcome = true;

    $("#welcomeModal").modal("hide");

    if (isAssignTag) {
      setTimeout(() => {
        $("#assignTagModal").modal("show");
      }, 300);
    }
  }

  onCloseWelcomePermanent(): void {
    localStorage.setItem("noWelcome", "Yes");
  }

  onLinkClick(index: number): void {
    const checkboxGroup = this.checkboxes.at(index) as FormGroup;
    checkboxGroup.get("viewDocument")?.setValue(true);
    checkboxGroup.get("agreeDocument")?.enable();
  }

  getDocumentLink(documentType: string): string {
    switch (documentType) {
      case "Terms of Service":
        return "https://parkmyshare.com/terms";
      case "Site Rules":
        return "https://parkmyshare.com/locations";
      case "Pricing Agreement":
        return "https://parkmyshare.com/subscription-pricing-agreement";
      case "Privacy Policy":
        return "https://parkmyshare.com/privacy-policy";
      default:
        return "/";
    }
  }

  onSubmitAgree(): void {
    const documentIds = this.checkboxes.controls.map(
      (control) => control.get("documentId")?.value
    );

    this.managementService
      .agreeDocuments({
        documentIds,
        userId: this.user?.id,
      })
      .subscribe((res) => {
        $("#documentsAgreeModal").modal("hide");
      });
  }

  private runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar: HTMLElement = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      const elemMainPanel: HTMLElement = <HTMLElement>(
        document.querySelector(".main-panel")
      );
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      ps.update();
    }
  }

  private isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }

    return bool;
  }

  // TODO: remove/revamp later
  private checkHostStatus(): void {
    this.noWelcome = localStorage.getItem("noWelcome") === "Yes" ? true : false;
    const defaultStatus = {
      hasTags: true,
      hasVehicles: true,
      hasPermits: true,
    };

    this.sessionService
      .getUser$()
      .pipe(
        switchMap((user) => {
          if (user?.turoUserType === "host") {
            return this.sessionService.getHost$().pipe(
              switchMap((host) => {
                if (host) {
                  return this.hostService.getWelcome<{
                    hasTags: boolean;
                    hasVehicles: boolean;
                    hasPermits: boolean;
                  }>(host.id);
                } else {
                  return of(defaultStatus);
                }
              })
            );
          } else {
            return of(defaultStatus);
          }
        })
      )
      .subscribe({
        next: ({ hasTags, hasVehicles, hasPermits }) => {
          this.hasTags = hasTags;
          this.hasVehicles = hasVehicles;
          this.hasPermits = hasPermits;

          if (
            !this.noWelcome &&
            !this.closeWelcome &&
            (!this.hasTags || !this.hasVehicles || !this.hasPermits)
          ) {
            $("#welcomeModal").modal("show");
          }
        },
      });
  }

  private getHostMessages(id?: string): void {
    this.hostService
      .getMessagesByUserId<IMessage[]>(id ?? this.user.id)
      .subscribe({
        next: (res) => {
          this.sessionService.setHostMessages$(
            res
              .sort((a, b) => b.modified.localeCompare(a.modified))
              .sort((a: IMessage, b: IMessage) =>
                a.acknowledged === b.acknowledged ? 0 : a.acknowledged ? 1 : -1
              )
          );
        },
        error: () => {
          this.sessionService.setHostMessages$([]);
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
