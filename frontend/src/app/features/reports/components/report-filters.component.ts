import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { areFlatValuesEqual } from '../../../shared/query-utils';
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
  imports: [NgIf, FormsModule, UiButtonComponent],
  template: `
    <section class="card shadow-sm app-filter-panel" [class.app-filter-panel--embedded]="embedded()">
      <div class="card-body p-3 p-lg-4" [class.p-0]="embedded()">
        <div class="app-filter-toolbar filters-toolbar" [class.filters-toolbar--mobile-open]="advancedOpen">
          <div class="app-filter-field toolbar-field--search">
            <label class="form-label app-filter-label">Nombre</label>
            <input
              class="form-control app-filter-control"
              type="search"
              [(ngModel)]="draft.nombre"
              (ngModelChange)="onTextChange()"
              placeholder="Buscar por nombre o apellido"
            />
          </div>

          <div class="app-filter-field app-filter-advanced">
            <label class="form-label app-filter-label">Codigo</label>
            <input
              class="form-control app-filter-control"
              type="search"
              [(ngModel)]="draft.codigo"
              (ngModelChange)="onTextChange()"
              placeholder="Buscar por codigo"
            />
          </div>

          <div class="app-filter-field app-filter-advanced toolbar-field--compact">
            <label class="form-label app-filter-label">Ordenar por</label>
            <select class="form-select app-filter-control" [(ngModel)]="draft.sortBy" (ngModelChange)="emitImmediate()">
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

          <div class="app-filter-field app-filter-advanced toolbar-field--compact">
            <label class="form-label app-filter-label">Orden</label>
            <select class="form-select app-filter-control" [(ngModel)]="draft.sortDir" (ngModelChange)="emitImmediate()">
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>

          <div class="app-filter-field app-filter-advanced toolbar-field--mini">
            <label class="form-label app-filter-label">Filas</label>
            <select class="form-select app-filter-control" [(ngModel)]="draft.perPage" (ngModelChange)="emitImmediate()">
              <option [ngValue]="20">20</option>
              <option [ngValue]="40">40</option>
              <option [ngValue]="80">80</option>
            </select>
          </div>

          <div class="app-filter-actions app-filter-advanced">
            <app-ui-button variant="outline-secondary" (click)="reset()">
              Limpiar
            </app-ui-button>
          </div>

          <div class="app-filter-toggle">
            <app-ui-button variant="outline-secondary" (click)="toggleAdvanced()">
              {{ advancedOpen ? 'Ocultar filtros' : 'Filtros' }}
              <span class="app-filter-toggle-count" *ngIf="activeCount() > 0">{{ activeCount() }}</span>
            </app-ui-button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .filters-toolbar {
      display: grid;
      grid-template-columns:
        minmax(0, 1.7fr)
        minmax(0, 1.2fr)
        minmax(132px, 0.9fr)
        minmax(126px, 0.9fr)
        minmax(86px, 0.5fr)
        auto;
      gap: 12px;
      align-items: end;
    }

    .toolbar-field--compact,
    .toolbar-field--mini {
      min-width: 0;
    }

    @media (max-width: 992px) {
      .filters-toolbar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .app-filter-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 640px) {
      .filters-toolbar {
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
      }

      .toolbar-field--search {
        grid-column: 1 / -1;
      }

      .app-filter-toggle {
        display: flex;
        justify-content: flex-start;
        grid-column: 1 / -1;
      }

      .app-filter-advanced,
      .app-filter-actions {
        display: none;
      }

      .filters-toolbar.filters-toolbar--mobile-open .app-filter-advanced {
        display: grid;
        grid-column: 1 / -1;
      }

      .filters-toolbar.filters-toolbar--mobile-open .app-filter-actions {
        display: flex;
        justify-content: stretch;
        grid-column: 1 / -1;
      }

      .filters-toolbar.filters-toolbar--mobile-open .app-filter-actions app-ui-button {
        width: 100%;
      }
    }
  `],
})
export class ReportFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly textChanges = new Subject<ReportFiltersValue>();

  readonly embedded = input(false);
  readonly activeCount = input(0);
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
  protected advancedOpen = false;

  constructor() {
    this.textChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(areFlatValuesEqual),
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

  protected toggleAdvanced(): void {
    this.advancedOpen = !this.advancedOpen;
  }
}
