import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { startWith, debounceTime, skip } from "rxjs";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IHost } from "src/app/host/models/host.model";
import {
  ICarPark,
  IFacility,
  IFacilityMarket,
} from "src/app/host/vehicles/models/facility.model";
import { SessionService } from "src/app/shared/services/session/session.service";

declare const $: any;
declare const google: any;

@Component({
  selector: "app-facility-list",
  templateUrl: "./facility-list.component.html",
  styleUrls: ["./facility-list.component.scss"],
})
export class FacilityListComponent implements OnInit {
  private host: IHost | undefined;
  facilityMarkets: IFacilityMarket[] = [];
  filteredFacilityMarkets: IFacilityMarket[] = [];
  searchTermCtrl = new FormControl("");
  groupedFacilities: Record<string, IFacility[]> | null;
  hoveredFacility: IFacility | undefined;
  selectedFacility: IFacility | undefined;

  map: any;
  markers: any[] = [];

  constructor(
    private facilityService: FacilityService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.sessionService.getHost$().subscribe((host) => {
      this.host = host;
      if (this.host) {
        this.getFacilityMarkets();
      }
    });

    this.searchTermCtrl.valueChanges
      .pipe(startWith(""), skip(1), debounceTime(500))
      .subscribe(() => {
        this.onSearch();
      });
  }

  private getFacilityMarkets(): void {
    this.facilityService.getMarket().subscribe({
      next: (res: IFacilityMarket[]) => {
        this.facilityMarkets = res.map((fm) => {
          const isActive = fm.facilities.some(
            (facility) =>
              facility.status === "active" ||
              (facility.status === "soldout" &&
                facility.ownerCompanyIds.includes(this.host.id))
          );
          return {
            market: { ...fm.market, isActive },
            facilities: fm.facilities.map((f) => ({
              ...f,
              ...this.getDailyRate(f.carParks),
            })),
          };
        });
        this.onSearch();
      },
      error: () => {
        this.facilityMarkets = [];
        this.filteredFacilityMarkets = [];
      },
    });
  }

  private getDailyRate(carParks: ICarPark[]): object {
    let rate = {
      amount: 0,
      discountedAmount: 0,
      discountPercent: 0,
    };

    if (carParks.length > 0) {
      const minRateCarPark = carParks.reduce((prev, curr) =>
        prev.dailyRates.currentRate.currentDiscountedAmount <
        curr.dailyRates.currentRate.currentDiscountedAmount
          ? prev
          : curr
      );
      const discountPercent =
        (minRateCarPark.dailyRates.currentRate.amount -
          minRateCarPark.dailyRates.currentRate.currentDiscountedAmount) /
        minRateCarPark.dailyRates.currentRate.amount;

      rate.amount = minRateCarPark.dailyRates.currentRate.amount;
      rate.discountedAmount =
        minRateCarPark.dailyRates.currentRate.currentDiscountedAmount;
      rate.discountPercent = discountPercent;
    }

    return rate;
  }

  private initMap(): void {
    const mapOptions = {
      zoom: 4,
      center: new google.maps.LatLng(37.09, -95.71),
      scrollwheel: false,
      zoomControl: true,
    };
    this.map = new google.maps.Map(
      document.getElementById("facility-map"),
      mapOptions
    );

    const topLeftCtrl = document.getElementById(
      "top-left-control"
    ) as HTMLDivElement;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(topLeftCtrl);
    setTimeout(() => {
      topLeftCtrl.style.display = "block";
    }, 1500);

    const pacInput = document.getElementById("pac-input") as HTMLInputElement;
    const searchBox = new google.maps.places.SearchBox(pacInput);

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this.map.fitBounds(bounds);
    });
  }

  private setMarkers(): void {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];

    if (!this.map || this.filteredFacilityMarkets.length === 0) {
      return;
    }

    let facilities = [];
    this.filteredFacilityMarkets.forEach((fm) => {
      facilities = [...facilities, ...fm.facilities];
    });
    const center = new google.maps.LatLng(
      facilities[0].coordinate.coordinates[1],
      facilities[0].coordinate.coordinates[0]
    );

    this.map.setZoom(10);
    setTimeout(() => {
      this.map.panTo(center);
    }, 500);

    facilities.forEach((f: IFacility) => {
      const position = new google.maps.LatLng(
        f.coordinate.coordinates[1],
        f.coordinate.coordinates[0]
      );

      const marker = new google.maps.Marker({
        position,
      });
      marker.setMap(this.map);
      this.markers.push(marker);

      const infoWindow = new google.maps.InfoWindow();
      infoWindow.setContent(f.name);
      infoWindow.open(marker.getMap(), marker);

      marker.addListener("mouseover", () => {
        infoWindow.close();
        infoWindow.open(marker.getMap(), marker);
        this.hoveredFacility = f;
      });

      marker.addListener("mouseout", () => {
        this.hoveredFacility = undefined;
      });
    });

    // this.markers.forEach((marker) => {
    //   marker.setMap(null);
    // });
    // this.markers = [];

    // if (!this.map || !this.groupedFacilities) {
    //   return;
    // }

    // const facilities = Object.values(this.groupedFacilities);
    // const center = new google.maps.LatLng(
    //   facilities[0][0].coordinate.coordinates[1],
    //   facilities[0][0].coordinate.coordinates[0]
    // );

    // this.map.setZoom(10);
    // setTimeout(() => {
    //   this.map.panTo(center);
    // }, 500);

    // facilities.forEach((fs) => {
    //   fs.forEach((f: IFacility) => {
    //     const position = new google.maps.LatLng(
    //       f.coordinate.coordinates[1],
    //       f.coordinate.coordinates[0]
    //     );

    //     const marker = new google.maps.Marker({
    //       position,
    //     });
    //     marker.setMap(this.map);
    //     this.markers.push(marker);

    //     const infoWindow = new google.maps.InfoWindow();
    //     infoWindow.setContent(f.name);
    //     infoWindow.open(marker.getMap(), marker);

    //     marker.addListener("mouseover", () => {
    //       infoWindow.close();
    //       infoWindow.open(marker.getMap(), marker);
    //       this.hoveredFacility = f;
    //     });

    //     marker.addListener("mouseout", () => {
    //       this.hoveredFacility = undefined;
    //     });
    //   });
    // });
  }

  onSearch(): void {
    this.filteredFacilityMarkets = this.facilityMarkets;

    const term = this.searchTermCtrl.value.toLowerCase();
    if (term) {
      this.filteredFacilityMarkets = [];
      this.facilityMarkets.forEach((fm) => {
        const {
          market: { name: marketName },
          facilities,
        } = fm;
        if (marketName.toLowerCase().includes(term)) {
          this.filteredFacilityMarkets.push(fm);
        } else if (
          facilities.some((f) => f.name.toLowerCase().includes(term))
        ) {
          const filteredFacilities = facilities.filter((f) =>
            f.name.toLowerCase().includes(term)
          );
          this.filteredFacilityMarkets.push({
            ...fm,
            facilities: filteredFacilities,
          });
        }
      });
    }

    this.setMarkers();

    // let facilities = this.facilities;
    // if (this.searchTermCtrl.value) {
    //   facilities = this.facilities.filter((f) =>
    //     f.name.toLowerCase().includes(this.searchTermCtrl.value.toLowerCase())
    //   );
    // }
    // this.groupedFacilities = facilities.reduce((r, a) => {
    //   r[a.airportMarket] = r[a.airportMarket] || [];
    //   r[a.airportMarket].push(a);

    //   return r;
    // }, Object.create(null));

    // this.setMarkers();
  }

  onMouseEnter(facility: IFacility): void {
    this.hoveredFacility = facility;
    setTimeout(() => {
      this.map.panTo(
        new google.maps.LatLng(
          facility.coordinate.coordinates[1],
          facility.coordinate.coordinates[0]
        )
      );
    }, 500);
  }

  onMouseOut(): void {
    this.hoveredFacility = undefined;
  }

  viewFacility(facility: IFacility): void {
    this.selectedFacility = facility;

    $("#facilityDetailsModal").modal("show");
  }

  viewWatchList(): void {
    window.open(
      "https://www.parkmycarshare.com/near-airport-locations",
      "_blank"
    );
  }
}
