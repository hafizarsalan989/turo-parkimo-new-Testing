import { Component, OnInit, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BreakpointObserver } from "@angular/cdk/layout";
import {
  StepperOrientation,
  StepperSelectionEvent,
} from "@angular/cdk/stepper";
import { Observable, map, switchMap } from "rxjs";

import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility, IFacilityMarket, IMarket } from "src/app/host/vehicles/models/facility.model";
import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { VehicleService } from "src/app/host/vehicles/services/vehicle.service";
import {
  IGateway,
  ICard,
  ICardOnFile,
} from "src/app/shared/models/card-on-file.model";
import { IPermit } from "src/app/shared/models/parking-pass.model";
import { CardOnFileService } from "src/app/shared/services/card-on-file/card-on-file.service";
import { SessionService } from "src/app/shared/services/session/session.service";
import {
  IHost,
  IMailingPreferenceOption,
} from "src/app/host/models/host.model";
import { MatStepper } from "@angular/material/stepper";
import { HostService } from "src/app/host/services/host/host.service";
import { SwalService } from "src/app/shared/services/swal/swal.service";
import { IImage } from "src/app/components/img-viewer/img-viewer.component";
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
declare const $: any;

@Component({
  selector: "app-vehicle-activator",
  templateUrl: "./vehicle-activator.component.html",
  styleUrls: ["./vehicle-activator.component.scss"],
})
export class VehicleActivatorComponent implements OnInit {
  private host: IHost | undefined;

  @ViewChild("stepper") stepper: MatStepper;
  // Tree control properties
  treeControl = new NestedTreeControl<any>(node => node.children);
  treeDataSource = new MatTreeNestedDataSource<any>();
  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;



  stepperOrientation: Observable<StepperOrientation>;

  vehicles: IVehicle[] = [];

  get vehicleNames(): string {
    return this.vehicles.map((v) => v.name).join(", ");
  }

  get addonVehicleNames(): string {
    return this.vehicles
      .filter((v) => this.unlimitedAddonForm.value.vehicleIds.includes(v.id))
      .map((v) => v.name)
      .join(", ");
  }

  addonTotalRate(unlimitedAddon: {
    facilityIds: string[];
    vehicleIds: string[];
    rates: number[];
    carParkIds: string[];
  }): number {
    let totalRate = 0;
    const facility = this.facilities.find(
      (f) => f.id === this.facilityForm.value.id
    );

    if (facility.unlimitedOnlyFacility) {
      totalRate =
        unlimitedAddon.rates.reduce(
          (accumulator, currentValue) => accumulator + currentValue,
          0
        ) * unlimitedAddon.vehicleIds.length;
    } else {
      unlimitedAddon.carParkIds.forEach((id, index) => {
        totalRate += unlimitedAddon.rates[index];
      });
    }

    return totalRate;
  }

  facilities: IFacility[] = [];
  facilityForm: FormGroup | undefined;
  unlimitedAddons: Record<string, string | number | boolean>[] = [];
  unlimitedAddonForm: FormGroup | undefined;
  receiptForm: FormGroup | undefined;
  shipmentForm: FormGroup | undefined;
  selectedFacility: any = null;

  openModal() {
    setTimeout(() => {
      ($('#quickLinkModal') as any).modal('show');
    }, 0);
  }

  closeModal() {
    ($('#quickLinkModal') as any).modal('hide');
  }

  imagesVisible = false;

  // toggleImages() {
  //   this.imagesVisible = !this.imagesVisible;
  // }
  // imagesVisible = false;
  get imageViewerImages(): IImage[] {
    return this.selectedFacility?.images?.map(url => ({
      image: url,
      thumbImage: url,
      title: this.selectedFacility.name || ''
    })) || [];
  }

  imageViewIndex = 0;

  toggleImages() {
    this.imagesVisible = !this.imagesVisible;
  }

  openImageView(index: number) {
    this.imageViewIndex = index;
    this.imagesVisible = true;
  }

  closeImageView() {
    this.imagesVisible = false;
    this.imageViewIndex = 0;
  }



  get isAllowedAddon(): boolean {
    return (
      this.host?.allowAddOnUnlimited &&
      this.facilityForm.value.allowAddOnUnlimited
    );
  }

  gateway: IGateway | null;

  creditCardModalId: string;
  isPrimary: boolean = false;

  mailingPreferenceOptions: IMailingPreferenceOption[] = [];

  isAgree = false;

  selectedVehicleCarParkList: Map<string, string | null> = new Map();

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private facilityService: FacilityService,
    private cardOnFileService: CardOnFileService,
    private sessionService: SessionService,
    private vehicleService: VehicleService,
    private breakpointObserver: BreakpointObserver,
    private hostService: HostService,
    private swalService: SwalService
  ) {
    this.stepperOrientation = this.breakpointObserver
      .observe("(min-width: 800px)")
      .pipe(map(({ matches }) => (matches ? "horizontal" : "vertical")));
  }

  ngOnInit() {
    this.initForms();
    this.getGateway();

    this.sessionService.getHost$().subscribe((res: IHost) => {
      this.host = res;

      if (this.host) {
        const { primaryCard, secondaryCard } = this.host;
        this.setCards(primaryCard, secondaryCard);

        // this.getFacilities();
        this.getMarkets();
        this.getVehicles();
        this.getOpenMailing();
      }
    });
  }

  onChangeFacility(facility: IFacility): void {
    const {
      id,
      monthlyMembershipFee,
      allowAddOnUnlimited,
      isUnlimitedSoldOut,
      rulesUrl,
    } = facility;
    this.facilityForm?.patchValue({
      id,
      amount: monthlyMembershipFee,
      allowAddOnUnlimited: allowAddOnUnlimited && !isUnlimitedSoldOut,
      rulesUrl,
    });
  }

  makeUnlimitedAddons(): void {
    this.unlimitedAddons = [];

    const facility = this.facilities.find(
      (f) => f.id === this.facilityForm.value.id
    );
    if (
      facility &&
      facility.carParks.some((carPark) => carPark.addOnUnlimitedRates)
    ) {
      this.vehicles.forEach((vehicle) => {
        facility.carParks.forEach((carPark) => {
          this.unlimitedAddons.push({
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            facilityId: facility.id,
            facilityName: facility.name,
            carParkId: carPark.id,
            carParkName: carPark.name,
            rate: carPark.addOnUnlimitedRates.currentRate.amount,
            unlimitedOnlyFacility: facility.unlimitedOnlyFacility,
          });
        });
      });
      //const unlimitedFacilityIds = new Set(this.unlimitedAddons.map(a => a.facilityId));

      if (facility.unlimitedOnlyFacility) {
        const facilityIdsArray = Array(this.vehicles.length).fill(facility.id);
        const carParkIdsArray = facility.carParks
          .map(({ id }) => Array(this.vehicles.length).fill(id))
          .flat();

        this.unlimitedAddonForm?.patchValue({
          facilityIds: facilityIdsArray,
          vehicleIds: this.vehicles.map(({ id }) => id),
          rates: facility.carParks.map(
            (carPark) => carPark.addOnUnlimitedRates.currentRate.amount
          ),
          carParkIds: carParkIdsArray,
        });
      }
    }
  }

  onChangeAddon(
    checked: boolean,
    addon: {
      facilityId: string;
      vehicleId: string;
      rate: number;
      carParkId: string;
    }
  ): void {
    const { facilityIds, vehicleIds, rates, carParkIds } =
      this.unlimitedAddonForm?.value;
    const { facilityId, vehicleId, rate, carParkId } = addon;
    if (checked) {
      if (this.selectedVehicleCarParkList.has(vehicleId)) {
        if (this.selectedVehicleCarParkList.get(vehicleId) !== carParkId) {
          return;
        }
      }

      this.selectedVehicleCarParkList.set(vehicleId, carParkId);

      facilityIds.push(facilityId);
      vehicleIds.push(vehicleId);
      rates.push(rate);
      carParkIds.push(carParkId);
    } else {
      this.selectedVehicleCarParkList.delete(vehicleId);

      let index = vehicleIds.findIndex(
        (id: string, idx: number) =>
          id === vehicleId &&
          carParkIds[idx] === carParkId &&
          facilityIds[idx] === facilityId
      );

      if (index > -1) {
        facilityIds.splice(index, 1);
        vehicleIds.splice(index, 1);
        rates.splice(index, 1);
        carParkIds.splice(index, 1);
      }
    }

    this.unlimitedAddonForm?.patchValue({
      facilityIds,
      vehicleIds,
      rates,
      carParkIds,
    });
  }

  isCheckboxDisabled(addon: { vehicleId: string; carParkId: string }): boolean {
    const selectedCarParkId = this.selectedVehicleCarParkList.get(
      addon.vehicleId
    );

    return selectedCarParkId && selectedCarParkId !== addon.carParkId;
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 0) {
      this.unlimitedAddonForm?.reset({
        facilityIds: [],
        vehicleIds: [],
        rates: [],
        carParkIds: [],
      });

      this.unlimitedAddons = [];
      this.selectedVehicleCarParkList.clear();
    }
  }

  addCreditCard(isPrimary: boolean = false): void {
    this.creditCardModalId = "parkingPassCreditCard";
    this.isPrimary = isPrimary;

    setTimeout(() => {
      $(`#${this.creditCardModalId}`).modal("show");
    }, 300);
  }

  saveCardOnFile(event: any): void {
    this.cardOnFileService
      .save<ICardOnFile>({
        ...event,
        isPrimary: this.isPrimary,
        companyId: this.host.id,
      })
      .subscribe({
        next: (res: ICardOnFile) => {
          const { primaryCard, secondaryCard } = res;
          this.sessionService.setHost$({
            ...this.host,
            primaryCard,
            secondaryCard,
          });
          this.setCards(res.primaryCard, res.secondaryCard);

          $(`#${this.creditCardModalId}`).modal("hide");
          setTimeout(() => {
            this.creditCardModalId = "";
          }, 300);
        },
      });
  }

  setToPrimary(): void {
    this.cardOnFileService
      .setPrimary<ICardOnFile>({
        cardOnFileId: this.receiptForm?.get("secondaryCard").get("id").value,
        companyId: this.host.id,
      })
      .subscribe({
        next: (res: ICardOnFile) => {
          this.setCards(res.primaryCard, res.secondaryCard);
        },
      });
  }

  onSelectShipment({ value }: { value: IMailingPreferenceOption }): void {
    this.shipmentForm.get("name").setValue(value.name);
    this.shipmentForm.get("price").setValue(value.price);
  }

  cancel(): void {
    this.location.back();
  }

  finish(): void {
    const { facilityIds, vehicleIds, carParkIds } =
      this.unlimitedAddonForm.value;
    const { isOpenShipment, name, price } = this.shipmentForm.value;
    const shippingOption = isOpenShipment ? null : { name, price };

    const req$1 = this.vehicleService.savePakingPass<IPermit[]>({
      facilityId: this.facilityForm?.get("id").value,
      vehicleIds: this.vehicles.map((v) => v.id),
      shippingOption,
      hostId: this.host?.id,
    });

    const payload = vehicleIds.map((vehicleId: string, index: number) => ({
      facilityId: facilityIds[index],
      vehicleId,
      carParkId: carParkIds[index],
    }));
    const req$2 = this.vehicleService.createAddonUnlimited(payload);

    const nextCallback = () => {
      this.swalService.fire(
        "<p class='text-left'>Your vehicle is now active and you can assign an AVI Tag number to it. We will send you a standard windshield AVI Tag per your shipping method, but if you have an AVI Tag in hand feel free to assign it to your vehicle now. If you need a headlight tag please go to the \"Tag Ordering\" above the vehicle list to add that to your order.</p><p class='text-left'>We recommend keeping a stock of extra AVI tags so that you can immediately put new cars into service or install them as you need for windshield replacements. If you order the extra AVI tags now they will be shipped along with this order for one shipping fee.</p>",
        "Success",
        "success",
        "Ok",
        null,
        false,
        () => {
          this.location.back();
        }
      );
    };

    if (vehicleIds.length > 0) {
      req$1.pipe(switchMap(() => req$2)).subscribe({
        next: () => {
          nextCallback();
        },
      });
    } else {
      req$1.subscribe({
        next: () => {
          nextCallback();
        },
      });
    }
  }

  private initForms(): void {
    this.facilityForm = new FormGroup({
      id: new FormControl("", [Validators.required]),
      amount: new FormControl(NaN),
      rulesUrl: new FormControl(""),
      allowAddOnUnlimited: new FormControl(false),
    });

    this.unlimitedAddonForm = new FormGroup({
      facilityIds: new FormControl([]),
      vehicleIds: new FormControl([]),
      rates: new FormControl([]),
      carParkIds: new FormControl([]),
    });

    this.receiptForm = new FormGroup(
      {
        primaryCard: new FormGroup({
          id: new FormControl(""),
          cardMask: new FormControl(""),
          cardType: new FormControl(""),
          cardExpiration: new FormControl(""),
        }),
        secondaryCard: new FormGroup({
          id: new FormControl(""),
          cardMask: new FormControl(""),
          cardType: new FormControl(""),
          cardExpiration: new FormControl(""),
        }),
      },
      {
        validators: [this.hasCard()],
      }
    );

    this.shipmentForm = new FormGroup({
      isOpenShipment: new FormControl(false),
      name: new FormControl(""),
      price: new FormControl(""),
    });
  }

  private hasCard(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let primaryCard = control.get("primaryCard").value;
      let secondaryCard = control.get("secondaryCard").value;

      if (!primaryCard.id && !secondaryCard.id) {
        return { isRequiredCard: true };
      }

      return null;
    };
  }


  marketMap = new Map<string, string>();

  private getMarkets(): void {
    this.facilityService.getMarket<IFacilityMarket[]>().subscribe({
      next: (markets) => {
        markets.forEach((market) => {
          this.marketMap.set(market.market.id, market.market.name);
        });
        console.log("Market Map: ", this.marketMap);

        this.getFacilities();
      },
      error: () => {
        this.marketMap.clear();
        this.getFacilities();
      },
    });
  }

  
  private groupFacilities(facilities: IFacility[]): any[] {
    const groups: { [key: string]: { name: string; children: IFacility[] } } = {};

    facilities.forEach((facility) => {
      const marketId = facility.marketId;
      const marketName = this.marketMap.get(marketId);
      if (!marketName) return;

      if (!groups[marketId]) {
        groups[marketId] = {
          name: marketName,
          children: [],
        };
      }

      groups[marketId].children.push(facility);
    });

    // Sort each group’s children: AVAILABLE first, SOLD OUT last
    Object.values(groups).forEach(group => {
      group.children.sort((a, b) => {
        const aSoldOut = a.isSubscriptionSoldOut ? 1 : 0;
        const bSoldOut = b.isSubscriptionSoldOut ? 1 : 0;
        return aSoldOut - bSoldOut; // available = 0, sold out = 1 => available comes first
      });
    });

    return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
  }


  private getFacilities(): void {
    this.facilityService.getActiveFacilities().subscribe({
      next: (res: IFacility[]) => {
        const groupedFacilities = this.groupFacilities(res);
        this.treeDataSource.data = groupedFacilities;

        // console.log("Grouped Facilities: ", groupedFacilities);
        console.log("res: ", res);
        this.facilities = res;
      },
      error: () => {
        this.facilities = [];
        this.treeDataSource.data = [];
      },
    });
  }



  private getVehicles(): void {
    this.vehicleService
      .getVehiclesByHostId<IVehicle[]>(this.host.id)
      .subscribe({
        next: (res: IVehicle[]) => {
          const vIds = this.activatedRoute.snapshot.paramMap.get("id")
            ? [this.activatedRoute.snapshot.paramMap.get("id")]
            : this.activatedRoute.snapshot.queryParamMap.get("ids").split(",");
          this.vehicles = res.filter((v) => vIds.includes(v.id));
        },
      });
  }

  private getGateway(): void {
    this.cardOnFileService.getGateway<IGateway>("turopark").subscribe({
      next: (res: IGateway) => (this.gateway = res),
      error: () => (this.gateway = null),
    });
  }

  private setCards(primaryCard?: ICard, secondaryCard?: ICard): void {
    this.receiptForm.patchValue({
      primaryCard: {
        id: primaryCard?.id,
        cardMask: primaryCard?.cardMask,
        cardType: primaryCard?.cardType,
        cardExpiration: primaryCard?.cardExpiration,
      },
      secondaryCard: {
        id: secondaryCard?.id,
        cardMask: secondaryCard?.cardMask,
        cardType: secondaryCard?.cardType,
        cardExpiration: secondaryCard?.cardExpiration,
      },
    });
  }

  private getOpenMailing(): void {
    this.vehicleService.getOpenMailing<unknown | null>(this.host.id).subscribe({
      next: (res) => {
        this.shipmentForm.get("isOpenShipment").setValue(!!res);
        if (!res) {
          this.setShipmentForm();
        } else {
          this.shipmentForm.get("name").clearValidators();
          this.shipmentForm.get("price").clearValidators();
        }
      },
      error: () => {
        this.shipmentForm.get("isOpenShipment").setValue(false);
        this.setShipmentForm();
      },
    });
  }

  private setShipmentForm(): void {
    this.getMailingpreferenceOptions();
    this.shipmentForm.get("name").setValidators([Validators.required]);
    this.shipmentForm.get("price").setValidators([Validators.required]);
    this.shipmentForm.get("name").setErrors({ required: true });
    this.shipmentForm.get("price").setErrors({ required: true });
  }

  private getMailingpreferenceOptions(): void {
    this.hostService
      .getMailingpreferenceOptions<IMailingPreferenceOption[]>()
      .subscribe({
        next: (res: IMailingPreferenceOption[]) =>
          (this.mailingPreferenceOptions = res),
        error: () => (this.mailingPreferenceOptions = []),
      });
  }
}
