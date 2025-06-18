import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import moment, { Moment } from "moment";
import { TimePeriod } from "ngx-daterangepicker-material/daterangepicker.component";

@Component({
  selector: "app-daterange-picker",
  templateUrl: "./daterange-picker.component.html",
  styleUrls: ["./daterange-picker.component.scss"],
})
export class DaterangePickerComponent implements OnChanges {
  @Input() label: string = "Start Date - End Date";
  @Input() defaultRange: IDateRange | undefined;
  @Input() alwaysShowCalendars: boolean = true;
  @Input() showRanges: boolean = true;
  @Input() minDate: string | undefined;
  @Output() rangeChanged: EventEmitter<IDateRange> = new EventEmitter();

  range: IDateRange | undefined;
  ranges = this.showRanges ? DATE_RANGES : [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultRange"]?.currentValue) {
      this.range = this.defaultRange;
      const { startDate, endDate } = this.range;
      this.rangeChanged.emit({
        startDate: moment(startDate).format("YYYY-MM-DD"),
        endDate: moment(endDate).format("YYYY-MM-DD"),
      });
    }
  }

  datesUpdated(e: TimePeriod): void {
    const { startDate, endDate } = e;
    if (startDate && endDate) {
      this.rangeChanged.emit({
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
      });
    }
  }
}

export interface IDateRange {
  startDate: string;
  endDate: string;
}

export const DATE_RANGES: Record<string, Moment[]> = {
  Today: [moment(), moment()],
  "Last 7 Days": [moment().subtract(6, "days"), moment()],
  "Last 14 Days": [moment().subtract(13, "days"), moment()],
  "Last 30 Days": [moment().subtract(29, "days"), moment()],
  "Last 60 Days": [moment().subtract(59, "days"), moment()],
  "Last 90 Days": [moment().subtract(89, "days"), moment()],
  "Last 180 Days": [moment().subtract(179, "days"), moment()],
};
