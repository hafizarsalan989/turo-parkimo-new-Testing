import { IBase } from "src/app/shared/models/base.model";

export interface IMessage extends IBase {
  acknowledged?: boolean;
  facilityMarketId: string;
  facilityMarketName: string;
  subject: string;
  messageText: string;
  recipients: IMessageRecipient[];
  acknowledgedCount: number;
  acknowledgedPercent: number;
  methods: string[];
}

export interface IMessageRecipient {
  userId: string;
  email: string;
  phoneNumber: string;
  hostId: string;
  hostName: string;
  acknowledged: string;
}
