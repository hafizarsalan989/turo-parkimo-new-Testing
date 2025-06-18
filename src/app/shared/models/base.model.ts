export interface IBase {
  id?: string;
  created?: string;
  modified?: string;
  isDeleted?: boolean;
  hash?: string;
}

export interface IAddress {
  address1: string;
  address2: string;
  attention?: string;
  city: string;
  state: string;
  zip: string;
}
