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
    <section class="card shadow-sm filters-card" [class.filters-card--embedded]="embedded()">
      <div class="card-body p-3 p-lg-4" [class.p-0]="embedded()">
        <div class="filters-toolbar" [class.filters-toolbar--mobile-open]="advancedOpen">
          <div class="toolbar-field toolbar-field--search">
            <label class="form-label">Nombre</label>
            <input
              class="form-control"
              type="search"
              [(ngModel)]="draft.nombre"
              (ngModelChange)="onTextChange()"
              placeholder="Buscar por nombre o apellido"
            />
          </div>

          <div class="toolbar-field toolbar-field--advanced">
            <label class="form-label">Codigo</label>
            <input
              class="form-control"
              type="search"
              [(ngModel)]="draft.codigo"
              (ngModelChange)="onTextChange()"
              placeholder="Buscar por codigo"
            />
          </div>

          <div class="toolbar-field toolbar-field--advanced toolbar-field--compact">
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

          <div class="toolbar-field toolbar-field--advanced toolbar-field--compact">
            <label class="form-label">Orden</label>
            <select class="form-select" [(ngModel)]="draft.sortDir" (ngModelChange)="emitImmediate()">
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>

          <div class="toolbar-field toolbar-field--advanced toolbar-field--mini">
            <label class="form-label">Filas</label>
            <select class="form-select" [(ngModel)]="draft.perPage" (ngModelChange)="emitImmediate()">
              <option [ngValue]="20">20</option>
              <option [ngValue]="40">40</option>
              <option [ngValue]="80">80</option>
            </select>
          </div>

          <div class="toolbar-actions toolbar-field--advanced">
            <app-ui-button variant="outline-secondary" (click)="reset()">
              Limpiar
            </app-ui-button>
          </div>

          <div class="toolbar-toggle">
            <app-ui-button variant="outline-secondary" (click)="toggleAdvanced()">
              {{ advancedOpen ? 'Ocultar filtros' : 'Filtros' }}
              <span class="toolbar-toggle-count" *ngIf="activeCount() > 0">{{ activeCount() }}</span>
            </app-ui-button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .filters-card {
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.82);
    }

    .filters-card--embedded {
      border: 0;
      background: transparent;
      box-shadow: none !important;
    }

    .form-label {
      display: inline-flex;
      align-items: center;
      min-height: 1rem;
      margin-bottom: 0;
      color: var(--text-soft);
      font-size: var(--font-size-label);
      font-weight: 600;
      line-height: 1.1;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

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

    .toolbar-field {
      display: grid;
      gap: 6px;
      align-content: start;
      min-width: 0;
    }

    .toolbar-field--compact,
    .toolbar-field--mini {
      min-width: 0;
    }

    .toolbar-actions {
      display: flex;
      justify-content: flex-end;
      align-items: end;
      min-width: 0;
    }

    .toolbar-toggle {
      display: none;
    }

    .toolbar-toggle-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding-inline: 6px;
      border-radius: 999px;
      background: rgba(49, 119, 165, 0.16);
      color: #255c80;
      font-size: 0.74rem;
      font-weight: 700;
      line-height: 1;
    }

    .form-control,
    .form-select {
      min-height: 40px;
    }

    @media (max-width: 992px) {
      .filters-toolbar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .toolbar-actions {
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

      .toolbar-toggle {
        display: flex;
        justify-content: flex-start;
        grid-column: 1 / -1;
      }

      .toolbar-field--advanced,
      .toolbar-actions {
        display: none;
      }

      .filters-toolbar.filters-toolbar--mobile-open .toolbar-field--advanced {
        display: grid;
        grid-column: 1 / -1;
      }

      .filters-toolbar.filters-toolbar--mobile-open .toolbar-actions {
        display: flex;
        justify-content: stretch;
        grid-column: 1 / -1;
      }

      .filters-toolbar.filters-toolbar--mobile-open .toolbar-actions app-ui-button {
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
