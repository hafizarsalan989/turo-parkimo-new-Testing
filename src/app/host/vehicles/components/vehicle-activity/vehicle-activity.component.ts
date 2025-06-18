import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-vehicle-activity",
  templateUrl: "./vehicle-activity.component.html",
  styleUrls: ["./vehicle-activity.component.scss"],
})
export class VehicleActivityComponent {
  vehicleId: string;

  sessionTableId: string = "viewSessionsDatatable";

  constructor(private activatedRoute: ActivatedRoute) {
    this.vehicleId = this.activatedRoute.snapshot.params["id"];
  }
}
