export interface IGuestPay {
  summaryData: IGuestPaySummary[];
  dayOfWeekData: IGuestPayDaily[];
}

export interface IGuestPaySummary {
  facilityId?: string;
  facilityname?: string;
  todayTotal?: number;
  yesterdayTotal?: number;
  last7DaysTotal?: number;
  last7DaysAvg?: number;
  last30DaysTotal?: number;
  last30DaysAvg?: number;
  last90DaysTotal?: number;
  last90DaysAvg?: number;
}

export interface IGuestPayDaily {
  facilityId?: string;
  facilityname?: string;
  data?: {
    dayOfWeek?: string;
    total?: number;
    dailyAvg?: number;
  }[]
}
