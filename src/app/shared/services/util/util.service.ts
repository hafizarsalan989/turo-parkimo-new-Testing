import { Injectable } from "@angular/core";
import moment from "moment";

@Injectable({
  providedIn: "root",
})
export class UtilService {

  exportCsv({
    name,
    header,
    data,
  }: {
    name: string;
    header: string[];
    data: (string | number | boolean)[][];
  }): void {
    const content: (string | number | boolean)[] = data.map((item) =>
      item.join(",")
    );
    const csv = header ? [header, ...content] : content;

    const blob = new Blob([csv.join("\r\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank";
    aTag.download = `${name}_${moment().format("YYYYMMDDhhmmss")}.csv`;
    aTag.click();
  }
}
