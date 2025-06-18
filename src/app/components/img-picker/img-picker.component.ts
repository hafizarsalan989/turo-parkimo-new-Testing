import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import imageCompression from "browser-image-compression";

import { ImgService } from "src/app/shared/services/img/img.service";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { NotificationService } from "src/app/shared/services/notification/notification.service";

@Component({
  selector: "app-img-picker",
  templateUrl: "./img-picker.component.html",
  styleUrls: ["./img-picker.component.scss"],
})
export class ImgPickerComponent implements OnInit {
  @Input() url: string;
  @Input() editable: boolean;
  @Input() imageType: string;
  @Input() legend: string;
  @Input() btnSelectTitle: string = "Select Image";
  @Input() btnChangeTitle: string = "Change";
  @Input() btnRemoveTitle: string = "Remove";

  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  compressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2400,
    useWebWorker: true,
    fileType: "image/png",
  };

  constructor(
    private imgService: ImgService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}

  async onChange(event: Event): Promise<void> {
    try {
      this.loadingService.start();

      const compressedFile = await imageCompression(
        event.target["files"][0],
        this.compressionOptions
      );

      const formData: FormData = new FormData();
      formData.append("imageType", this.imageType);
      formData.append("file", new File([compressedFile], compressedFile.name)); // API doesn't receive blob

      this.imgService.upload(formData).subscribe({
        next: (url: string) => {
          this.changed.emit(url);
          this.loadingService.stop();
        },
        error: () => this.loadingService.stop()
      });
    } catch (error) {
      this.loadingService.stop();
      this.notificationService.notify(
        "notification",
        "info",
        "Image compression error"
      );
    }
  }
}
