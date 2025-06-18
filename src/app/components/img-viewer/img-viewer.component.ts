import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-img-viewer',
  templateUrl: './img-viewer.component.html',
  styleUrls: ['./img-viewer.component.scss']
})
export class ImgViewerComponent {
  @Input() images: (IImage | IVideo)[] = [];
  @Input() show: boolean = false;
  @Input() index: number = 0;
  @Output() onClose: EventEmitter<null> = new EventEmitter<null>();

  close(): void {
    this.index = 0;
    this.onClose.emit();
  }
}

export interface IImage {
  image: string;
  thumbImage?: string;
  title?: string;
}

export interface IVideo {
  video: string;
  posterImage?: string;
  title?: string;
}
