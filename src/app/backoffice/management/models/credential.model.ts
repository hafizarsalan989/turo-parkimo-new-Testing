export interface ICredential {
  id: string;
  credential: string;
  credentialType: string;
  status: string;
  facility?: {
    id: string;
    name: string;
  };
  vehicle?: {
    id: string;
    name: string;
  };
  company?: {
    id: string;
    name: string;
  };
  subscription?: {
    id: string;
    name: string;
  };
  isEnabledInIsonas?: boolean;
  actionMenu?: string[];
}

export interface IHistory {
  credentialValue: string;
  deviceName: string;
  eventType: string;
  facilityName: string;
  localEventTime: string;
}

export interface ICredentialSubItem {
  id: string;
  name: string;
}
