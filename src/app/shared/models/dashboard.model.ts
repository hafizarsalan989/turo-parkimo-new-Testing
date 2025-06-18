export interface IHostDashboard {
  facilityUse: IFacilityUse[];
  activeCars: number;
  registeredFacilities: number;
  parkingDaysThisMonth: number;
}

export interface IFacilityUse {
  facilityName: string;
  carsInFacility: number;
  parkingSessionsThisMonth: number;
}

export interface IFacilityDashboard {
  activeCars: number;
  registeredVehicles: number;
  parkingDaysThisMonth: number;
}

export interface IBackofficeDashboard {
  facilities:	IValueWithChanges;	
  hosts:	IValueWithChanges;	
  vehicles:	IValueWithChanges;	
  fastPasses:	IValueWithChanges;	
  revenue:	IValueWithChanges;	
  sessions:	IValueWithChanges;
  chart: IChart[];
  subscriptions: { current: number; change: number }; // new
  unlimited: { current: number; change: number };     // new
}

export interface IValueWithChanges {
  current: number;
  original: number;
  change: number;
}

export interface IChart {
  date: string;
  count: number;
}
