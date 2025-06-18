import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { IUser } from "src/app/shared/models/user.model";
import { SessionService } from "src/app/shared/services/session/session.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"],
})
export class UserListComponent {
  search: string = "";

  private _user: IUser | undefined;

  constructor(private router: Router, private sessionService: SessionService) {
    this.sessionService.getUser$().subscribe((user) => {
      this._user = user;
    });
  }

  add(): void {
    const url =
      this._user?.turoUserType === "host" ? "/host/user/add" : "/user/add";
    this.router.navigate([url]);
  }
}
