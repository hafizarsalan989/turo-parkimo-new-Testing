import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { IRole, IUser } from "src/app/shared/models/user.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { UserService } from "../../services/user.service";
import { Location } from "@angular/common";
import { IHost } from "src/app/host/models/host.model";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { HostService } from "src/app/host/services/host/host.service";
import { FacilityService } from "src/app/facility/services/facility.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import {
  checkPasswords,
  CustomErrorStateMatcher,
} from "src/app/shared/utils/custom-error-state-matcher/custom-error-state-matcher";
@Component({
  selector: "app-user-edit",
  templateUrl: "./user-edit.component.html",
  styleUrls: ["./user-edit.component.scss"],
})
export class UserEditComponent implements OnInit {
  user: IUser | null;
  profileForm: FormGroup;
  userRoles: IRole[] = [];
  userType: string | null;
  userTypes: string[] = ["host", "facility", "backoffice"];
  typeId: string | null;
  types: (IHost | IFacility)[];
  passwordMatcher = new CustomErrorStateMatcher();
  passwordForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private notificationService: NotificationService,
    private userService: UserService,
    private hostService: HostService,
    private facilityService: FacilityService,
    private sessionService: SessionService,
    private swalService: SwalService
  ) {}

  ngOnInit(): void {
    this.sessionService.getUser$().subscribe((user) => {
      this.userType = user?.turoUserType;
    });
    this.sessionService.getHost$().subscribe((host) => {
      this.typeId = host?.id;
    });

    this.initForm();

    const userId: string | null = this.activatedRoute.snapshot.params["id"];
    if (userId) {
      this.getUser(userId);
    }

    this.getUserRoles();
  }

  private getUser(id: string): void {
    this.userService.getUserById<IUser>(id).subscribe({
      next: (res: IUser) => {
        this.user = res;
        this.profileForm.patchValue({
          ...res,
          userType: res.turoUserType,
          typeId:
            res.turoUserType === "host"
              ? res.host?.id
              : res.facilities.map((facility) => facility.id),
          roles: res.roles[0].roleName,
        });
      },
      error: () => (this.user = null),
    });
  }

  private getUserRoles(): void {
    this.userService.getUserRoles<IRole[]>().subscribe({
      next: (res: IRole[]) => (this.userRoles = res),
      error: () => (this.userRoles = []),
    });
  }

  private initForm(): void {
    this.profileForm = new FormGroup({
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
      userType: new FormControl(
        this.userType !== "backoffice" ? this.userType : "",
        [Validators.required]
      ),
      typeId: new FormControl(null),
      roles: new FormControl(null, [Validators.required]),
      isEmailVerified: new FormControl(false),
    });

    this.profileForm
      .get("userType")
      .valueChanges.subscribe((userType: string) => {
        if (userType !== "backoffice") {
          setTimeout(() => {
            this.profileForm.get("typeId").setValidators([Validators.required]);
            this.profileForm.get("typeId").enable();
          }, 0);

          this.profileForm
            .get("typeId")
            .setValue(userType === "facility" ? [] : null);

          this.getTypes(userType as "host" | "facility");
        } else {
          setTimeout(() => {
            this.profileForm.get("typeId").clearValidators();
            this.profileForm.get("typeId").setValue(null);
            this.profileForm.get("typeId").disable();
          }, 0);
        }
      });

    this.passwordForm = new FormGroup({
      forcePasswordChange: new FormControl(false),
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

  private getTypes(userType: "host" | "facility"): void {
    if (userType === "host") {
      this.hostService.getHosts<IHost[]>().subscribe({
        next: (hosts: IHost[]) => (this.types = hosts),
      });
    } else {
      this.facilityService.getActiveFacilities<IFacility[]>().subscribe({
        next: (facilities: IFacility[]) => (this.types = facilities),
      });
    }
  }

  get isFormDirty(): boolean {
    return this.profileForm.dirty;
  }

  getTypeNames(typeIds: (string | { id: string; name: string })[]): string[] {
    if (!typeIds || !this.types) return [];
    return typeIds
      .map((type) => {
        const id = typeof type === "string" ? type : type.id;
        return this.types.find((t) => t.id === id)?.name;
      })
      .filter((name) => !!name);
  }

  saveUser(): void {
    const roles: IRole[] = this.userRoles.filter(
      (userRole: IRole) => userRole.roleName === this.profileForm.value.roles
    );

    const { typeId, userType, ...rest } = this.profileForm.value;

    const payload = {
      ...this.user,
      ...rest,
      roles,
      ...(userType === "facility" && { facilityIds: typeId }),
      ...(userType === "host" && { companyId: typeId }),
    };

    let req = this.userService.createUser({ ...payload, userType });
    if (this.user?.id) {
      req = this.userService.updateUser(payload);
    }

    req.subscribe({
      next: () => {
        this.notificationService.notify(
          "notification",
          "success",
          `User is ${this.user ? "updated" : "created"}`
        );
        this.location.back();
      },
    });
  }

  cancel(): void {
    this.location.back();
  }

  deleteUser(): void {
    this.swalService.fire(
      `Sure you want to delete this user ${this.user.email}`,
      "Warning",
      "warning",
      "Yes, delete it",
      "No",
      true,
      () => {
        this.userService.deleteUser(this.user.id).subscribe({
          next: () => {
            this.notificationService.notify(
              "notification",
              "danger",
              "User is deleted"
            );
            this.location.back();
          },
        });
      }
    );
  }

  handleCancel(): void {
    this.swalService.fire(
      "Are you sure to discard?",
      "Warning",
      "warning",
      "Yes, discard",
      "No",
      true,
      () => {
        if (this.user) {
          this.profileForm.patchValue({
            ...this.user,
            userType: this.user.turoUserType,
            typeId: this.user.host?.id,
            roles: this.user.roles[0]?.roleName,
          });
        } else {
          this.profileForm.reset();
        }

        this.profileForm.markAsPristine();
      }
    );
  }

  savePassword(): void {
    this.swalService.fire(
      `Sure you want to update password of this user ${this.user.email}`,
      "Warning",
      "warning",
      "Yes, update it",
      "No",
      true,
      () => {
        const payload = {
          userId: this.user.id,
          password: this.passwordForm.value.password,
        };

        this.userService.updatePassword(payload).subscribe({
          next: () =>
            this.notificationService.notify(
              "notification",
              "success",
              "Password is updated"
            ),
        });
      }
    );
  }
}
