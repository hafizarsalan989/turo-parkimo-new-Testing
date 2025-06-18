import { Component, OnInit } from "@angular/core";
import { IImage } from "src/app/components/img-viewer/img-viewer.component";
import { IFacility } from "src/app/host/vehicles/models/facility.model";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
})
export class ProductListComponent implements OnInit {
  facilities: IFacility[] = [];
  previewImages: IImage[] = [];
  showPreview: boolean = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  private getProducts(): void {
    this.productService.getProducts<IFacility[]>().subscribe({
      next: (res: IFacility[]) => (this.facilities = res),
      error: () => (this.facilities = []),
    });
  }

  openImgViewer(facility: IFacility): void {
    this.previewImages = [
      {
        image: facility.imageUrl,
        title: facility.name,
      },
    ];

    this.showPreview = true;
  }
}
