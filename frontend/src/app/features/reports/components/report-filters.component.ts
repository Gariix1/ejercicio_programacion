import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';
import { EmployeeSortField } from '../../employees/models/employee.model';

export interface ReportFiltersValue {
  nombre: string;
  codigo: string;
  sortBy: EmployeeSortField;
  sortDir: 'asc' | 'desc';
  perPage: number;
}

@Component({
  selector: 'app-report-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="filters-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-6 col-lg-4">
          <label class="form-label">Nombre</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.nombre"
            (ngModelChange)="onTextChange()"
            placeholder="Buscar por nombre o apellido"
          />
        </div>

        <div class="col-md-6 col-lg-3">
          <label class="form-label">Codigo</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.codigo"
            (ngModelChange)="onTextChange()"
            placeholder="Buscar por codigo"
          />
        </div>

        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Ordenar por</label>
          <select class="form-select" [(ngModel)]="draft.sortBy" (ngModelChange)="emitImmediate()">
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
          <select class="form-select" [(ngModel)]="draft.sortDir" (ngModelChange)="emitImmediate()">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div class="col-sm-6 col-lg-1">
          <label class="form-label">Filas</label>
          <select class="form-select" [(ngModel)]="draft.perPage" (ngModelChange)="emitImmediate()">
            <option [ngValue]="20">20</option>
            <option [ngValue]="40">40</option>
            <option [ngValue]="80">80</option>
          </select>
        </div>

        <div class="col-sm-6 col-lg-2 d-grid">
          <button class="btn btn-outline-secondary clear-button" type="button" (click)="reset()">
            Limpiar filtros
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

    .clear-button {
      white-space: nowrap;
    }
  `],
})
export class ReportFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly textChanges = new Subject<ReportFiltersValue>();

  readonly value = input<ReportFiltersValue>({
    nombre: '',
    codigo: '',
    sortBy: 'nombres',
    sortDir: 'asc',
    perPage: 40,
  });
  readonly filtersChange = output<ReportFiltersValue>();

  protected draft: ReportFiltersValue = {
    nombre: '',
    codigo: '',
    sortBy: 'nombres',
    sortDir: 'asc',
    perPage: 40,
  };

  constructor() {
    this.textChanges
      .pipe(
        debounceTime(300),
        map((value) => JSON.stringify(value)),
        distinctUntilChanged(),
        map((value) => JSON.parse(value) as ReportFiltersValue),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.filtersChange.emit(value);
      });
  }

  ngOnChanges(): void {
    this.draft = { ...this.value() };
  }

  protected onTextChange(): void {
    this.textChanges.next({ ...this.draft });
  }

  protected emitImmediate(): void {
    this.filtersChange.emit({ ...this.draft });
  }

  protected reset(): void {
    this.draft = {
      nombre: '',
      codigo: '',
      sortBy: 'nombres',
      sortDir: 'asc',
      perPage: 40,
    };

    this.emitImmediate();
  }
}
