import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SlickCarouselComponent } from "ngx-slick-carousel";
import { IFacility } from "src/app/host/vehicles/models/facility.model";

declare const $: any;

@Component({
  selector: "app-facility-details-modal",
  templateUrl: "./facility-details-modal.component.html",
  styleUrls: ["./facility-details-modal.component.scss"],
})
export class FacilityDetailsModalComponent implements OnInit {
  @Input() facility: IFacility | undefined;
  @ViewChild("slickMain") slickMain: SlickCarouselComponent;
  @ViewChild("slickThumbnail") slickThumbnail: SlickCarouselComponent;

  slides = [];
  slideConfig2 = {
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    focusOnSelect: true,
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    $("#facilityDetailsModal").on("shown.bs.modal", () => {
      this.facility.images.forEach((img: string) => {
        this.slides.push({ img });
      });
    });
    $("#facilityDetailsModal").on("hidden.bs.modal", () => {
      this.slides = [];
    });
  }

  onChangeSlickMain({ currentSlide }: { currentSlide: number }): void {
    this.slickThumbnail.slickGoTo(currentSlide);
  }

  onChangeSlickThumbnail({ currentSlide }: { currentSlide: number }): void {
    this.slickMain.slickGoTo(currentSlide);
  }

  buyReservedSpaces(): void {
    window.open(
      "https://www.parkmycarshare.com/reserved-space-inquiry",
      "_blank"
    );
  }
}
