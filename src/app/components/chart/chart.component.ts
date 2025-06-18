import { formatNumber } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  ApexChart,
  ApexPlotOptions,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexLegend,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
} from "ng-apexcharts";

import { COLORS as APEX_COLORS } from "src/app/shared/constants/apex-chart";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnChanges {
  readonly defaultChart: ApexChart = {
    height: 450,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  };

  @Input() series: ApexAxisChartSeries | undefined;
  @Input() xaxis: ApexXAxis | undefined;
  @Input() yaxis: ApexYAxis = {
    decimalsInFloat: 0,
  };
  @Input() dataLabels: ApexDataLabels = {
    formatter: (val) => {
      return formatNumber(Number(val), "en-us", "1.0-2");
    },
  };
  @Input() tooltip: ApexTooltip = {
    y: {
      formatter: (val) => {
        return formatNumber(Number(val), "en-us", "1.0-2");
      },
    },
  };
  @Input() chart: ApexChart = this.defaultChart;
  @Input() plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
    },
  };

  legend: ApexLegend = {
    show: true,
    position: "bottom",
  };
  colors: string[] = APEX_COLORS;

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes["series"]?.currentValue) {
      this.series = [
        {
          data: [],
        },
      ];
    }

    if (!changes["xaxis"]?.currentValue) {
      this.xaxis = {
        categories: [],
      };
    }

    if (changes["chart"]) {
      if (changes["chart"].currentValue) {
        this.chart = {
          ...this.defaultChart,
          ...changes["chart"].currentValue,
        };
      } else {
        this.chart = {
          ...this.defaultChart,
        };
      }
    }
  }
}
