import { Component, OnInit } from "@angular/core";
import PerfectScrollbar from "perfect-scrollbar";

import { SessionService } from "../../services/session/session.service";
import { ThemeService } from "../../services/theme/theme.service";
import { Router } from "@angular/router";
import { IMessage } from "src/app/backoffice/message-center/models/message.model";
import { IUser } from "../../models/user.model";
import { HostService } from "src/app/host/services/host/host.service";
import { IHost } from "src/app/host/models/host.model";

declare const $: any;

//Metadata
export interface IRoute {
  path: string;
  title: string;
  type: string;
  icontype: string;
  collapse?: string; // should be matched pathname but use - instead of /
  children?: IChildRoute[];
}

export interface IChildRoute {
  path: string;
  title: string;
  ab: string;
  type?: string;
}

//Menu Items
export const ROUTES: IRoute[] = [
  {
    path: "/dashboard",
    title: "Dashboard",
    type: "link",
    icontype: "dashboard",
  },
  {
    path: "/host/vehicle",
    title: "Vehicles",
    icontype: "directions_car",
    type: "link",
  },
  {
    path: "/host/invoice",
    title: "Host Invoices",
    icontype: "description",
    type: "link",
  },
  {
    path: "/host/guest-pay",
    title: "Guest Pay",
    icontype: "credit_card",
    type: "link",
  },
  {
    path: "/host/qr-management",
    title: "QR Code Management",
    icontype: "qr_code_2",
    type: "link",
  },
  {
    path: "/host",
    title: "Tools",
    type: "sub",
    icontype: "settings",
    collapse: "host",
    children: [
      {
        path: "chase-car",
        title: "Chase Cars",
        type: "link",
        ab: "CC",
      },
      {
        path: "delivery-fee",
        title: "Calculator",
        type: "link",
        ab: "DFC",
      },
      {
        path: "fuel-tank",
        title: "Fuel Tank",
        type: "link",
        ab: "FT",
      },
      {
        path: "referral",
        title: "Refer a Friend",
        type: "link",
        ab: "RF",
      },
      // {
      //   path: "tag-ordering",
      //   title: "Tag Ordering",
      //   type: "link",
      //   ab: 'TO'
      // },
      // {
      //   path: "reserved-space",
      //   title: "Reserved Space",
      //   type: "link",
      //   ab: 'RS'
      // },
      {
        path: "user",
        title: "Users",
        type: "link",
        ab: "U",
      },
    ],
  },
  {
    path: "/host/locations",
    title: "Locations",
    icontype: "location_on",
    type: "link",
  },
  {
    path: "/facility",
    title: "Parking Facility",
    type: "sub",
    icontype: "local_parking",
    collapse: "facility",
    children: [{ path: "vehicle-search", title: "Vehicle Search", ab: "VS" }],
  },
  {
    path: "/facility/reports",
    title: "Reports",
    type: "sub",
    icontype: "report",
    collapse: "facility--reports",
    children: [
      { path: "financials", title: "Financials", ab: "F" },
      { path: "occupancy", title: "Occupancy", ab: "O" },
    ],
  },
  {
    path: "/backoffice",
    title: "Backoffice",
    type: "sub",
    icontype: "local_police",
    collapse: "backoffice",
    children: [
      { path: "work-queue", title: "Work Queue", ab: "WQ" },
      { path: "action-center", title: "Action Center", ab: "AC" },
      { path: "call-center", title: "Call Center", ab: "CC" },
      { path: "host-management", title: "Host Management", ab: "HM" },
      { path: "guest-pay", title: "Guest Pay", ab: "GP" },
      { path: "tag-shipping", title: "Tag Shipping", ab: "TS" },
      { path: "receipt", title: "Host Invoices", ab: "HI" },
      // {
      //   path: "referral",
      //   title: "Refer a Friend",
      //   type: "link",
      //   ab: "RF",
      // },
      { path: "tag-master-exports", title: "Tag Master Exports", ab: "TME" },
      { path: "message-center", title: "Message Center", ab: "MC" },
      { path: "withdraws", title: "Withdraws", ab: "W" },
    ],
  },
  {
    path: "/backoffice/contract-parking",
    title: "Contract Parking",
    type: "sub",
    icontype: "local_parking",
    collapse: "backoffice--contract-parking",
    children: [{ path: "pool-management", title: "Pool Management", ab: "PM" }],
  },
  {
    path: "/backoffice/reports",
    title: "Reports",
    type: "sub",
    icontype: "report",
    collapse: "backoffice--reports",
    children: [
      { path: "facility-financials", title: "Facility Financials", ab: "FF" },
      { path: "facility-occupancy", title: "Facility Occupancy", ab: "FO" },
      { path: "denied-tags", title: "Denied Tags", ab: "DT" },
      { path: "city-pass-count", title: "Subscription Count", ab: "SC" },
      { path: "traveler-invoices", title: "Guest Invoices", ab: "GI" },
      { path: "system", title: "System", ab: "S" },
      { path: "guest-pay", title: "Guest Pay", ab: "GP" },
    ],
  },
  {
    path: "/backoffice/management",
    title: "Management",
    type: "sub",
    icontype: "settings",
    collapse: "backoffice--management",
    children: [
      { path: "activity", title: "Activity", ab: "A" },
      { path: "credentials", title: "Credentials", ab: "C" },
      { path: "document", title: "Document", ab: "D" },
      { path: "device-monitoring", title: "Device Monitoring", ab: "DM" },
    ],
  },
  {
    path: "/backoffice/locations",
    title: "Locations",
    icontype: "location_on",
    type: "link",
  },
  {
    path: "/callcenter",
    title: "Call Center",
    type: "link",
    icontype: "call",
  },
  {
    path: "/pool/contract-parking",
    title: "Contract Parking",
    type: "sub",
    icontype: "local_parking",
    collapse: "pool--contract-parking",
    children: [{ path: "pool-management", title: "Pool Management", ab: "PM" }],
  },
  {
    path: "/user",
    title: "Users",
    type: "link",
    icontype: "group",
  },
];

@Component({
  selector: "app-sidebar-cmp",
  templateUrl: "sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  public logo: string | undefined;
  public menuItems: IRoute[] = [];
  ps: PerfectScrollbar;

  private user: IUser | undefined;
  private host: IHost | undefined;
  hostMessages: IMessage[] = [];
  unread: number | undefined;

  constructor(
    private sessionService: SessionService,
    private themeService: ThemeService,
    private router: Router,
    private hostService: HostService
  ) {
    this.logo = this.themeService.getLogoWhiteBluePath();
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );
      this.ps = new PerfectScrollbar(elemSidebar);
    }

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

  activeSub(sub: string): boolean {
    const len = sub.split("--").length;
    const paths = window.location.pathname.split("/");
    const parent = this.menuItems.find((item) => item.collapse === sub);

    return parent.children.some((item) => item.path === paths[len + 1]);
  }

  updatePS(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      this.ps.update();
    }
  }

  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
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
            if (roleUrls.find((url: string) => url.indexOf(route.path) === 0)) {
              this.menuItems.push(route);
            }
          }
        }
      });
    }
  }
}
