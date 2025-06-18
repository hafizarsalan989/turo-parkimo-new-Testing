import { Injectable } from "@angular/core";
import {
  ServerEventConnect,
  ServerEventMessage,
  ServerEventsClient,
} from "@servicestack/client";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ServerEventsService<T> {
  message$: Subject<IServerEvents<T>> = new Subject();

  private _client: ServerEventsClient | undefined;
  private _channels: string[] = [""];

  constructor() {
    this._client = new ServerEventsClient(environment.api, this._channels, {
      handlers: {
        onConnect: (sub: ServerEventConnect) => {
          console.log("onConnect: ", sub);
        },
        onMessage: (msg: ServerEventMessage) => {
          console.log("onMessage: ", msg);
          this.message$.next({
            selector: msg.selector,
            body: msg.body,
          });
        },
      },
    }).start();
  }

  subscribeToChannels(channel: string) {
    this._client.subscribeToChannels(channel);
  }

  unsubscribeFromChannels(channel: string) {
    this._client.unsubscribeFromChannels(channel);
  }
}

export interface IServerEvents<T> {
  selector: string;
  body: T;
}
