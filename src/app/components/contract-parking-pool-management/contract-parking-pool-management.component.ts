import { ENTER, COMMA } from "@angular/cdk/keycodes";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

import { ITab } from "src/app/backoffice/host-management/components/host-view/host-view.component";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacilityMarket, IMarket, IFacility } from "src/app/host/vehicles/models/facility.model";
import { IPool, IPoolGroup, IPoolParker, IPoolAdmin } from "src/app/pool/contract-parking/models/pool.model";
import { PoolManagementService } from "src/app/pool/contract-parking/services/pool-management.service";
import { PATTERNS } from "src/app/shared/constants/patterns";
import { IUser } from "src/app/shared/models/user.model";
import { SessionService } from "src/app/shared/services/session/session.service";
import { UserService } from "src/app/users/services/user.service";

declare const $: any;

@Component({
  selector: "app-contract-parking-pool-management",
  templateUrl: "./contract-parking-pool-management.component.html",
  styleUrls: ["./contract-parking-pool-management.component.scss"],
})
export class ContractParkingPoolManagementComponent implements OnInit {
  user: IUser | undefined;

  facilityMarkets: IFacilityMarket[] = [];
  selectedMarket: IMarket | undefined;
  selectedFacility: IFacility | undefined;
  tabs: ITab[] = [];
  pools: IPool[] = [];
  selectedPool: IPool | undefined;

  readonly poolModalId = "poolModal";
  poolForm: FormGroup;
  marketFacilities: IFacility[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  status: string | undefined;

  groups: IPoolGroup[] = [];
  parkers: Record<string, IPoolParker[]> | undefined;
  readonly poolParkerModalId = "poolParkerModal";
  poolParkerForm: FormGroup;

  readonly poolAdminModalId = "poolAdminModal";
  poolAdminForm: FormGroup;
  users: IUser[] = [];

  constructor(
    private facilityService: FacilityService,
    private userService: UserService,
    private poolManagementService: PoolManagementService,
    private sessionService: SessionService
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.getAllMarkets();
    this.getAllUsers();
    this.sessionService.getUser$().subscribe((user) => {
      this.user = user;
      if (this.user?.turoUserType === "backoffice") {
        this.tabs = [
          {
            id: "configuration",
            name: "Configuration",
          },
          {
            id: "parkers",
            name: "Parkers",
          },
          {
            id: "users",
            name: "Users",
          },
        ];
      } else {
        if (this.user?.roles[0].roleName === "admin") {
          this.tabs = [
            {
              id: "parkers",
              name: "Parkers",
            },
            {
              id: "users",
              name: "Users",
            },
          ];
        } else {
          this.tabs = [
            {
              id: "parkers",
              name: "Parkers",
            },
          ];
        }
      }
    });
  }

  changeFacility(facility: IFacility, market: IMarket): void {
    this.selectedFacility = facility;
    this.selectedMarket = market;

    this.poolManagementService
      .getPoolsByFacilityId<IPool[]>(this.selectedFacility.id)
      .subscribe({
        next: (res) => {
          this.setPools(res);
        },
        error: () => {
          this.pools = [];
        },
      });
  }

  changePool(pool: IPool): void {
    this.selectedPool = pool;
    this.status = pool.status;
    this.groups = pool.groups;
    const groupIds = pool.administratorResponse.find(
      (admin) => admin.userId === this.user?.id
    )?.groupIds;
    if (groupIds?.length > 0) {
      this.groups = this.groups.filter((group) => groupIds.includes(group.id));
    }
    this.getPoolParkers();
  }

  addPoolGroup(event: MatChipInputEvent): void {
    const group = (event.value || "").trim();

    if (group && !this.poolForm.value.groups.includes(group)) {
      const groups = this.poolForm.value.groups;
      this.poolForm.get("groups").setValue([...groups, { name: group }]);
    }

    event.chipInput!.clear();
  }

  removePoolGroup(group: string): void {
    const index = this.poolForm.value.groups.indexOf((g) => g.name === group);

    if (index >= 0) {
      this.poolForm.value.groups.splice(index, 1);
    }
  }

  savePool(pool?: IPool): void {
    let payload: any;
    if (pool) {
      payload = pool;
      payload.status = this.status;
    } else {
      payload = this.poolForm.value;
    }

    this.poolManagementService.savePool<IPool>(payload).subscribe({
      next: (res) => {
        if (pool) {
          const index = this.pools.findIndex((p) => p.id === pool.id);
          this.pools[index] = res;
        } else {
          this.setPools([...this.pools, res]);
        }

        $(`#${this.poolModalId}`).modal("hide");
      },
    });
  }

  saveParker(): void {
    this.poolManagementService
      .saveParker<IPoolParker>({
        ...this.poolParkerForm.value,
        poolId: this.selectedPool?.id,
      })
      .subscribe({
        next: (res) => {
          const index = this.parkers[res.poolGroupId].findIndex(
            (parker) => parker.id === res.id
          );
          if (index > -1) {
            this.parkers[res.poolGroupId][index] = res;
          } else {
            this.parkers[res.poolGroupId].push(res);
          }
          $(`#${this.poolParkerModalId}`).modal("hide");
        },
      });
  }

  editParker(parker: IPoolParker): void {
    this.poolParkerForm.patchValue(parker);

    $(`#${this.poolParkerModalId}`).modal("show");
  }

  saveAdmin(): void {
    this.poolManagementService
      .saveAdmin<IPool>({
        ...this.poolAdminForm.value,
        poolId: this.selectedPool?.id,
      })
      .subscribe({
        next: (res) => {
          const index = this.pools.findIndex(
            (pool) => pool.id === this.selectedPool?.id
          );
          this.pools[index] = res;
          this.setPools(this.pools);
          this.selectedPool = this.pools[index];
          $(`#${this.poolAdminModalId}`).modal("hide");
        },
      });
  }

  removeAdmin(admin: IPoolAdmin): void {
    this.poolManagementService
      .removeAdmin<IPool>(this.selectedPool?.id, admin.userId)
      .subscribe({
        next: (res) => {
          const index = this.pools.findIndex(
            (pool) => pool.id === this.selectedPool?.id
          );
          this.pools[index] = res;
          this.setPools(this.pools);
          this.selectedPool = this.pools[index];
        },
      });
  }

  private getAllMarkets(): void {
    this.facilityService.getMarket<IFacilityMarket[]>().subscribe({
      next: (res) => {
        this.facilityMarkets = res;
        this.changeFacility(
          this.facilityMarkets[0].facilities[0],
          this.facilityMarkets[0].market
        );
      },
      error: () => {
        this.facilityMarkets = [];
        this.selectedFacility = undefined;
      },
    });
  }

  private getAllUsers(): void {
    this.userService.getUsersForProduct<IUser[]>().subscribe({
      next: (res: IUser[]) => {
        this.users = res;
      },
      error: () => {
        this.users = [];
      },
    });
  }

  private initForms(): void {
    this.poolForm = new FormGroup({
      marketId: new FormControl("", [Validators.required]),
      facilityId: new FormControl({ value: "", disabled: true }, [
        Validators.required,
      ]),
      name: new FormControl("", [Validators.required]),
      isPaidByCard: new FormControl(false),
      billingContact: this.initContract(),
      groups: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      monthlyRate: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      credentialFee: new FormControl(null, [
        Validators.required,
        Validators.min(0),
      ]),
      initialAdministrator: this.initContract(),
    });

    this.poolForm.get("marketId")?.valueChanges.subscribe((id) => {
      this.marketFacilities =
        this.facilityMarkets.find((fm) => fm.market.id === id)?.facilities ??
        [];
      if (this.marketFacilities.length > 0) {
        this.poolForm.get("facilityId").enable();
      } else {
        this.poolForm.get("facilityId").disable();
      }
    });

    this.poolParkerForm = new FormGroup({
      id: new FormControl(""),
      name: new FormControl("", [Validators.required]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      phone: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.PHONE),
      ]),
      poolGroupId: new FormControl("", [Validators.required]),
      isActive: new FormControl(true),
    });

    this.poolAdminForm = new FormGroup({
      user: this.initContract(),
      groups: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
      role: new FormControl("", [Validators.required]),
    });
  }

  private initContract(): FormGroup {
    return new FormGroup({
      firstname: new FormControl("", [Validators.required]),
      lastname: new FormControl("", [Validators.required]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.EMAIL),
      ]),
      phoneNumber: new FormControl("", [
        Validators.required,
        Validators.pattern(PATTERNS.PHONE),
      ]),
    });
  }

  private setPools(pools: IPool[]): void {
    this.pools = pools.map((pool) => {
      const { groups, administratorResponse, ...rest } = pool;

      return {
        ...rest,
        groups,
        administratorResponse: administratorResponse.map(
          ({ groupIds, ...rest }) => {
            return {
              ...rest,
              groupIds,
              groupNames: groupIds
                .map((id) => groups.find((group) => group.id === id)?.name)
                .join(", "),
            };
          }
        ),
      };
    });
  }

  private getPoolParkers(): void {
    this.poolManagementService
      .getParkersByPoolId<IPoolParker[]>(this.selectedPool?.id)
      .subscribe({
        next: (res) => {
          this.parkers = {};
          this.groups.forEach((group) => {
            const parkers = res.filter((item) => item.poolGroupId === group.id);

            this.parkers[group.id] = parkers;
          });
        },
      });
  }
}
