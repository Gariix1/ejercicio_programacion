import { NgIf } from '@angular/common';
import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { areFlatValuesEqual } from '../../../shared/query-utils';

export interface EmployeeFiltersValue {
  nombre: string;
  codigo: string;
  perPage: number;
}

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [NgIf, FormsModule, UiButtonComponent],
  template: `
    <section class="card shadow-sm app-filter-panel" [class.app-filter-panel--embedded]="embedded()">
      <div class="card-body p-3 p-lg-4" [class.p-0]="embedded()">
        <div class="app-filter-head">
          <div>
            <h3>Encontrar empleados</h3>
          </div>
        </div>

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
            <label class="form-label app-filter-label">Codigo empleado</label>
            <input
              class="form-control app-filter-control"
              type="search"
              [(ngModel)]="draft.codigo"
              (ngModelChange)="onTextChange()"
              placeholder="Buscar por codigo"
              inputmode="numeric"
              autocomplete="off"
            />
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
            <app-ui-button variant="outline-secondary" (click)="clear.emit()">
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
      grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.4fr) minmax(92px, 0.55fr) auto;
      gap: 12px;
      align-items: end;
    }

    .toolbar-field--mini {
      min-width: 0;
    }

    @media (max-width: 900px) {
      .filters-toolbar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .app-filter-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 768px) {
      .filters-toolbar {
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
      }

      .app-filter-toggle {
        display: none;
      }

      .app-filter-advanced {
        display: grid;
      }

      .app-filter-actions {
        display: flex;
        justify-content: stretch;
      }

      .app-filter-actions app-ui-button {
        width: 100%;
      }
    }
  `],
})
export class EmployeeFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly textChanges = new Subject<EmployeeFiltersValue>();

  readonly embedded = input(false);
  readonly activeCount = input(0);
  readonly value = input<EmployeeFiltersValue>({ nombre: '', codigo: '', perPage: 20 });
  readonly filtersChange = output<EmployeeFiltersValue>();
  readonly clear = output<void>();

  protected draft: EmployeeFiltersValue = { nombre: '', codigo: '', perPage: 20 };
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

  protected toggleAdvanced(): void {
    this.advancedOpen = !this.advancedOpen;
  }
}
