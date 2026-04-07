import { NgFor, NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { HorizontalScrollShellComponent } from '../../../shared/horizontal-scroll-shell.component';
import { Employee, EmployeeListResult, EmployeeSortField } from '../models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [NgFor, NgIf, HorizontalScrollShellComponent],
  template: `
    <section class="app-table-panel" [class.app-table-panel--embedded]="embedded()">
      <div class="app-table-header">
        <div>
          <h3 class="app-table-title">Empleados registrados</h3>
        </div>
        <span class="app-table-count">{{ result().pagination?.total ?? result().items.length }} registros</span>
      </div>

      <app-horizontal-scroll-shell
        mobileHint="Desliza la tabla para ver mas columnas ->"
        desktopHint="Desplaza horizontalmente para ver mas columnas ->"
      >
        <table class="table table-sm align-middle mb-0 module-table">
          <colgroup>
            <col class="col-name" />
            <col class="col-code" />
            <col class="col-status" />
            <col class="col-action" />
          </colgroup>

          <thead>
            <tr>
              <th>
                <button type="button" class="sort-button sort-button--left" (click)="toggleSort('nombres')">
                  Nombre {{ sortIndicator('nombres') }}
                </button>
              </th>
              <th class="text-center">
                <button type="button" class="sort-button sort-button--center" (click)="toggleSort('codigo_empleado')">
                  Codigo {{ sortIndicator('codigo_empleado') }}
                </button>
              </th>
              <th class="text-center">
                <button type="button" class="sort-button sort-button--center" (click)="toggleSort('estado_nombre')">
                  Estado {{ sortIndicator('estado_nombre') }}
                </button>
              </th>
              <th class="text-center">Accion</th>
            </tr>
          </thead>

          <tbody>
            <tr
              *ngFor="let employee of result().items"
              class="table-row"
              [attr.aria-label]="'Editar empleado ' + employee.nombres + ' ' + employee.apellidos"
            >
              <td>
                <strong>{{ employee.nombres }} {{ employee.apellidos }}</strong>
              </td>
              <td class="text-center">
                <span class="code-pill">{{ employee.codigo_empleado }}</span>
              </td>
              <td class="text-center">
                <span class="status-pill" [class.status-pill--inactive]="employee.estado_codigo !== 1">
                  {{ employee.estado_nombre }}
                </span>
              </td>
              <td class="text-center">
                <button
                  class="edit-button"
                  type="button"
                  (click)="edit.emit(employee)"
                >
                  Editar
                </button>
              </td>
            </tr>

            <tr *ngIf="result().items.length === 0">
              <td colspan="4" class="empty-cell">
                <div class="app-empty-state">
                  <strong>No encontramos empleados</strong>
                  <span>Prueba ajustando el nombre, el codigo o la cantidad de filas por pagina.</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </app-horizontal-scroll-shell>

      <div class="app-footer-note">
        <small class="text-muted">Usa el boton editar para abrir la ficha del empleado seleccionado.</small>
      </div>
    </section>
  `,
  styles: [`
    .module-table thead th {
      background: rgba(197, 228, 247, 0.55);
      border-bottom-width: 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 0.78rem;
      color: #255c80;
      padding-block: 12px;
      position: relative;
    }

    .module-table thead th:first-child {
      border-top-left-radius: 10px;
    }

    .module-table thead th:last-child {
      border-top-right-radius: 10px;
    }

    .col-name {
      width: auto;
    }

    .col-code {
      width: 116px;
    }

    .col-status {
      width: 134px;
    }

    .col-action {
      width: 104px;
    }

    .module-table {
      width: 100%;
      table-layout: fixed;
      border-collapse: separate;
      border-spacing: 0;
    }

    .module-table tbody td {
      padding: 14px 10px;
      border-color: rgba(73, 44, 24, 0.08);
      position: relative;
      background-clip: padding-box;
    }

    .module-table thead th:not(:last-child),
    .module-table tbody td:not(:last-child) {
      box-shadow: inset -1px 0 0 rgba(103, 86, 67, 0.08);
    }

    .module-table tbody tr td {
      border-top: 1px solid rgba(73, 44, 24, 0.06);
    }

    .module-table tbody tr:first-child td {
      border-top-color: rgba(73, 44, 24, 0.08);
    }

    .table-row {
      transition: background-color 0.18s ease, transform 0.18s ease;
    }

    .table-row:hover {
      background: rgba(247, 198, 161, 0.22);
    }

    .table-row:hover td:not(:last-child) {
      box-shadow: inset -1px 0 0 rgba(103, 86, 67, 0.1);
    }

    .edit-button {
      min-width: 88px;
      min-height: 32px;
      padding: 6px 14px;
      border: 1px solid rgba(122, 178, 213, 0.42);
      border-radius: 999px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(228, 241, 250, 0.44) 100%);
      color: #255c80;
      font-size: 0.89rem;
      font-weight: 600;
      line-height: 1;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.42),
        0 10px 18px rgba(49, 119, 165, 0.08);
      backdrop-filter: blur(12px) saturate(1.1);
      -webkit-backdrop-filter: blur(12px) saturate(1.1);
      transition:
        transform 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        box-shadow 160ms ease,
        color 160ms ease;
    }

    .edit-button:hover {
      transform: translateY(-1px);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(210, 233, 248, 0.56) 100%);
      border-color: rgba(92, 151, 190, 0.5);
      color: #1f5f87;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.46),
        0 14px 22px rgba(49, 119, 165, 0.12);
    }

    .edit-button:focus-visible {
      outline: 0;
      box-shadow:
        0 0 0 0.2rem rgba(49, 119, 165, 0.14),
        0 14px 24px rgba(49, 119, 165, 0.1);
    }

    .edit-button:active {
      transform: translateY(0) scale(0.985);
    }

    .code-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 4px 9px;
      border-radius: 999px;
      background: rgba(197, 228, 247, 0.45);
      color: #255c80;
      font-weight: 600;
      font-size: 0.82rem;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 92px;
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(91, 168, 115, 0.16);
      color: #2b7a44;
      font-weight: 700;
      font-size: 0.76rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    .status-pill--inactive {
      background: rgba(166, 111, 63, 0.16);
      color: #8a4b1f;
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

    .sort-button--left {
      justify-content: flex-start;
    }

    .sort-button--center {
      justify-content: center;
    }

    .sort-button:hover {
      color: #1f5f87;
    }

    .empty-cell {
      padding: 24px 14px;
    }

    @media (max-width: 640px) {
      .module-table {
        min-width: 640px;
      }
    }
  `],
})
export class EmployeeTableComponent {
  readonly embedded = input(false);
  readonly result = input.required<EmployeeListResult>();
  readonly sortBy = input<EmployeeSortField>('nombres');
  readonly sortDir = input<'asc' | 'desc'>('asc');
  readonly edit = output<Employee>();
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
