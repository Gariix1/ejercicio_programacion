import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface EmployeeFiltersValue {
  nombre: string;
  codigo: string;
}

@Component({
  selector: 'app-employee-filters',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="filters-card">
      <div class="row g-3 align-items-end">
        <div class="col-md-5">
          <label class="form-label">Nombre</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.nombre"
            placeholder="Buscar por nombre o apellido"
          />
        </div>

        <div class="col-md-5">
          <label class="form-label">Codigo empleado</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.codigo"
            placeholder="Ej. E0001"
          />
        </div>

        <div class="col-md-2 d-grid">
          <button class="btn btn-info text-white" type="button" (click)="apply()">
            Buscar
          </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .filters-card {
      padding: 20px;
      border-radius: 16px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.82);
    }
  `],
})
export class EmployeeFiltersComponent {
  readonly value = input<EmployeeFiltersValue>({ nombre: '', codigo: '' });
  readonly filtersChange = output<EmployeeFiltersValue>();

  protected draft: EmployeeFiltersValue = { nombre: '', codigo: '' };

  ngOnChanges(): void {
    this.draft = { ...this.value() };
  }

  protected apply(): void {
    this.filtersChange.emit({ ...this.draft });
  }
}
