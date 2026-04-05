import { DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EmployeeSortField } from '../../employees/models/employee.model';
import { EmployeesReportResult } from '../models/report.model';

@Component({
  selector: 'app-report-table',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe],
  template: `
    <section class="table-card">
      <div class="table-responsive">
        <table class="table table-sm align-middle mb-0 report-table">
          <thead>
            <tr>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('nombres')">
                  Nombre {{ sortIndicator('nombres') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('cedula')">
                  Cedula {{ sortIndicator('cedula') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('codigo_empleado')">
                  Codigo {{ sortIndicator('codigo_empleado') }}
                </button>
              </th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('fecha_ingreso')">
                  Fecha ingreso {{ sortIndicator('fecha_ingreso') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('cargo')">
                  Cargo {{ sortIndicator('cargo') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('departamento')">
                  Departamento {{ sortIndicator('departamento') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('sueldo')">
                  Sueldo {{ sortIndicator('sueldo') }}
                </button>
              </th>
              <th>Jornada</th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('estado_nombre')">
                  Estado {{ sortIndicator('estado_nombre') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('provincia_laboral_nombre')">
                  Provincia {{ sortIndicator('provincia_laboral_nombre') }}
                </button>
              </th>
              <th>
                <button type="button" class="sort-button" (click)="toggleSort('email')">
                  Email {{ sortIndicator('email') }}
                </button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr *ngFor="let employee of result().items">
              <td>{{ employee.nombres }} {{ employee.apellidos }}</td>
              <td>{{ employee.cedula }}</td>
              <td>{{ employee.codigo_empleado }}</td>
              <td>{{ employee.direccion || '-' }}</td>
              <td>{{ employee.telefono || '-' }}</td>
              <td>{{ employee.fecha_ingreso }}</td>
              <td>{{ employee.cargo }}</td>
              <td>{{ employee.departamento }}</td>
              <td>{{ employee.sueldo | number:'1.2-2' }}</td>
              <td>{{ employee.jornada_parcial_label }}</td>
              <td>{{ employee.estado_nombre }}</td>
              <td>{{ employee.provincia_laboral_nombre || employee.provincia_personal_nombre || '-' }}</td>
              <td>{{ employee.email }}</td>
            </tr>

            <tr *ngIf="result().items.length === 0">
              <td class="text-center text-muted py-4" colspan="13">
                No hay empleados para mostrar con los criterios actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `,
  styles: [`
    .table-card {
      padding: 12px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.88);
    }

    .report-table {
      font-size: 0.8rem;
    }

    .report-table th,
    .report-table td {
      min-width: 120px;
      white-space: nowrap;
      vertical-align: middle;
    }

    .report-table thead th {
      background: #74a8d5;
      color: white;
      border-bottom: none;
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .sort-button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      text-transform: inherit;
      letter-spacing: inherit;
      cursor: pointer;
    }
  `],
})
export class ReportTableComponent {
  readonly result = input.required<EmployeesReportResult>();
  readonly sortBy = input<EmployeeSortField>('nombres');
  readonly sortDir = input<'asc' | 'desc'>('asc');
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
}
