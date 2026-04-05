import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject } from 'rxjs';

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
        <div class="col-md-6">
          <label class="form-label">Nombre</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.nombre"
            (ngModelChange)="onTextChange()"
            placeholder="Buscar por nombre o apellido"
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">Codigo empleado</label>
          <input
            class="form-control"
            type="search"
            [(ngModel)]="draft.codigo"
            (ngModelChange)="onTextChange()"
            placeholder="Buscar por codigo"
            inputmode="numeric"
            autocomplete="off"
          />
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly textChanges = new Subject<EmployeeFiltersValue>();

  readonly value = input<EmployeeFiltersValue>({ nombre: '', codigo: '' });
  readonly filtersChange = output<EmployeeFiltersValue>();

  protected draft: EmployeeFiltersValue = { nombre: '', codigo: '' };

  constructor() {
    this.textChanges
      .pipe(
        debounceTime(300),
        map((value) => JSON.stringify(value)),
        distinctUntilChanged(),
        map((value) => JSON.parse(value) as EmployeeFiltersValue),
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
}
