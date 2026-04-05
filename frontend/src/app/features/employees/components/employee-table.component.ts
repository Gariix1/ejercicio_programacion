import { NgFor, NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Employee, EmployeeListResult } from '../models/employee.model';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <section class="table-card">
      <div class="table-responsive">
        <table class="table table-sm align-middle mb-0 module-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Codigo</th>
              <th>Estado</th>
              <th class="text-end">Accion</th>
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
              <td>{{ employee.codigo_empleado }}</td>
              <td>{{ employee.estado_nombre }}</td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-outline-primary edit-button"
                  type="button"
                  (click)="edit.emit(employee)"
                >
                  Editar
                </button>
              </td>
            </tr>

            <tr *ngIf="result().items.length === 0">
              <td class="text-center text-muted py-4" colspan="4">
                No se encontraron empleados con los filtros actuales.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="footer-note">
        <small class="text-muted">
          Total: {{ result().pagination?.total ?? result().items.length }}
          · Pagina {{ result().pagination?.current_page ?? 1 }}
          de {{ result().pagination?.last_page ?? 1 }}
          · Usa el boton editar para abrir la ficha del empleado
        </small>
      </div>
    </section>
  `,
  styles: [`
    .table-card {
      display: grid;
      gap: 12px;
      padding: 16px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.85);
    }

    .module-table thead th {
      background: #ffffff;
      border-bottom-width: 2px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-size: 0.78rem;
    }

    .module-table td,
    .module-table th {
      white-space: nowrap;
    }

    .table-row {
      transition: background-color 0.18s ease;
    }

    .table-row:hover {
      background: rgba(247, 198, 161, 0.3);
    }

    .edit-button {
      min-width: 84px;
    }

    .footer-note {
      display: flex;
      justify-content: center;
      text-align: center;
    }
  `],
})
export class EmployeeTableComponent {
  readonly result = input.required<EmployeeListResult>();
  readonly edit = output<Employee>();
}
