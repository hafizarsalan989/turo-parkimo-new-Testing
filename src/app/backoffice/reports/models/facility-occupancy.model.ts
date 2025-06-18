export interface IFacilityOccupancy {
  count: number;
  data: {
    hourly: Record<string, string | number>[];
    dayOfWeek: Record<string, string | number>[];
    daily: Record<string, string | number>[];
  };
}
