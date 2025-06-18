import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { FacilityService } from "src/app/facility/services/facility.service";

import { ISimpleHost } from "src/app/host/models/host.model";
import { HostService } from "src/app/host/services/host/host.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { NotificationService } from "src/app/shared/services/notification/notification.service";
import { UtilService } from "src/app/shared/services/util/util.service";
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDialog } from "@angular/material/dialog";
import { DeliveryFeeComponent } from "../../../../host/delivery-fee/components/delivery-fee/delivery-fee.component";

declare const $: any;

@Component({
  selector: "app-host-list",
  templateUrl: "./host-list.component.html",
  styleUrls: ["./host-list.component.scss"],
})
export class HostListComponent implements OnInit {
  form: FormGroup;
  facilities: IFacility[] = [];
  sortOptions = [
    "Company(ASC)",
    "Company(DESC)",
    "Email(ASC)",
    "Email(DESC)",
    "Name(ASC)",
    "Name(DESC)",
  ];
  advancedForm: FormGroup;


  private hosts: ISimpleHost[] = [];
  sortedHosts: ISimpleHost[] = [];
  searchMode: 'host' | 'vehicle' = 'host';

  constructor(
    private hostService: HostService,
    private facilityService: FacilityService,
    private router: Router,
    private notificationService: NotificationService,
    private utilService: UtilService,
    private fb: FormBuilder,
    private matToogle: MatButtonToggleModule,
    private route: ActivatedRoute,
    private dialog: MatDialog

  ) { }



  onModeChange() {
    this.hostService.setMode(this.searchMode);
  }
  ngOnInit(): void {
    this.hostService.mode$.subscribe((mode) => {
      this.searchMode = mode;
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

    // this.form.get("facilityId").valueChanges.subscribe(() => {
    //   setTimeout(() => {
    //     this.onSearch();
    //   });
    // });

    this.form.get("sort").valueChanges.subscribe((sort) => {
      if (this.hosts.length > 0) {
        this.onSort(sort);
      }
    });
    this.route.queryParams.subscribe(params => {
      const searchCriteria = params['searchCriteria'] || '';
      const facilityId = params['facilityId'] || 'all';
      const query = params['query'] || '';

      this.form.patchValue({ searchCriteria, facilityId });

      if (searchCriteria) {
        this.onSearch();
      }
      else if (query) {
        this.advancedForm.patchValue({ query });
        this.onAdvancedSearch();
      }
    });
    this._getAllActiveFacilities();
  }

  onSearch(): void {
    const { searchCriteria, facilityId, sort } = this.form.value;
    let query = "";
    if (searchCriteria) {
      query += `searchCriteria=${searchCriteria}`;
    }
    if (facilityId !== "all") {
      query += query ? `&facilityId=${facilityId}` : `facilityId=${facilityId}`;
    }

    if (!query) {
      this.notificationService.notify(
        "notification",
        "warning",
        "Please enter search criteria if all markets are selected"
      );

      return;
    }

    this.hostService
      .searchHostManagement<ISimpleHost[]>(`?${query}`)
      .subscribe({
        next: (hosts) => {
          if (hosts.length === 0) {
            this.notificationService.notify(
              "notification",
              "warning",
              `No results for "${searchCriteria}"`
            );
          }
          else {
            if (hosts.length === 1) {
              // Redirect directly to company page
              this.router.navigate([`/backoffice/host-management/${hosts[0].companyId}/view`], {
                queryParams: {

                  query: query || '',
                },
                queryParamsHandling: 'merge'
              });
            }
            
            this.hosts = hosts;
            this.onSort(sort);
          }
        },
        error: () => {
          this.hosts = [];
          // this.onSort(sort);
          this.notificationService.notify(
            "notification",
            "success",
            "Error fetching hosts. Please try again."
          );
          return;
        },
      });
  }
  onAdvancedSearch(): void {
    if (this.advancedForm.invalid) {
      return;
    }

    const queryValue = this.advancedForm.value.query.trim();
    const searchCriteria = `?searchCriteria=${queryValue}`;

    this.hostService.advancedSearchHostManagement<ISimpleHost[]>(searchCriteria).subscribe({
      next: (hosts) => {
        console.log("Advanced Search Results:", hosts);
        this.hosts = hosts;
        if (this.hosts.length > 0) {
          $("#advancedSearchModal").modal("hide");
        } else {
          this.notificationService.notify(
            "notification",
            "success",
            `No results for "${queryValue}"`
          );
        }

        const { sort } = this.form.value;
        this.onSort(sort);
      },
      error: () => {
        this.hosts = [];
      }
    });
  }

  onSort(sort: string): void {
    this.sortedHosts = this.hosts.sort((a, b) => {
      const companyNameA = a.companyName?.toUpperCase();
      const companyNameB = b.companyName?.toUpperCase();
      const ownerNameA = a.ownerName?.toUpperCase();
      const ownerNameB = b.ownerName?.toUpperCase();
      const ownerEmailA = a.ownerEmail?.toUpperCase();
      const ownerEmailB = b.ownerEmail?.toUpperCase();

      switch (sort) {
        case this.sortOptions[0]:
          if (companyNameA < companyNameB) {
            return -1;
          }
          if (companyNameA > companyNameB) {
            return 1;
          }

          return 0;

        case this.sortOptions[1]:
          if (ownerNameA > ownerNameB) {
            return -1;
          }
          if (ownerNameA < ownerNameB) {
            return 1;
          }

          return 0;

        case this.sortOptions[2]:
          if (ownerEmailA < ownerEmailB) {
            return -1;
          }
          if (ownerEmailA > ownerEmailB) {
            return 1;
          }

          return 0;

        case this.sortOptions[3]:
          if (ownerEmailA > ownerEmailB) {
            return -1;
          }
          if (ownerEmailA < ownerEmailB) {
            return 1;
          }

          return 0;

        case this.sortOptions[4]:
          if (ownerNameA < ownerNameB) {
            return -1;
          }
          if (ownerNameA > ownerNameB) {
            return 1;
          }

          return 0;

        case this.sortOptions[5]:
          if (ownerNameA > ownerNameB) {
            return -1;
          }
          if (ownerNameA < ownerNameB) {
            return 1;
          }

          return 0;

        default:
          return 0;
      }
    });
  }

  exportCsv(): void {
    const header = ["Host Name", "Owner Name", "Owner Email"];
    const data = this.sortedHosts.map(
      ({ companyName, ownerName, ownerEmail }) => [
        companyName,
        ownerName,
        ownerEmail,
      ]
    );
    this.utilService.exportCsv({ name: "HostList", header, data });
  }

  private _getAllActiveFacilities(): void {
    this.facilityService.getActiveFacilities<IFacility[]>().subscribe({
      next: (res: IFacility[]) => {
        this.facilities = res;
      },
      error: () => {
        this.facilities = [];
      },
    });
  }

  // view(id: string): void {
  //   this.router.navigate([`/backoffice/host-management/${id}/view`]);
  // } 

  view(id: string): void {
    const { query } = this.advancedForm.value;
    this.router.navigate(
      [`/backoffice/host-management/${id}/view`],
      {
        queryParams: {

          searchCriteria: query || null,
        },
        queryParamsHandling: 'merge'
      }
    );
  }

}

export function minLengthIfNotEmpty(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null; // No validation if the field is empty
    return value.length >= min ? null : { minlengthIfNotEmpty: { requiredLength: min, actualLength: value.length } };
  };
}


export const atLeastOneRequiredValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const { tag, vin, licensePlate } = control.value;
  return tag || vin || licensePlate ? null : { atLeastOneRequired: true };
};
