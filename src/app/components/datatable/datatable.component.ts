import {
  Component,
  AfterViewInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { IVehicle } from "src/app/host/vehicles/models/vehicle.model";
import { SessionService } from "src/app/shared/services/session/session.service";

declare const $: any;

@Component({
  selector: "app-data-table",
  templateUrl: "datatable.component.html",
})
export class DataTableComponent implements OnChanges, AfterViewInit {
  private dataTableInstance: any;
  @Input() tableId: string = "datatable";
  @Input() columnDefs: IColumnDef[] = [];
  @Input() defaultOrder: { id: number; dir: "asc" | "desc" } | undefined;
  @Input() data: any[] = [];
  @Input() lengthChange = true;
  @Input() filterCriteria: { searchCriteria?: string } | null = null;


  @Input() lengthMenu: number[] | (number | string)[][] = [
    [25, 50, 100, 200, -1],
    [25, 50, 100, 200, "All"],
  ];
  @Input() pageLength: number | string | undefined;
  @Input() searching = true;
  @Input() paging = true;
  @Input() info = true;
  @Input() pagingType:
    | "numbers"
    | "simple"
    | "simple_numbers"
    | "full"
    | "full_numbers"
    | "first_last_numbers" = "full_numbers";
  @Input() actions: IDatatableAction[] = [];
  @Input() dom =
    "<'row'<'col-sm-12 col-md'<'row align-items-baseline'<'col-sm-12 col-md-auto'l><'toolbar'>>><'col-sm-12 col-md-auto'f>>" +
    "<'row'<'col-sm-12'<'table-responsive'tr>>>" +
    "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>";
  @Input() toolbar: string | undefined;
  @Input() paginationLayout: 'top' | 'bottom' | 'both';
  @Input() customFilters: {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
  }[] = [];



  columns: IColumnDef[] = [];
  private role: string | undefined;
  private lengthKey = "datatable-length";

  constructor(private sessionService: SessionService) {
    this.sessionService.getUser$().subscribe((user) => {
      this.role = user?.turoUserType;
    });
  }

  columnFilters: { [key: string]: string } = {};
  filterOptions: { [key: string]: string[] } = {};

  ngOnChanges(changes: SimpleChanges): void {
    this.columns =
      this.actions.length > 0
        ? [...this.columnDefs, this.actionColumnDef()]
        : this.columnDefs;

    if (changes.data && !changes.data?.firstChange) {
      this.columnDefs.forEach((columnDef) => {
        if (columnDef.event) {
          const { type } = columnDef.event;
          $(`#${this.tableId}`).off(type);
        }
      });

      this.actions.forEach(() => {
        $(`#${this.tableId}`).off("click");
      });
    }

    setTimeout(() => {
      this.moveHighlightedRowToTop();
      this.setData();
    }, 0);
  }

  private actionColumnDef(): IColumnDef {
    return {
      targets: this.columnDefs.length,
      className: "td-actions",
      data: "id",
      orderable: false,
      render: (data, _, row) => {
        let buttons = "";
        this.actions.forEach((action) => {
          if (
            (!action.enabled ||
              action.enabled.every((item) =>
                item.value.includes(row[item.key])
              )) &&
            (!action.roles || action.roles.includes(this.role))
          ) {
            let className = "btn mx-1";
            if (action.getClassName) {
              const cName = action.getClassName(row[action.name]);
              if (cName) {
                className += ` ${cName}`;
              }
            } else {
              className = action.className
                ? `btn mx-1 ${action.className}`
                : "btn mx-1";
            }

            buttons += `
              <button id="${action.name
              }-${data}" data-value="${data}" mat-raised-button type="button" class="${className}" title="${action.title ?? ""
              }">`;
            if (action.label) {
              buttons += `<span style="padding-left: 4px; padding-right: 4px;">${action.label}</span>`;
            } else {
              buttons += `<i class="material-icons">${action.icon}</i>`;
            }
            buttons += `</button>`;
          }
        });

        return `<div class="d-flex">${buttons}</div>`;
      },
      responsivePriority: this.columnDefs.length,
    };
  }
  private setData(): void {
    if (this.dataTableInstance) {
      this.dataTableInstance.clear();
      this.dataTableInstance.rows.add(this.data);
      this.dataTableInstance.draw();

      this.columnDefs.forEach((columnDef) => {
        if (columnDef.event) {
          const self = this;
          const { type, callback } = columnDef.event;
          $(`#${this.tableId}`).on(
            type,
            `td.${columnDef.className}`,
            function () {
              const val = self.data.find(
                (item) =>
                  item.id.toString() ===
                  $(this).children(":first").data("value").toString()
              );
              callback(val);
            }
          );
        }
      });

      if (this.actions.length > 0) {
        this.actions.forEach((action) => {
          const classNames = action.className
            .split(" ")
            .map((cName) => `.${cName}`);
          $(`#${this.tableId}`).on(
            "click",
            `${classNames.join(",")}`,
            function () {
              action.callback($(this).data("value"));
            }
          );
        });
      }
      setTimeout(() => {
        if (!this.customFilters?.length) return;
        const container = $('.filter-container');
        if (!container.length) return;
        container.addClass('d-flex flex-wrap ');
        container.empty();
        this.customFilters.forEach((filter, index) => {
          const selectId = `customFilter_${index}`;
          const selectWrapper = $(`
            <div class="mb-3"  style="min-width: 145px;">
                 <label for="${selectId}">${filter.label}</label>
                     <select apperence="fiil" style="padding:8px;appearance: auto;" id="${selectId}" class="form-select form-select-sm" placeholder="All ">
                             <option  value="">All </option>
                                      ${filter.options.map(o => `<option value="${o}" ${o === filter.value ? 'selected' : ''}>${o}</option>`).join('')}
                       </select>
             </div>
           `);

          selectWrapper.find('select').on('change', () => {
            const value = selectWrapper.find('select').val() as string;
            filter.value = value;
            filter.onChange(value);
          });

          container.append(selectWrapper);
        });
      }, 0);
    }
  }
  @Input() disablePagination: boolean = false;
  private getDomLayout(): string {
    const topControls = `
  <'row mb-3 d-flex justify-content-between'
    <'col-md-9 d-flex flex-wrap justify-content-start'
      <'me-1'f>
      <'filter-container me-1'>
    >
    <'col-md-3 text-end' l>
  >`;

    const tableBody = "<'row'<'col-sm-12'<'table-responsive'tr>>>";

    const bottomControls = "<'row mt-2'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 text-end'p>>";
    const topPaginationControls = "<'row mt-2'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6 text-end'p>>";

    if (this.disablePagination) {
      // Remove dropdown + pagination
      return topControls.replace("<'col-md-3 text-end' l>", '') + tableBody;
    }

    switch (this.paginationLayout) {
      case 'top': return topControls + tableBody;
      case 'bottom': return tableBody + bottomControls;
      case 'both': return topControls + topPaginationControls + tableBody + bottomControls;
      default: return topControls + tableBody + bottomControls;
    }
  }

  // private getDomLayout(): string {
  //   const topControls = `
  //   <'row mb-3 d-flex justify-content-between'

  //     <'col-md-9  d-flex flex-wrap  justify-content-start'
  //     <'me-1'f>
  //     <'filter-container me-1'>
  //     >
  //     <'col-md-3  text-end' l>

  //   >`;
  //   const tableBody = "<'row'<'col-sm-12'<'table-responsive'tr>>>";
  //   const bottomControls = "<'row mt-2'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 text-end'p>>";
  //   const topPaginationControls = "<'row mt-2'<'col-sm-12 col-md-6'><'col-sm-12 col-md-6 text-end'p>>";

  //   switch (this.paginationLayout) {
  //     case 'top': return topControls + tableBody;
  //     case 'bottom': return tableBody + bottomControls;
  //     case 'both': return topControls + topPaginationControls + tableBody + bottomControls;
  //     default: return topControls + tableBody + bottomControls;
  //   }
  // }


  isHighlighted(vehicle: IVehicle): boolean {
    const { searchCriteria } = this.filterCriteria || {};
    if (searchCriteria === undefined || searchCriteria === null || searchCriteria === '') {
      return false;
    }
    else {
      return (
        (vehicle.aviCredentialTag === searchCriteria) ||
        (vehicle.vin === searchCriteria) ||
        (vehicle.licensePlate === searchCriteria)

      );
    }

  }
  private moveHighlightedRowToTop(): void {
    if (!this.data || this.data.length === 0) return;

    const highlighted = this.data.find(vehicle => this.isHighlighted(vehicle));
    if (!highlighted) return;

    // Filter out the highlighted one and prepend it
    this.data = [
      highlighted,
      ...this.data.filter(v => v !== highlighted)
    ];
  }


  ngAfterViewInit(): void {
    const self = this;

    const order = this.defaultOrder
      ? [[this.defaultOrder.id, this.defaultOrder.dir ?? "desc"]]
      : [];

    this.dataTableInstance = $(`#${this.tableId}`).DataTable({
      dom: this.getDomLayout(),

      createdRow(row: any, data: IVehicle) {
        //console.log("Creating row :", row);
        $(row).attr('id', `vehicle-${data.id}`);
        setTimeout(() => {
          if (row) {
            row.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            if (self.isHighlighted(data)) {
              $(row).css({
                "background-color": "#f8d7da",
                "color": "#721c24"
              });
            }
          }
        }, 100);

      },

      lengthChange: this.lengthChange,
      lengthMenu: this.lengthMenu,
      pageLength: this.pageLength
        ? this.pageLength
        : Number(localStorage.getItem(this.lengthKey) ?? 25),
      searching: this.searching,
      paging: this.paging,
      info: this.info,
      pagingType: this.pagingType,
      responsive: false,
      language: {
        lengthMenu: "Show _MENU_ records",
        search: "_INPUT_",
        searchPlaceholder: "Search...",
        info: "Showing _START_ to _END_ of _TOTAL_ records",
        paginate: {
          first: "<<",
          last: ">>",
          previous: "<",
          next: ">",
        },
      },
      columnDefs: this.columns,
      order,
    });

    if (this.toolbar) {
      $("div.toolbar").html(this.toolbar);
    }

    this.dataTableInstance.on("length.dt", (_, __, len) => {
      localStorage.setItem(this.lengthKey, len);
    });
  }

}

export interface IColumnDef {
  className?: string;
  data?: string;
  defaultContent?: string;
  name?: string;
  orderable?: boolean;
  render?: any;
  searchable?: boolean;
  target?: string | number | (string | number)[];
  targets?: string | number | (string | number)[];
  title?: string;
  event?: {
    type: string;
    callback: Function;
  };
  responsivePriority?: number;
}

export interface IDatatableAction {
  name: string;
  icon?: string;
  label?: string;
  callback: Function;
  roles?: string[];
  enabled?: {
    key: string;
    value: (string | number | boolean)[];
  }[];
  className?: string;
  getClassName?: Function;
  title?: string;
}
