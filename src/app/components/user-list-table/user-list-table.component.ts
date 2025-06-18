import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser } from "src/app/shared/models/user.model";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import {
  CustomErrorStateMatcher,
  checkPasswords,
} from "src/app/shared/utils/custom-error-state-matcher/custom-error-state-matcher";
import { UserService } from "src/app/users/services/user.service";
import { IColumnDef, IDatatableAction } from "../datatable/datatable.component";
import { defaultCol } from "../datatable/datatable.helper";
import { DatePipe } from "@angular/common";

declare const $: any;

@Component({
  selector: "app-user-list-table",
  templateUrl: "./user-list-table.component.html",
  styleUrls: ["./user-list-table.component.scss"],
})
export class UserListTableComponent implements OnInit, OnChanges {
  @Input() companyId: string;
  @Input() search: string = "";
  @Input() tableId = "usersDatatable";

  columnDefs: IColumnDef[] = [
    defaultCol(0, "email", "Email"),
    defaultCol(1, "firstname", "Firstname"),
    defaultCol(2, "lastname", "Lastname"),
    defaultCol(3, "phone", "Phone"),
    {
      ...defaultCol(4, "isDeleted", "Deleted"),
      render: (data) => {
        return data ? "Yes" : "No";
      },
    },
  ];
  actions: IDatatableAction[] = [
    {
      name: "edit",
      icon: "edit",
      className: "btn-info",
      title: "Edit",
      callback: this.edit.bind(this),
    },
    {
      name: "change_password",
      icon: "key",
      className: "btn-danger",
      title: "Change Password",
      callback: this.openPasswordModal.bind(this),
    },
  ];

  users: IUser[] = [];
  loading: boolean;

  passwordForm: FormGroup;
  passwordMatcher = new CustomErrorStateMatcher();
  loadingPassword: boolean;

  private _user: IUser | undefined;

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private loadingService: LoadingService,
    private userService: UserService,
    private notificationService: NotificationService,
    private sessionService: SessionService
  ) {
    this.loadingService.loading$.subscribe(
      (loading) => (this.loading = loading > 0)
    );

    this.sessionService.getUser$().subscribe((user) => {
      this._user = user;

      if (user?.turoUserType === "backoffice") {
        this.columnDefs.splice(
          4,
          0,
          ...[
            defaultCol(5, "host.name", "Turo Host"),
            {
              ...defaultCol(6, "facilities", "Facilities"),
              render: (data) => {
                if (data && data.length > 0) {
                  return data.length > 1
                    ? `${data[0].name} (+${data.length - 1} others)`
                    : data[0].name;
                }
              },
            },
            {
              ...defaultCol(7, "modified", "Last Logged In"),
              render: (data) => {
                return this.datePipe.transform(data, "MM/dd/yyyy hh:mm a");
              },
            },
          ]
        );
      } else if (user?.turoUserType === "host") {
        this.columnDefs.splice(
          4,
          0,
          ...[
            {
              ...defaultCol(5, "facilities", "Facilities"),
              render: (data) => {
                if (data && data.length > 0) {
                  return data.length > 1
                    ? `${data[0].name} (+${data.length - 1} others)`
                    : data[0].name;
                }
              },
            },
            {
              ...defaultCol(6, "modified", "Last Logged In"),
              render: (data) => {
                return this.datePipe.transform(data, "MM/dd/yyyy hh:mm a");
              },
            },
          ]
        );
      } else {
        this.columnDefs.splice(
          4,
          0,
          ...[
            defaultCol(5, "host.name", "Turo Host"),
            {
              ...defaultCol(6, "modified", "Last Logged In"),
              render: (data) => {
                return this.datePipe.transform(data, "MM/dd/yyyy hh:mm a");
              },
            },
          ]
        );
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getUsers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes["companyId"]?.currentValue !== changes["companyId"]?.previousValue
    ) {
      this.getUsers();
    }
  }

  private getUsers(): void {
    this.userService.getUsersForProduct<IUser[]>(this.companyId).subscribe({
      next: (res: IUser[]) => {
        this.users = res;
      },
      error: () => {
        this.users = [];
      },
    });
  }

  edit(id: string): void {
    const url =
      this._user?.turoUserType === "host"
        ? `/host/user/${id}/edit`
        : `/user/${id}/edit`;
    this.router.navigate([url]);
  }

  private initForm(): void {
    this.passwordForm = new FormGroup({
      userId: new FormControl(""),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
      confirmPassword: new FormControl("", [
        Validators.required,
        checkPasswords,
      ]),
    });
  }

  openPasswordModal(userId: string): void {
    this.passwordForm.get("userId").setValue(userId);

    $("#passwordModal").modal("show");
  }

  savePassword(): void {
    this.userService.updatePassword(this.passwordForm.value).subscribe({
      next: () => {
        $("#passwordModal").modal("hide");
        this.notificationService.notify(
          "notification",
          "success",
          "Password is updated"
        );
      },
    });
  }
}
