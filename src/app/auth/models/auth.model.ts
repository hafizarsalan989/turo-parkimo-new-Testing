import { IUser } from "src/app/shared/models/user.model";

export interface IAuth {
  accessToken: string;
  user: IUser;
  emailVerificationId: string;
}
