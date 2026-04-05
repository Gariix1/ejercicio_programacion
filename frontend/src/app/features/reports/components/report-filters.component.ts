import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeSortField } from '../../employees/models/employee.model';

export interface ReportFiltersValue {
  search: string;
  sortBy: EmployeeSortField;
  sortDir: 'asc' | 'desc';
}

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="filters-card">
      <div class="row g-3 align-items-end">
        <div class="col-lg-5">
          <label class="form-label">Buscar</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.search"
            placeholder="Nombre, codigo, cedula, cargo, departamento o provincia"
          />
        </div>

        <div class="col-sm-6 col-lg-3">
          <label class="form-label">Ordenar por</label>
          <select class="form-select" [(ngModel)]="draft.sortBy">
            <option value="nombres">Nombres</option>
            <option value="cedula">Cedula</option>
            <option value="codigo_empleado">Codigo</option>
            <option value="fecha_ingreso">Fecha ingreso</option>
            <option value="cargo">Cargo</option>
            <option value="departamento">Departamento</option>
            <option value="sueldo">Sueldo</option>
            <option value="email">Email</option>
            <option value="estado_nombre">Estado</option>
            <option value="provincia_laboral_nombre">Provincia</option>
          </select>
        </div>

        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Orden</label>
          <select class="form-select" [(ngModel)]="draft.sortDir">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div class="col-lg-2 d-grid">
          <button class="btn btn-info text-white" type="button" (click)="apply()">
            Aplicar
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .filters-card {
      padding: 16px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.82);
    }
  `],
})
export class ReportFiltersComponent {
  readonly value = input<ReportFiltersValue>({
    search: '',
    sortBy: 'nombres',
    sortDir: 'asc',
  });
  readonly filtersChange = output<ReportFiltersValue>();

  protected draft: ReportFiltersValue = {
    search: '',
    sortBy: 'nombres',
    sortDir: 'asc',
  };

  ngOnChanges(): void {
    this.draft = { ...this.value() };
  }

  protected apply(): void {
    this.filtersChange.emit({ ...this.draft });
  }
}
