import { Component, OnInit } from "@angular/core";
import { FacilityService } from "src/app/facility/services/facility.service";
import { IFacility } from "src/app/host/vehicles/models/facility.model";

@Component({
  selector: "app-locations",
  templateUrl: "./locations.component.html",
  styleUrls: ["./locations.component.scss"],
})
export class LocationsComponent implements OnInit {
  searchCriteria: string = "";
  status: string = "all";
  hasReserved: boolean = false;
  hasUnlimited: boolean = false;
  locations: IFacility[] = [];
  filteredLocations: IFacility[] = [];

  constructor(private facilityService: FacilityService) {}

  ngOnInit(): void {
    this.getFacilities();
  }

  onSearch(): void {
    this.filteredLocations = this.locations.filter(
      (loc) =>
        loc.airportMarket
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase()) ||
        loc.name
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase()) ||
        loc.address.address1
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase()) ||
        loc.address.address2
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase()) ||
        loc.address.city
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase()) ||
        loc.address.state
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase()) ||
        loc.address.zip
          ?.toLowerCase()
          .includes(this.searchCriteria.trim().toLowerCase())
    );

    if (this.status !== "all") {
      this.filteredLocations = this.filteredLocations
        .filter((loc) => loc.status === this.status)
        .sort((a, b) => {
          return (
            a.airportMarket ? `${a.airportMarket} - ${a.name}` : a.name
          ).localeCompare(
            b.airportMarket ? `${b.airportMarket} - ${b.name}` : b.name
          );
        });
    } else {
      const sortArr = ["comingsoon", "active", "soldout"];
      this.filteredLocations = this.filteredLocations.sort((a, b) => {
        const sortByStatus =
          sortArr.indexOf(a.status) - sortArr.indexOf(b.status);

        if (sortByStatus !== 0) {
          return sortByStatus;
        }

        return (
          a.airportMarket ? `${a.airportMarket} - ${a.name}` : a.name
        ).localeCompare(
          b.airportMarket ? `${b.airportMarket} - ${b.name}` : b.name
        );
      });
    }

    if (this.hasReserved) {
      this.filteredLocations = this.filteredLocations.filter((loc) =>
        loc.carParks.some(
          (carPark) =>
            carPark.reservedSpaceRates.currentRate.currentDiscountedAmount
        )
      );
    }

    if (this.hasUnlimited) {
      this.filteredLocations = this.filteredLocations.filter((loc) =>
        loc.carParks.some(
          (carPark) => carPark.addOnUnlimitedRates.currentRate?.amount
        )
      );
    }
  }

  private getFacilities(): void {
    this.facilityService.getActiveFacilities<IFacility[]>().subscribe({
      next: (res: IFacility[]) => {
        this.locations = res;
        this.onSearch();
      },
      error: () => {
        this.locations = [];
        this.filteredLocations = [];
      },
    });
  }
}
