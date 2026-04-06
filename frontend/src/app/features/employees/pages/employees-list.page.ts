import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, switchMap, tap } from 'rxjs';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { PaginationControlsComponent } from '../../../shared/pagination-controls.component';
import { StatStripComponent, StatStripItem } from '../../../shared/stat-strip.component';
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
    StatStripComponent,
    UiButtonComponent,
    EmployeeFiltersComponent,
    EmployeeTableComponent,
  ],
  template: `
    <section class="app-page-shell">
      <app-module-header
        moduleTitle="Empleados"
        sectionTitle=""
      ></app-module-header>

      <div
        class="alert alert-success app-flash-alert mb-0"
        role="alert"
        *ngIf="flashMessage"
        [class.is-leaving]="isFlashMessageLeaving"
      >
        <span>{{ flashMessage }}</span>
        <button
          type="button"
          class="app-flash-alert-close"
          aria-label="Cerrar mensaje"
          (click)="dismissFlashMessage()"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <ng-container *ngIf="result$ | async as result">
        <section class="app-surface-panel app-surface-panel--compact">
          <header class="app-panel-header">
            <div class="app-panel-copy app-panel-copy--compact">
              <span class="app-panel-kicker">Gestion de empleados</span>
              <h2 class="app-panel-title">Gestion del modulo</h2>
              <p class="app-panel-description">Administra registros, busquedas y accesos rapidos del catalogo de empleados.</p>
            </div>

            <app-action-bar align="end">
              <app-ui-button variant="success" routerLink="/employees/new" [wide]="true">Nuevo empleado</app-ui-button>
              <app-ui-button variant="outline-primary" routerLink="/reports/employees" [wide]="true">Ver reporte</app-ui-button>
            </app-action-bar>
          </header>

          <app-stat-strip
            ariaLabel="Resumen del modulo"
            [items]="buildSummaryItems(result)"
          ></app-stat-strip>

          <section class="app-panel-section">
            <app-employee-filters
              [embedded]="true"
              [activeCount]="activeFilterChips.length"
              [value]="filters"
              (filtersChange)="onFiltersChange($event)"
              (clear)="clearFilters()"
            ></app-employee-filters>

            <section class="app-filter-chips" *ngIf="activeFilterChips.length > 0">
              <span class="app-filter-label">Filtros activos:</span>
              <span class="app-filter-chip" *ngFor="let chip of activeFilterChips">{{ chip }}</span>
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
          [currentPage]="result.pagination.current_page"
          [lastPage]="result.pagination.last_page"
          [disablePrevious]="result.pagination.current_page <= 1"
          [disableNext]="result.pagination.current_page >= result.pagination.last_page"
          [statusText]="result.pagination.current_page + ' de ' + result.pagination.last_page"
          (previous)="goToPreviousPage()"
          (next)="goToNextPage()"
          (pageChange)="goToPage($event)"
        ></app-pagination-controls>
      </ng-container>
    </section>
  `,
  styles: [`
    .app-flash-alert {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px 16px;
      border: 1px solid rgba(114, 191, 132, 0.22);
      border-radius: 16px;
      background:
        linear-gradient(180deg, rgba(220, 245, 226, 0.82) 0%, rgba(210, 240, 218, 0.66) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.34), transparent 46%);
      color: #24613a;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 12px 24px rgba(63, 148, 88, 0.08);
      transition:
        opacity 260ms ease,
        transform 260ms ease,
        filter 260ms ease;
    }

    .app-flash-alert.is-leaving {
      opacity: 0;
      transform: translateY(-6px) scale(0.992);
      filter: saturate(0.96);
    }

    .app-flash-alert-close {
      flex: 0 0 auto;
      width: 34px;
      height: 34px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.42);
      color: #24613a;
      font-size: 1.15rem;
      line-height: 1;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
      transition:
        transform 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        box-shadow 160ms ease;
    }

    .app-flash-alert-close:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.56);
      border-color: rgba(255, 255, 255, 0.42);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 8px 16px rgba(63, 148, 88, 0.08);
    }

    .app-flash-alert-close:focus-visible {
      outline: 0;
      box-shadow:
        0 0 0 0.18rem rgba(63, 148, 88, 0.14),
        0 8px 16px rgba(63, 148, 88, 0.08);
    }
  `],
})
export class EmployeesListPageComponent implements OnInit, OnDestroy {
  protected flashMessage: string | null = history.state?.flashMessage ?? null;
  protected isFlashMessageLeaving = false;
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
  private flashMessageTimer: number | null = null;
  private flashMessageFadeTimer: number | null = null;

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

  ngOnInit(): void {
    this.scheduleFlashMessageDismiss();
  }

  ngOnDestroy(): void {
    this.clearFlashMessageTimer();
    this.clearFlashMessageFadeTimer();
  }

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

  protected goToPage(page: number): void {
    if (page === this.lastKnownPage) {
      return;
    }

    this.updateQuery({ page });
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

  protected dismissFlashMessage(): void {
    if (!this.flashMessage || this.isFlashMessageLeaving) {
      return;
    }

    this.clearFlashMessageTimer();
    this.isFlashMessageLeaving = true;
    this.flashMessageFadeTimer = window.setTimeout(() => {
      this.flashMessage = null;
      this.isFlashMessageLeaving = false;
      this.flashMessageFadeTimer = null;
    }, 260);
  }

  protected get activeFilterChips(): string[] {
    return [
      this.filters.nombre ? `Nombre: ${this.filters.nombre}` : null,
      this.filters.codigo ? `Codigo: ${this.filters.codigo}` : null,
      this.filters.perPage !== 20 ? `Filas: ${this.filters.perPage}` : null,
    ].filter(Boolean) as string[];
  }

  protected buildSummaryItems(result: { items: Employee[]; pagination?: { total?: number; current_page?: number; last_page?: number } | null }): StatStripItem[] {
    return [
      { label: 'Total empleados', value: result.pagination?.total ?? result.items.length },
      { label: 'Pagina actual', value: `${result.pagination?.current_page ?? 1} / ${result.pagination?.last_page ?? 1}` },
      { label: 'Coincidencias', value: result.items.length },
    ];
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

  private scheduleFlashMessageDismiss(): void {
    this.clearFlashMessageTimer();
    this.clearFlashMessageFadeTimer();

    if (!this.flashMessage) {
      return;
    }

    this.isFlashMessageLeaving = false;
    this.flashMessageTimer = window.setTimeout(() => {
      this.dismissFlashMessage();
      this.flashMessageTimer = null;
    }, 2440);
  }

  private clearFlashMessageTimer(): void {
    if (this.flashMessageTimer !== null) {
      clearTimeout(this.flashMessageTimer);
      this.flashMessageTimer = null;
    }
  }

  private clearFlashMessageFadeTimer(): void {
    if (this.flashMessageFadeTimer !== null) {
      clearTimeout(this.flashMessageFadeTimer);
      this.flashMessageFadeTimer = null;
    }
  }
}
