import { Component, Input, OnInit } from '@angular/core';
import { IActivity } from 'src/app/host/vehicles/models/vehicle-session.model';

@Component({
  selector: 'app-activity-list-modal',
  templateUrl: './activity-list-modal.component.html',
  styleUrls: ['./activity-list-modal.component.scss']
})
export class ActivityListModalComponent implements OnInit {
  @Input() activities: IActivity[] = [];

  constructor() { }

  ngOnInit(): void {
  }
  images: string[] = [];
  index: number = 0;
  show: boolean = false;

  openImageViewer(images: string[], startIndex: number = 0): void {
    this.images = images;
    this.index = startIndex;
    this.show = true;
  }

  close(): void {
    this.show = false;
  }


}
