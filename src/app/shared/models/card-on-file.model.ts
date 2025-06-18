import { IAddress, IBase } from "./base.model";

export interface ICardOnFile extends IBase {
  companyName: string;
  address: IAddress;
  ownerId: string;
  primaryCard: ICard;
  secondaryCard: ICard;
  gatewayCustomerId: string;
}

export interface ICard extends IBase {
  token: string;
  gateway: string;
  cardMask: string;
  cardExpiration: string;
  cardType: string;
  paymentProfileId: string;
}

export interface IGateway {
  gatewayProvider: string,
  parkimoProduct: string,
  publicKey: string,
  authId: string,
  apiUrl: string
}
