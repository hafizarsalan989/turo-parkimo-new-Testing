import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { CurrencyPipe, DatePipe, DecimalPipe } from "@angular/common";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, MatSortable } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl } from "@angular/forms";
import { startWith, debounceTime, skip } from "rxjs";
import { ITableColumnDef, ITableConfigs, ITableData } from "./table.model";
import { IFile } from "src/app/shared/models/file.model";
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"],
})
export class TableComponent implements OnChanges, OnInit, AfterViewInit {
  @Input() showSearch = true;
  @Input() columnDefs: ITableColumnDef[] = [];
  @Input() data: ITableData = {
    totalRows: 0,
    rows: [],
  };
  @Input() matSortActive: string | undefined;
  @Input() matSortDirection: "asc" | "desc" | undefined;
  @Input() showPagination = true;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100, 200];
  @Input() lazyLoad: boolean = false;
  @Output() reload: EventEmitter<ITableConfigs> = new EventEmitter();

  @ContentChild("tdActions") tdActions: QueryList<ElementRef>;

  columns: string[] = [];
  totalRows = 0;
  dataSource = new MatTableDataSource([]);
  searchTermCtrl = new FormControl("");
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  get showFooterRow(): boolean {
    return this.columnDefs.some((colDef) => colDef.showFooter);
  }

  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
      if (this.lazyLoad) {
        this.dataSource.data = changes.data.currentValue?.rows ?? [];
        this.totalRows = changes.data.currentValue?.totalRows;
      } else {
        this.onChanges();
      }
    }
  }

  ngOnInit(): void {
    this.columns = this.columnDefs.map((col) => col.field);
    console.log("TableComponent initialized with columns:", this.columns);
  }

  ngAfterViewInit() {
    if (this.matSortActive) {
      this.sort.sort({
        id: this.matSortActive,
        start: this.matSortDirection ?? "desc",
      } as MatSortable);
    }
    this.dataSource.sortingDataAccessor = this._sortingDataAccessor;
    this.dataSource.sort = this.sort;

    this.searchTermCtrl.valueChanges
      .pipe(startWith(""), skip(1), debounceTime(500))
      .subscribe((val: string) => {
        if (this.lazyLoad) {
          this.reload.emit({
            searchTerm: val,
            page: 1,
            pageSize: this.showPagination
              ? this.paginator.pageSize
              : this.data?.totalRows,
            sortColumn: this.sort.direction ? this.sort.active : undefined,
            sortDirection: this.sort.direction,
          });
        } else {
          this.paginator.pageIndex = 0;
          this.onChanges();
        }
      });

    this.sort.sortChange.subscribe(({ active, direction }) => {
      if (this.lazyLoad) {
        this.paginator.pageIndex = 0;

        this.reload.emit({
          searchTerm: this.searchTermCtrl.value,
          page: 1,
          pageSize: this.showPagination
            ? this.paginator.pageSize
            : this.data?.totalRows,
          sortColumn: direction ? active : undefined,
          sortDirection: direction,
        });
      } else {
        this.onChanges();
      }
    });

    this.paginator?.page.subscribe(({ pageIndex, pageSize }) => {
      if (this.lazyLoad) {
        this.reload.emit({
          searchTerm: this.searchTermCtrl.value,
          page: pageIndex + 1,
          pageSize,
          sortColumn: this.sort.direction ? this.sort.active : undefined,
          sortDirection: this.sort.direction,
        });
      } else {
        this.onChanges();
      }
    });
  }

  private onChanges(): void {
    let rows = this.data?.rows.filter((item) => {
      return Object.entries(item).some(([key, value]) => {
        const columnDef = this.columnDefs.find(({ field }) => key === field);
        if (columnDef) {
          if (columnDef.format) {
            switch (columnDef.format.type) {
              case "date":
                value = this.datePipe.transform(
                  value as string,
                  columnDef.format.param
                );
                break;
              case "currency":
                value = this.currencyPipe.transform(
                  value as string,
                  columnDef.format.param
                );
                break;
              case "number":
                value = this.decimalPipe.transform(
                  value as string,
                  columnDef.format.param
                );
                break;
              case "length":
                value = this.decimalPipe.transform(
                  (value as unknown[]).length,
                  columnDef.format.param
                );
                break;
              case "percent":
                value = `${this.decimalPipe.transform(
                  value as string,
                  columnDef.format.param
                )}%`;
                break;

              default:
                break;
            }
          }

          return `${value}`
            .toLowerCase()
            .includes(this.searchTermCtrl.value.toLowerCase() ?? "");
        } else {
          return false;
        }
      });
    });
    this.totalRows = rows?.length ?? 0;

    const { active, direction } = this.sort ?? {};
    if (active && direction) {
      rows = rows.sort((a, b) => {
        if (direction === "asc") {
          return a[active] - b[active];
        } else {
          return b[active] - a[active];
        }
      });
    }

    const { pageIndex, pageSize } = this.paginator ?? {
      pageIndex: 0,
      pageSize: this.showPagination
        ? this.pageSizeOptions[0]
        : this.data?.totalRows,
    };
    this.dataSource.data = rows?.slice(
      pageIndex * pageSize,
      (pageIndex + 1) * pageSize
    );
  }

  getClasses(col: ITableColumnDef): string {
    let result = col.className ?? "";
    if (col.format?.type === "number" || col.format?.type === "currency") {
      result += " text-right";
    }

    return result.trim();
  }

  getTotal(col: ITableColumnDef): number {
    return this.data?.rows.reduce((acc, cur) => {
      return (acc += cur[col.field]);
    }, 0);
  }

  // openLink(param: { url: string; key: string }, row: any): void {
  //   let { url, key } = param;
  //   url = this.router.serializeUrl(
  //     this.router.createUrlTree([url.replace("[value]", row[key])])
  //   );

  //   window.open(url, "_blank");
  // }
  // openLink(param: { key: string }, row: any): void {
  //   const key = param.key;
  //   const referenceId = row[key];

  //   let basePath = '';

  //   switch (row.referenceType) {
  //     case 'Host Invoice':
  //       basePath = 'external/invoice';
  //       break;
  //     case 'Traveler Invoice':
  //       basePath = 'receipts';
  //       break;
  //     default:
  //       console.warn('Unknown referenceType:', row.referenceType);
  //       return;
  //   }

  //   const url = this.router.serializeUrl(
  //     this.router.createUrlTree([`${basePath}/${referenceId}`])
  //   );

  //   window.open(url, '_blank');
  // }
  openLink(param: { key: string }, row: any): void {
    const key = param.key;
    const referenceId = row[key];

    let url = '';

    switch (row.referenceType) {
      case 'Host Invoice':
        
        url = this.router.serializeUrl(
          this.router.createUrlTree([`external/invoice/${referenceId}`])
        );
        window.open(url, '_blank');
        break;

      case 'Traveler Invoice':
        
        url = `${environment.guestPayUrl}receipt/${referenceId}`;
        window.open(url, '_blank');
        break;

      default:
        console.warn('Unknown referenceType:', row.referenceType);
        return;
    }
  }



  onDownload(file: IFile): void {
    const aTag = document.createElement("a");
    aTag.href = file.url;
    aTag.target = "_blank";
    aTag.download = file.name;
    aTag.click();
  }

  private _sortingDataAccessor(data: any, property: string): any {
    if (typeof data[property] === "string") {
      return data[property].toLowerCase();
    }

    return data[property];
  }
}
