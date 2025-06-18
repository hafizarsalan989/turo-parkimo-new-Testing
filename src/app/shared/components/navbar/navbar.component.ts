import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Location } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";

import { filter } from "rxjs/operators";

import { IChildRoute, IRoute, ROUTES } from "../sidebar/sidebar.component";
import { SessionService } from "../../services/session/session.service";
import { IMessage } from "src/app/backoffice/message-center/models/message.model";
import { HostService } from "src/app/host/services/host/host.service";
import { IUser } from "../../models/user.model";
import { IHost, ISimpleHost } from "src/app/host/models/host.model";
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NotificationService } from "../../services/notification/notification.service";
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "src/app/auth/services/auth.service";
const misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};

declare var $: any;
@Component({
  selector: "app-navbar-cmp",
  templateUrl: "navbar.component.html",
})
export class NavbarComponent implements OnInit {
  mobile_menu_visible: any = 0;
  searchMode: 'host' | 'vehicle' = 'host';

  private menuItems: IRoute[] = [];
  private toggleButton: any;
  private sidebarVisible: boolean;


  @ViewChild("app-navbar-cmp", { static: false }) button: any;

  private user: IUser | undefined;
  private host: IHost | undefined;
  hostMessages: IMessage[] = [];
  unread: number | undefined;

  constructor(
    private location: Location,
    private element: ElementRef,
    private router: Router,
    private sessionService: SessionService,
    private hostService: HostService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private authService: AuthService,
  ) {
    this.sidebarVisible = false;
  }
  public userRole: string;

  sortOptions = [
    "Company(ASC)",
    "Company(DESC)",
    "Email(ASC)",
    "Email(DESC)",
    "Name(ASC)",
    "Name(DESC)",
  ];
  form: FormGroup;
  sortedHosts: ISimpleHost[] = [];
  advancedForm: FormGroup;
  submitHostSearch(): void {
    const { searchCriteria, facilityId } = this.form.value;
    if (!searchCriteria) {
      this.notificationService.notify('notification', 'warning', 'Please enter a search term');
      return;
    }

    // Navigate to Host Management page with query params
    const queryParams = {
      searchCriteria: searchCriteria,
      facilityId: facilityId !== 'all' ? facilityId : undefined
    };
    this.router.navigate(['/backoffice/host-management'], { queryParams });
  }

  submitVehicleSearch(): void {
    const query = this.advancedForm.value.query.trim();
    if (!query) return;

    this.hostService.advancedSearchHostManagement<ISimpleHost[]>(`?searchCriteria=${query}`)
      .subscribe({
        next: (hosts) => {
          if (hosts.length === 1) {
            // Redirect directly to company page
            // this.router.navigate([`/backoffice/host-management/${hosts[0].companyId}/view`], {
            //   queryParams: {

            //     query: query || '',
            //   },
            //   queryParamsHandling: 'merge'
            // });
            this.router.navigate([`/backoffice/host-management/${hosts[0].companyId}/view`], {
              queryParams: {
                searchCriteria: query || '', // ✅ Match what you are reading
              },
              queryParamsHandling: 'merge'
            });

          }
          else if (hosts.length === 0) {
            this.notificationService.notify('notification', 'success', 'No results found');
          }
          else {
            this.router.navigate(['/backoffice/host-management'], {
              queryParams: { query: query }
            });
          }
        },
        error: () => {
          this.notificationService.notify('notification', 'danger', 'Search failed');
        }
      });
  }




  minimizeSidebar() {
    const body = document.getElementsByTagName("body")[0];

    if (misc.sidebar_mini_active === true) {
      body.classList.remove("sidebar-mini");
      misc.sidebar_mini_active = false;
    } else {
      setTimeout(function () {
        body.classList.add("sidebar-mini");

        misc.sidebar_mini_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  hideSidebar() {
    const body = document.getElementsByTagName("body")[0];
    const sidebar = document.getElementsByClassName("sidebar")[0];

    if (misc.hide_sidebar_active === true) {
      setTimeout(function () {
        body.classList.remove("hide-sidebar");
        misc.hide_sidebar_active = false;
      }, 300);
      setTimeout(function () {
        sidebar.classList.remove("animation");
      }, 600);
      sidebar.classList.add("animation");
    } else {
      setTimeout(function () {
        body.classList.add("hide-sidebar");
        // $('.sidebar').addClass('animation');
        misc.hide_sidebar_active = true;
      }, 300);
    }

    // we simulate the window Resize so the charts will get updated in realtime.
    const simulateWindowResize = setInterval(function () {
      window.dispatchEvent(new Event("resize"));
    }, 180);

    // we stop the simulation of Window Resize after the animations are completed
    setTimeout(function () {
      clearInterval(simulateWindowResize);
    }, 1000);
  }

  onModeChange() {
    this.hostService.setMode(this.searchMode);
  }
  ngOnInit() {
    this.sessionService.getUser$().subscribe(user => {
      this.userRole = user?.turoUserType ?? null;
    });
    this.advancedForm = this.fb.group({
      query: ['', [Validators.minLength(3)]],
      sort: ['']
    });

    this.form = new FormGroup({
      searchCriteria: new FormControl(""),
      facilityId: new FormControl("all"),
      sort: new FormControl(this.sortOptions[0]),
    });

    this.searchMode = this.hostService.getCurrentMode();

    // Subscribe to changes
    this.hostService.mode$.subscribe(mode => {
      this.searchMode = mode;
    });

    const navbar: HTMLElement = this.element.nativeElement;
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton = navbar.getElementsByClassName("navbar-toggler")[0];
    if (body.classList.contains("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    }
    if (body.classList.contains("hide-sidebar")) {
      misc.hide_sidebar_active = true;
    }
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.sidebarClose();

        const $layer = document.getElementsByClassName("close-layer")[0];
        if ($layer) {
          $layer.remove();
        }
      });

    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
      this._loadMenuItems();
    });

    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
      this._loadMenuItems();
    });

    this.sessionService.getHostMessages$().subscribe((messages) => {
      this.hostMessages = messages;
      this.unread = messages.filter((msg) => !msg.acknowledged).length;
    });
  }

  onResize(_: Event) {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  sidebarOpen() {
    const $toggle = document.getElementsByClassName("navbar-toggler")[0];
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    setTimeout(function () {
      $toggle.classList.add("toggled");
    }, 430);

    const $layer = document.createElement("div");
    $layer.setAttribute("class", "close-layer");

    if (body.querySelectorAll(".main-panel")) {
      document.getElementsByClassName("main-panel")[0].appendChild($layer);
    } else if (body.classList.contains("off-canvas-sidebar")) {
      document
        .getElementsByClassName("wrapper-full-page")[0]
        .appendChild($layer);
    }

    setTimeout(function () {
      $layer.classList.add("visible");
    }, 100);

    $layer.onclick = function () {
      body.classList.remove("nav-open");
      this.mobile_menu_visible = 0;
      this.sidebarVisible = false;

      $layer.classList.remove("visible");
      setTimeout(function () {
        $layer.remove();
        $toggle.classList.remove("toggled");
      }, 400);
    }.bind(this);

    body.classList.add("nav-open");
    this.mobile_menu_visible = 1;
    this.sidebarVisible = true;
  }

  sidebarClose() {
    const $toggle = document.getElementsByClassName("navbar-toggler")[0];
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton?.classList.remove("toggled");
    const $layer = document.createElement("div");
    $layer.setAttribute("class", "close-layer");

    this.sidebarVisible = false;
    body.classList.remove("nav-open");
    body.classList.remove("nav-open");
    if ($layer) {
      $layer.remove();
    }

    setTimeout(function () {
      $toggle.classList.remove("toggled");
    }, 400);

    this.mobile_menu_visible = 0;
  }

  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getCurrentRoute() {
    const result = [];

    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === "#") {
      title = title.slice(1);
    }

    const paths: string[] = title.split("/");
    const route: IRoute | undefined = this.menuItems.find(
      (r: IRoute) => r.path === `/${[paths[1]]}`
    );
    if (route) {
      result.push({
        title: route.title,
        path: route.path,
      });
    }

    if (route?.children?.length > 0) {
      const children: IChildRoute | undefined = route?.children.find(
        (r: IChildRoute) => r.path === paths[2]
      );
      if (children) {
        result.push({
          title: children.title,
          path: `${route.path}/${children.path}`,
        });
      }
    }

    return result;
  }

  logout(): void {
    localStorage.clear();

    this.router.navigate(["/login"]).then(() => {
      this.sessionService.clear();
    });
  }

  openMessage(e: Event, msg: IMessage): void {
    e.preventDefault();

    this.sessionService.setCurrentHostMessage$(msg);
    setTimeout(() => {
      $("#hostMessageModal").modal("show");
    }, 300);

    if (!msg.acknowledged) {
      this.hostService
        .acknowledgeMessage<IMessage>({
          userId: this.user?.id,
          messageId: msg.id,
        })
        .subscribe({
          next: (res) => {
            const index = this.hostMessages.findIndex(
              (msg) => msg.id === res.id
            );
            if (index > -1) {
              this.hostMessages[index].acknowledged = true;
              this.unread--;
            }
          },
        });
    }
  }

  private _loadMenuItems(): void {
    if (
      (this.user?.turoUserType === "host" && this.host) ||
      this.user?.turoUserType !== "host"
    ) {
      const roleUrls: string[] = this.sessionService.getAllowedUrlsForUser();
      this.menuItems = [];
      ROUTES.forEach((route: IRoute) => {
        if (
          route.path.startsWith(`/${this.user?.turoUserType}`) ||
          route.path === "/dashboard" ||
          route.path === "/user"
        ) {
          if (route.children?.length > 0) {
            let children: IChildRoute[] = [];

            route.children.forEach((child: IChildRoute) => {
              const index: number = roleUrls.findIndex(
                (url: string) =>
                  url.indexOf(`${route.path}/${child.path}`) === 0
              );
              if (index > -1) {
                children.push(child);
              }
            });

            if (children.length > 0) {
              this.menuItems.push({ ...route, children });
            }
          } else {
            if (roleUrls.find((url: string) => url.indexOf(route.path) > -1)) {
              this.menuItems.push(route);
            }
          }
        }
      });
    }
  }
}
