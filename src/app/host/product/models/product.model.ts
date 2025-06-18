export interface IProduct {
  name: string;
  description: string;
  rates: [
    {
      name: string;
      rate: number;
    }
  ];
}

export interface IMarketPlace {
  serviceType: string;
  provider: string;
  providerLogoUrl: string;
  description: string;
  contact: {
    email: string;
    phone: string;
  };
}
