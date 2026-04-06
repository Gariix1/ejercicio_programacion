import { NgFor, NgIf, formatNumber } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { HorizontalScrollShellComponent } from '../../../shared/horizontal-scroll-shell.component';
import { OverflowTextComponent } from '../../../shared/overflow-text.component';
import { Employee, EmployeeSortField } from '../../employees/models/employee.model';
import { EmployeesReportResult } from '../models/report.model';

type ReportColumnWidth = 'compact' | 'short' | 'date' | 'standard' | 'wide' | 'xwide';
type ReportColumnCellType = 'plain' | 'overflow';
type ReportColumnAlign = 'left' | 'center';

interface ReportColumn {
  key: string;
  label: string;
  width: ReportColumnWidth;
  sortBy?: EmployeeSortField;
  cellType?: ReportColumnCellType;
  align?: ReportColumnAlign;
  cellClass?: string;
  value: (employee: Employee) => string;
}

const textOrDash = (value: string | null | undefined): string => {
  const normalized = value?.trim() ?? '';
  return normalized.length > 0 ? normalized : '-';
};

const DEFAULT_REPORT_COLUMNS: ReportColumn[] = [
  {
    key: 'full_name',
    label: 'Nombre',
    width: 'wide',
    sortBy: 'nombres',
    cellType: 'overflow',
    cellClass: 'cell-name',
    value: (employee) => `${employee.nombres} ${employee.apellidos}`.trim(),
  },
  {
    key: 'cedula',
    label: 'Cedula',
    width: 'short',
    sortBy: 'cedula',
    value: (employee) => textOrDash(employee.cedula),
  },
  {
    key: 'codigo_empleado',
    label: 'Codigo',
    width: 'compact',
    sortBy: 'codigo_empleado',
    value: (employee) => textOrDash(employee.codigo_empleado),
  },
  {
    key: 'direccion',
    label: 'Direccion',
    width: 'xwide',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.direccion),
  },
  {
    key: 'telefono',
    label: 'Telefono',
    width: 'short',
    value: (employee) => textOrDash(employee.telefono),
  },
  {
    key: 'fecha_ingreso',
    label: 'Fecha ingreso',
    width: 'date',
    sortBy: 'fecha_ingreso',
    value: (employee) => textOrDash(employee.fecha_ingreso),
  },
  {
    key: 'cargo',
    label: 'Cargo',
    width: 'standard',
    sortBy: 'cargo',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.cargo),
  },
  {
    key: 'departamento',
    label: 'Departamento',
    width: 'standard',
    sortBy: 'departamento',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.departamento),
  },
  {
    key: 'sueldo',
    label: 'Sueldo',
    width: 'compact',
    sortBy: 'sueldo',
    value: (employee) => formatNumber(employee.sueldo, 'en-US', '1.2-2'),
  },
  {
    key: 'jornada_parcial_label',
    label: 'Jornada',
    width: 'compact',
    value: (employee) => textOrDash(employee.jornada_parcial_label),
  },
  {
    key: 'estado_nombre',
    label: 'Estado',
    width: 'compact',
    sortBy: 'estado_nombre',
    value: (employee) => textOrDash(employee.estado_nombre),
  },
  {
    key: 'provincia_display',
    label: 'Provincia',
    width: 'standard',
    sortBy: 'provincia_laboral_nombre',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.provincia_laboral_nombre || employee.provincia_personal_nombre),
  },
  {
    key: 'email',
    label: 'Email',
    width: 'xwide',
    sortBy: 'email',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.email),
  },
];

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [NgFor, NgIf, OverflowTextComponent, HorizontalScrollShellComponent],
  template: `
    <section class="card shadow-sm report-table-card">
      <app-horizontal-scroll-shell
        mobileHint="Desliza la tabla para ver mas columnas →"
        desktopHint="Desplaza horizontalmente la tabla para ver mas columnas →"
      >
        <table class="table table-sm table-hover align-middle mb-0 report-table">
          <colgroup>
            <col *ngFor="let column of columns(); trackBy: trackColumn" [class]="'col-' + column.width" />
          </colgroup>
          <thead>
            <tr>
              <th
                *ngFor="let column of columns(); trackBy: trackColumn"
                class="border-0"
                [class.text-center]="column.align === 'center'"
              >
                <button
                  *ngIf="column.sortBy; else plainHeader"
                  type="button"
                  class="btn btn-link btn-sm p-0 w-100 sort-button"
                  [class.text-left]="column.align !== 'center'"
                  [class.text-center]="column.align === 'center'"
                  [class.justify-content-center]="column.align === 'center'"
                  (click)="toggleSort(column.sortBy)"
                >
                  {{ column.label }} {{ sortIndicator(column.sortBy) }}
                </button>

                <ng-template #plainHeader>
                  <span
                    class="d-inline-flex w-100"
                    [class.justify-content-center]="column.align === 'center'"
                  >
                    {{ column.label }}
                  </span>
                </ng-template>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let employee of result().items">
              <td
                *ngFor="let column of columns(); trackBy: trackColumn"
                [class.cell-name]="column.cellClass === 'cell-name'"
                [class.text-center]="column.align === 'center'"
                [class.text-nowrap]="column.cellType !== 'overflow'"
              >
                <app-overflow-text
                  *ngIf="column.cellType === 'overflow'; else plainCell"
                  [value]="renderCell(employee, column)"
                ></app-overflow-text>

                <ng-template #plainCell>
                  {{ renderCell(employee, column) }}
                </ng-template>
              </td>
            </tr>

            <tr *ngIf="result().items.length === 0">
              <td class="text-center text-muted py-4" [attr.colspan]="columns().length">
                No hay empleados para mostrar con los criterios actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </app-horizontal-scroll-shell>
    </section>
  `,
  styles: [`
    :host {
      --report-table-min-width: 1440px;
      --report-col-compact: 96px;
      --report-col-short: 112px;
      --report-col-date: 132px;
      --report-col-standard: 136px;
      --report-col-wide: 220px;
      --report-col-xwide: 200px;
    }

    .report-table-card {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.88);
      border-radius: 14px;
    }

    .report-table {
      width: 100%;
      min-width: var(--report-table-min-width);
      font-size: 0.76rem;
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
    }

    .report-table th,
    .report-table td {
      vertical-align: middle;
      padding: 0.7rem 0.62rem;
      border-top-color: rgba(73, 44, 24, 0.09);
      overflow: hidden;
      background-clip: padding-box;
      position: relative;
    }

    .report-table thead th {
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
      background: #74a8d5;
      color: white;
      border-bottom: none;
      font-size: 0.69rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .report-table tbody td {
      color: #2c2925;
      line-height: 1.35;
    }

    .report-table thead th:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 16%;
      bottom: 16%;
      right: 0;
      width: 1px;
      background: rgba(255, 255, 255, 0.18);
    }

    .report-table tbody td:not(:last-child) {
      box-shadow: inset -1px 0 0 rgba(103, 86, 67, 0.08);
    }

    .report-table tbody tr:first-child td {
      border-top-color: rgba(73, 44, 24, 0.11);
    }

    .report-table tbody tr {
      min-height: 54px;
    }

    .report-table tbody tr:hover td:not(:last-child) {
      box-shadow: inset -1px 0 0 rgba(103, 86, 67, 0.1);
    }

    .report-table col.col-compact { width: var(--report-col-compact); }
    .report-table col.col-short { width: var(--report-col-short); }
    .report-table col.col-date { width: var(--report-col-date); }
    .report-table col.col-standard { width: var(--report-col-standard); }
    .report-table col.col-wide { width: var(--report-col-wide); }
    .report-table col.col-xwide { width: var(--report-col-xwide); }

    .cell-name {
      font-weight: 600;
    }

    .sort-button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: inherit;
      font-size: inherit;
      text-decoration: none;
      text-transform: inherit;
      letter-spacing: inherit;
    }

    .sort-button:hover,
    .sort-button:focus {
      color: inherit;
      text-decoration: none;
    }

    @media (max-width: 992px) {
      :host {
        --report-table-min-width: 1320px;
      }

      .report-table {
        min-width: var(--report-table-min-width);
      }
    }
  `],
})
export class ReportTableComponent {
  readonly result = input.required<EmployeesReportResult>();
  readonly sortBy = input<EmployeeSortField>('nombres');
  readonly sortDir = input<'asc' | 'desc'>('asc');
  readonly columns = input<ReportColumn[]>(DEFAULT_REPORT_COLUMNS);
  readonly sortChange = output<{ sortBy: EmployeeSortField; sortDir: 'asc' | 'desc' }>();

  protected toggleSort(sortBy: EmployeeSortField): void {
    const sortDir = this.sortBy() === sortBy && this.sortDir() === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ sortBy, sortDir });
  }

  protected sortIndicator(sortBy: EmployeeSortField): string {
    if (this.sortBy() !== sortBy) {
      return '·';
    }

    return this.sortDir() === 'asc' ? '↑' : '↓';
  }

  protected trackColumn(_: number, column: ReportColumn): string {
    return column.key;
  }

  protected renderCell(employee: Employee, column: ReportColumn): string {
    return column.value(employee);
  }
}
