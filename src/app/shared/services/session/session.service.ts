import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";

import { ROLES } from "src/app/core/constants/roles";
import { IHost } from "src/app/host/models/host.model";
import { IRole, IUser } from "../../models/user.model";
import { IMessage } from "src/app/backoffice/message-center/models/message.model";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private user$: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);
  private hosts: IHost[] | null = [];
  private host$: BehaviorSubject<IHost | null> = new BehaviorSubject(null);
  private hostMessages$: BehaviorSubject<IMessage[]> = new BehaviorSubject<
    IMessage[]
  >([]);
  private currentHostMessage$: BehaviorSubject<IMessage | undefined> =
    new BehaviorSubject<IMessage>(undefined);

  getUser$(): Observable<IUser> {
    return this.user$.asObservable();
  }

  setUser$(user: IUser | null): void {
    this.user$.next(user);
  }

  setHosts$(hosts: IHost[] | null): void {
    this.hosts = hosts;
    this.host$.next(hosts?.[0]);
  }

  setHost$(host: IHost): void {
    this.host$.next(host);
  }

  getHost$(): Observable<IHost> {
    return this.host$.asObservable();
  }

  getAllowedUrlsForUser(replaceId?: string): string[] {
    const user = this.user$.value;
    const userType: string = user?.turoUserType;
    const isFinancialAdmin: boolean = user?.isFinancialAdmin;
    const roleNames: string[] = user?.roles?.map(
      (role: IRole) => role.roleName
    );

    let urls: string[] = [];
    roleNames?.forEach((roleName: string) => {
      const roleUrls: string[] = ROLES[userType][roleName];

      urls = [...urls, ...roleUrls];
    });

    if (replaceId) {
      urls = urls.map((url: string) => url.replace(":id", replaceId));
    }

    const allowBillback = this.host$.value?.allowBillback;
    if (userType === "host" && !allowBillback) {
      urls = urls.filter((url) => !url.includes("billback"));
      urls = urls.filter((url) => !url.includes("fuel-tank"));
    }

    if (userType === "backoffice" && !isFinancialAdmin) {
      urls = urls.filter((url) => !url.includes("withdraws"));
    }

    return urls;
  }

  clear(): void {
    this.setUser$(null);
    this.setHosts$(null);
    this.setHost$(null);
    this.setHostMessages$([]);
  }

  getHostMessages$(): Observable<IMessage[]> {
    return this.hostMessages$.asObservable();
  }

  setHostMessages$(messages: IMessage[]): void {
    this.hostMessages$.next(messages);
  }

  getCurrentHostMessage$(): Observable<IMessage | undefined> {
    return this.currentHostMessage$.asObservable();
  }

  setCurrentHostMessage$(message: IMessage): void {
    this.currentHostMessage$.next(message);
  }
}
