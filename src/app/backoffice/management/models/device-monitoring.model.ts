import { IBase } from "src/app/shared/models/base.model";

export interface IDeviceMonitoringReport {
  facilityId: string;
  facilityName: string;
  devices: IDeviceMonitoringReportDevice[];
}

export interface IDeviceMonitoringReportDevice {
  deviceName: string;
  deviceType: string;
  action: string;
  date: string;
  dateTimeDimensionKey: number;
  current: {
    total: number;
    hourlyAverage: number;
  };
  sameLastWeek: {
    total: number;
    hourlyAverage: number;
  };
  sameLastMonth: {
    total: number;
    hourlyAverage: number;
  };
  day: {
    total: number;
    hourlyAverage: number;
  };
  week: {
    total: number;
    hourlyAverage: number;
  };
  twoWeeks: {
    total: number;
    hourlyAverage: number;
  };
  month: {
    total: number;
    hourlyAverage: number;
  };
  details: IDeviceMonitoringReportDeviceDetail[];
}

export interface IDeviceMonitoringReportDeviceDetail extends IBase {
  dateTimeDimensionKey: number;
  stamp: string;
  facilityId: string;
  facilityName: string;
  deviceId: string;
  deviceName: string;
  deviceType: string;
  tag: string;
  vehicleId: string;
  vehicleName: string;
  companyId: string;
  companyName: string;
}
