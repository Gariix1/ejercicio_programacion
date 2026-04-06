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
    <section class="filters-card" [class.filters-card--embedded]="embedded()">
      <div class="filters-head">
        <div>
          <h3>Encontrar empleados</h3>
        </div>
      </div>

      <div class="filters-toolbar" [class.filters-toolbar--mobile-open]="advancedOpen">
        <div class="toolbar-field toolbar-field--search">
          <label class="form-label">Nombre</label>
          <input
            class="form-control filter-input"
            type="search"
            [(ngModel)]="draft.nombre"
            (ngModelChange)="onTextChange()"
            placeholder="Buscar por nombre o apellido"
          />
        </div>

        <div class="toolbar-field toolbar-field--advanced">
          <label class="form-label">Codigo empleado</label>
          <input
            class="form-control filter-input"
            type="search"
            [(ngModel)]="draft.codigo"
            (ngModelChange)="onTextChange()"
            placeholder="Buscar por codigo"
            inputmode="numeric"
            autocomplete="off"
          />
        </div>

        <div class="toolbar-field toolbar-field--advanced toolbar-field--mini">
          <label class="form-label">Filas</label>
          <select class="form-select filter-input" [(ngModel)]="draft.perPage" (ngModelChange)="emitImmediate()">
            <option [ngValue]="20">20</option>
            <option [ngValue]="40">40</option>
            <option [ngValue]="80">80</option>
          </select>
        </div>

        <div class="toolbar-actions toolbar-field--advanced">
          <app-ui-button variant="outline-secondary" (click)="clear.emit()">
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
    </section>
  `,
  styles: [`
    .filters-card {
      padding: 14px 16px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 250, 244, 0.82) 100%);
      box-shadow: 0 14px 28px rgba(73, 44, 24, 0.06);
    }

    .filters-card--embedded {
      padding: 0;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
    }

    .filters-head {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 12px;
      margin-bottom: 8px;
    }

    .filters-head h3 {
      margin: 0;
      color: var(--text-strong);
      font-size: var(--font-size-section-title);
      font-weight: 700;
      line-height: var(--line-height-tight);
    }

    .filters-card--embedded .filters-head {
      margin-bottom: 8px;
    }

    .filter-input {
      min-height: 40px;
      border-radius: 12px;
      border-color: rgba(103, 86, 67, 0.18);
      background: rgba(255, 255, 255, 0.92);
      transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
    }

    .filter-input:focus {
      border-color: rgba(49, 119, 165, 0.45);
      box-shadow: 0 0 0 0.2rem rgba(49, 119, 165, 0.12);
      background: white;
    }

    .form-label {
      margin-bottom: 5px;
      font-size: var(--font-size-label);
      font-weight: 600;
      color: var(--text-soft);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .filters-toolbar {
      display: grid;
      grid-template-columns: minmax(0, 1.7fr) minmax(0, 1.4fr) minmax(92px, 0.55fr) auto;
      gap: 12px;
      align-items: end;
    }

    .toolbar-field {
      display: grid;
      gap: 0;
      min-width: 0;
    }

    .toolbar-field--mini {
      min-width: 0;
    }

    .toolbar-actions {
      display: flex;
      justify-content: flex-end;
      align-items: end;
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

    @media (max-width: 900px) {
      .filters-toolbar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .toolbar-actions {
        justify-content: flex-start;
      }
    }

    @media (max-width: 640px) {
      .filters-card {
        padding: 12px 14px;
      }

      .filters-card--embedded {
        padding: 0;
      }

      .filters-head {
        margin-bottom: 6px;
      }

      .filters-toolbar {
        grid-template-columns: minmax(0, 1fr);
        gap: 10px;
      }

      .toolbar-toggle {
        display: flex;
        justify-content: flex-start;
      }

      .toolbar-field--advanced,
      .toolbar-actions {
        display: none;
      }

      .filters-toolbar.filters-toolbar--mobile-open .toolbar-field--advanced {
        display: grid;
      }

      .filters-toolbar.filters-toolbar--mobile-open .toolbar-actions {
        display: flex;
        justify-content: stretch;
      }

      .filters-toolbar.filters-toolbar--mobile-open .toolbar-actions app-ui-button {
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
