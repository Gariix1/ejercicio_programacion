import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { PaginationControlsComponent } from '../../../shared/pagination-controls.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { EmployeesApiService } from '../data-access/employees-api.service';
import { EmployeeFiltersComponent, EmployeeFiltersValue } from '../components/employee-filters.component';
import { EmployeeTableComponent } from '../components/employee-table.component';
import { Employee, EmployeeListQuery, EmployeeSortField } from '../models/employee.model';

@Component({
  selector: 'app-employees-list-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ActionBarComponent,
    ModuleHeaderComponent,
    PaginationControlsComponent,
    UiButtonComponent,
    EmployeeFiltersComponent,
    EmployeeTableComponent,
  ],
  template: `
    <section class="screen">
      <app-module-header
        moduleTitle="Empleados"
        sectionTitle=""
      ></app-module-header>

      <div class="alert alert-success alert-dismissible fade show mb-0" role="alert" *ngIf="flashMessage">
        {{ flashMessage }}
        <button type="button" class="btn-close" aria-label="Close" (click)="flashMessage = null"></button>
      </div>

      <ng-container *ngIf="result$ | async as result">
        <section class="module-panel">
          <header class="panel-header">
            <div class="panel-copy">
              <span class="panel-kicker">Gestion de empleados</span>
              <h2>Gestion del modulo</h2>
              <p>Administra registros, busquedas y accesos rapidos del catalogo de empleados.</p>
            </div>

            <app-action-bar class="panel-actions" align="end">
              <app-ui-button variant="success" routerLink="/employees/new" [wide]="true">Nuevo empleado</app-ui-button>
              <app-ui-button variant="outline-primary" routerLink="/reports/employees" [wide]="true">Ver reporte</app-ui-button>
            </app-action-bar>
          </header>

          <section class="panel-stats" aria-label="Resumen del modulo">
            <article class="stat-item">
              <span class="stat-label">Total empleados</span>
              <strong class="stat-value">{{ result.pagination?.total ?? result.items.length }}</strong>
            </article>

            <article class="stat-item">
              <span class="stat-label">Pagina actual</span>
              <strong class="stat-value">
                {{ result.pagination?.current_page ?? 1 }} / {{ result.pagination?.last_page ?? 1 }}
              </strong>
            </article>

            <article class="stat-item">
              <span class="stat-label">Coincidencias</span>
              <strong class="stat-value">{{ result.items.length }}</strong>
            </article>
          </section>

          <section class="panel-section">
            <app-employee-filters
              [embedded]="true"
              [activeCount]="activeFilterChips.length"
              [value]="filters"
              (filtersChange)="onFiltersChange($event)"
              (clear)="clearFilters()"
            ></app-employee-filters>

            <section class="active-filters active-filters--left" *ngIf="activeFilterChips.length > 0">
              <span class="active-label">Filtros activos:</span>
              <span class="active-chip" *ngFor="let chip of activeFilterChips">{{ chip }}</span>
            </section>
          </section>
        </section>

        <app-employee-table
          [result]="result"
          [sortBy]="query.sortBy"
          [sortDir]="query.sortDir"
          (edit)="openEdit($event)"
          (sortChange)="onSortChange($event)"
        ></app-employee-table>

        <app-pagination-controls
          *ngIf="result.pagination && result.pagination.last_page > 1"
          [disablePrevious]="result.pagination.current_page <= 1"
          [disableNext]="result.pagination.current_page >= result.pagination.last_page"
          [statusText]="'Pagina ' + result.pagination.current_page + ' de ' + result.pagination.last_page"
          (previous)="goToPreviousPage()"
          (next)="goToNextPage()"
        ></app-pagination-controls>
      </ng-container>
    </section>
  `,
  styles: [`
    .screen {
      width: min(100%, var(--content-narrow-max));
      margin: 0 auto;
      display: grid;
      gap: 12px;
    }

    .module-panel {
      display: grid;
      gap: 12px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 250, 244, 0.84) 100%);
      box-shadow: 0 14px 28px rgba(73, 44, 24, 0.06);
    }

    .panel-header {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 14px;
    }

    .panel-copy {
      display: grid;
      gap: 2px;
      max-width: 480px;
    }

    .panel-kicker {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .panel-copy h2 {
      margin: 0;
      font-size: clamp(1.08rem, 1.42vw, 1.26rem);
      line-height: var(--line-height-tight);
      color: var(--text-strong);
      font-weight: 700;
    }

    .panel-actions {
      justify-content: flex-end;
      flex: 1 1 auto;
      align-self: center;
    }

    .panel-stats {
      display: flex;
      align-items: stretch;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      border: 1px solid rgba(103, 86, 67, 0.14);
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.62);
      scrollbar-width: none;
    }

    .panel-stats::-webkit-scrollbar {
      display: none;
    }

    .stat-item {
      display: grid;
      gap: 2px;
      flex: 1 1 0;
      min-width: 0;
      padding: 8px 12px;
      min-height: 0;
      align-content: center;
      background: transparent;
    }

    .stat-item:not(:last-child) {
      border-right: 1px solid rgba(103, 86, 67, 0.12);
    }

    .stat-label {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .stat-value {
      font-size: clamp(0.98rem, 1.18vw, 1.1rem);
      font-weight: 700;
      color: var(--text-strong);
      line-height: 1.1;
    }

    .panel-section {
      display: grid;
      gap: 10px;
      min-width: 0;
    }

    .active-filters {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      min-height: 24px;
    }

    .active-filters--left {
      justify-content: flex-start;
    }

    .active-label {
      color: var(--muted);
      font-size: var(--font-size-caption);
    }

    .active-chip {
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(197, 228, 247, 0.75);
      color: #255c80;
      font-size: var(--font-size-caption);
    }

    @media (max-width: 640px) {
      .module-panel {
        padding: 14px;
        border-radius: 18px;
      }

      .panel-header {
        align-items: stretch;
        flex-direction: column;
      }

      .panel-actions {
        justify-content: flex-start;
      }

      .stat-item {
        min-width: 156px;
      }
    }
  `],
})
export class EmployeesListPageComponent {
  protected flashMessage: string | null = history.state?.flashMessage ?? null;
  protected filters: EmployeeFiltersValue = {
    nombre: '',
    codigo: '',
    perPage: 20,
  };

  readonly query: Required<EmployeeListQuery> = {
    search: '',
    sortBy: 'nombres',
    sortDir: 'asc',
    page: 1,
    perPage: 20,
  };

  private readonly querySubject = new BehaviorSubject<EmployeeListQuery>({ ...this.query });
  private lastKnownPage = 1;
  private lastKnownLastPage = 1;

  readonly result$ = this.querySubject.pipe(
    switchMap((query) => this.employeesApiService.list(query)),
    tap((result) => {
      this.lastKnownPage = result.pagination?.current_page ?? this.query.page;
      this.lastKnownLastPage = result.pagination?.last_page ?? 1;
    }),
  );

  constructor(
    private readonly employeesApiService: EmployeesApiService,
    private readonly router: Router,
  ) {}

  protected onFiltersChange(value: EmployeeFiltersValue): void {
    this.filters = value;

    const terms = [value.nombre, value.codigo]
      .map((term) => term.trim())
      .filter((term) => term !== '');

    this.updateQuery({
      search: terms.join(' '),
      perPage: value.perPage,
      page: 1,
    });
  }

  goToPreviousPage(): void {
    if (this.lastKnownPage > 1) {
      this.updateQuery({ page: this.lastKnownPage - 1 });
    }
  }

  goToNextPage(): void {
    if (this.lastKnownPage < this.lastKnownLastPage) {
      this.updateQuery({ page: this.lastKnownPage + 1 });
    }
  }

  protected openEdit(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  protected onSortChange(sort: { sortBy: EmployeeSortField; sortDir: 'asc' | 'desc' }): void {
    this.updateQuery({
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
      page: 1,
    });
  }

  protected clearFilters(): void {
    this.filters = { nombre: '', codigo: '', perPage: 20 };
    this.updateQuery({ search: '', perPage: 20, page: 1 });
  }

  protected get activeFilterChips(): string[] {
    return [
      this.filters.nombre ? `Nombre: ${this.filters.nombre}` : null,
      this.filters.codigo ? `Codigo: ${this.filters.codigo}` : null,
      this.filters.perPage !== 20 ? `Filas: ${this.filters.perPage}` : null,
    ].filter(Boolean) as string[];
  }

  private updateQuery(partial: Partial<EmployeeListQuery>): void {
    const nextPage = partial.page ?? this.query.page;
    const clampedPage = Math.min(Math.max(nextPage ?? 1, 1), Math.max(this.lastKnownLastPage, 1));

    Object.assign(this.query, {
      ...partial,
      page: clampedPage,
    });
    this.querySubject.next({ ...this.query });
  }
}
