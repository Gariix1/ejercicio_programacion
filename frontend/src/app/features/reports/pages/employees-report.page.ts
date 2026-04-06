import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, map, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { PaginationControlsComponent } from '../../../shared/pagination-controls.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { EmployeeSortField } from '../../employees/models/employee.model';
import { ReportsApiService } from '../data-access/reports-api.service';
import { ReportFiltersComponent, ReportFiltersValue } from '../components/report-filters.component';
import { ReportTableComponent } from '../components/report-table.component';

@Component({
  selector: 'app-employees-report-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    ActionBarComponent,
    ModuleHeaderComponent,
    PaginationControlsComponent,
    UiButtonComponent,
    ReportFiltersComponent,
    ReportTableComponent,
  ],
  template: `
    <section class="report-page">
      <ng-container *ngIf="vm$ | async as vm">
        <div class="report-top mx-auto">
          <app-module-header
            moduleTitle="Reportes"
            sectionTitle="Reporte de empleados"
          ></app-module-header>

          <section class="report-panel">
            <header class="panel-header">
              <div class="panel-copy">
                <span class="panel-kicker">Consulta de empleados</span>
                <h2>Reporte operativo del catalogo</h2>
              </div>

              <app-action-bar class="panel-actions" align="end">
                <app-ui-button variant="link" routerLink="/reports">Volver a reportes</app-ui-button>
              </app-action-bar>
            </header>

            <section class="panel-stats" aria-label="Resumen del reporte">
              <article class="stat-item" *ngFor="let chip of vm.summaryChips">
                <span class="stat-label">{{ chip.label }}</span>
                <strong class="stat-value">{{ chip.value }}</strong>
              </article>
            </section>

            <section class="panel-section">
              <app-report-filters
                [embedded]="true"
                [activeCount]="vm.activeFilterCount"
                [value]="filters"
                (filtersChange)="onFiltersChange($event)"
              ></app-report-filters>

              <section class="active-filters active-filters--left" *ngIf="vm.activeFilters.length > 0">
                <span class="active-label">Filtros activos:</span>
                <span class="active-chip" *ngFor="let filter of vm.activeFilters">{{ filter }}</span>
              </section>
            </section>
          </section>
        </div>

        <div class="report-results-shell">
          <div class="report-results">
            <app-report-table
              [result]="vm.report"
              [sortBy]="filters.sortBy"
              [sortDir]="filters.sortDir"
              (sortChange)="onSortChange($event)"
            ></app-report-table>

            <app-pagination-controls
              *ngIf="vm.report.pagination && vm.report.pagination.last_page > 1"
              [disablePrevious]="vm.report.pagination.current_page <= 1"
              [disableNext]="vm.report.pagination.current_page >= vm.report.pagination.last_page"
              [statusText]="'Pagina ' + vm.report.pagination.current_page + ' de ' + vm.report.pagination.last_page"
              (previous)="goToPage(vm.report.pagination.current_page - 1, vm.report.pagination.last_page)"
              (next)="goToPage(vm.report.pagination.current_page + 1, vm.report.pagination.last_page)"
            ></app-pagination-controls>
          </div>
        </div>
      </ng-container>
    </section>
  `,
  styles: [`
    .report-page {
      width: 100%;
      min-width: 0;
      display: grid;
      gap: 12px;
    }

    .report-top {
      width: 100%;
      max-width: calc(var(--shell-max) - (var(--page-padding-x) * 2));
      min-width: 0;
      display: grid;
      gap: 12px;
    }

    .report-results-shell {
      width: 100%;
      min-width: 0;
    }

    .report-results {
      width: 100%;
      max-width: calc(var(--shell-max) - (var(--page-padding-x) * 2));
      margin: 0 auto;
      min-width: 0;
      display: grid;
      gap: 12px;
      align-content: start;
    }

    .report-panel {
      display: grid;
      gap: 12px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 250, 244, 0.84) 100%);
      box-shadow: 0 14px 28px rgba(73, 44, 24, 0.06);
    }

    .panel-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: flex-start;
      gap: 14px;
    }

    .panel-copy {
      display: grid;
      gap: 4px;
      max-width: 640px;
      align-content: start;
    }

    .panel-kicker {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .panel-copy h2 {
      margin: 0;
      font-size: clamp(1.08rem, 1.45vw, 1.28rem);
      line-height: var(--line-height-tight);
      color: var(--text-strong);
      font-weight: 700;
    }

    .panel-actions {
      justify-content: flex-end;
      margin-left: auto;
      flex: 0 0 auto;
      align-self: flex-start;
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
      font-size: clamp(0.96rem, 1.16vw, 1.08rem);
      color: var(--text-strong);
      font-weight: 700;
      line-height: 1.1;
    }

    .panel-section {
      display: grid;
      gap: 10px;
      min-width: 0;
      padding-top: 2px;
    }

    .active-filters {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
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

    @media (max-width: 992px) {
      .stat-item {
        min-width: 170px;
      }
    }

    @media (max-width: 640px) {
      .report-panel {
        padding: 14px;
        border-radius: 18px;
      }

      .panel-header {
        align-items: stretch;
        grid-template-columns: 1fr;
      }

      .panel-actions {
        justify-content: flex-start;
        margin-left: 0;
      }

      .stat-item {
        min-width: 150px;
      }
    }
  `],
})
export class EmployeesReportPageComponent {
  protected filters: ReportFiltersValue = {
    nombre: '',
    codigo: '',
    sortBy: 'nombres',
    sortDir: 'asc',
    perPage: 40,
  };

  readonly vm$ = combineLatest([
    this.reportsApiService.summary(),
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        this.filters = this.mapQueryParamsToFilters(params);
        const page = Number(params.get('page') ?? 1);
        const terms = [this.filters.nombre, this.filters.codigo]
          .map((term) => term.trim())
          .filter((term) => term !== '');

        return this.reportsApiService.listEmployees({
          search: terms.join(' '),
          sortBy: this.filters.sortBy,
          sortDir: this.filters.sortDir,
          page,
          perPage: this.filters.perPage,
        }).pipe(
          map((report) => ({
            report,
            activeFilters: [
              this.filters.nombre ? `Nombre: ${this.filters.nombre}` : null,
              this.filters.codigo ? `Codigo: ${this.filters.codigo}` : null,
              `Orden: ${this.filters.sortBy} ${this.filters.sortDir}`,
              `Filas: ${this.filters.perPage}`,
            ].filter(Boolean) as string[],
          })),
        );
      }),
    ),
  ]).pipe(
    map(([summaryResult, reportState]) => ({
      report: reportState.report,
      activeFilters: reportState.activeFilters,
      activeFilterCount: this.getActiveFilterCount(this.filters),
      summaryChips: [
        { label: 'Total empleados', value: summaryResult.summary.total_empleados },
        { label: 'Vigentes', value: summaryResult.summary.empleados_vigentes },
        { label: 'Retirados', value: summaryResult.summary.empleados_retirados },
        { label: 'Sueldo promedio', value: `$${summaryResult.summary.sueldo_promedio.toFixed(2)}` },
      ],
    })),
  );

  constructor(
    private readonly reportsApiService: ReportsApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  protected onFiltersChange(filters: ReportFiltersValue): void {
    this.filters = filters;

    const nextQueryParams = {
      nombre: filters.nombre || null,
      codigo: filters.codigo || null,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      perPage: filters.perPage,
      page: 1,
    };

    const currentFilters = this.mapQueryParamsToFilters(this.route.snapshot.queryParamMap);
    const currentPage = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);

    if (
      currentFilters.nombre === filters.nombre
      && currentFilters.codigo === filters.codigo
      && currentFilters.sortBy === filters.sortBy
      && currentFilters.sortDir === filters.sortDir
      && currentFilters.perPage === filters.perPage
      && currentPage === 1
    ) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: nextQueryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected onSortChange(sort: { sortBy: EmployeeSortField; sortDir: 'asc' | 'desc' }): void {
    this.onFiltersChange({
      ...this.filters,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
    });
  }

  protected goToPage(page: number, lastPage: number): void {
    const targetPage = Math.min(Math.max(page, 1), Math.max(lastPage, 1));
    const currentPage = Number(this.route.snapshot.queryParamMap.get('page') ?? 1);

    if (targetPage === currentPage) {
      return;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: targetPage,
      },
      queryParamsHandling: 'merge',
    });
  }

  private mapQueryParamsToFilters(params: import('@angular/router').ParamMap): ReportFiltersValue {
    const sortBy = (params.get('sortBy') as EmployeeSortField | null) ?? 'nombres';
    const sortDir = params.get('sortDir') === 'desc' ? 'desc' : 'asc';
    const perPage = Number(params.get('perPage') ?? 40);

    return {
      nombre: params.get('nombre') ?? '',
      codigo: params.get('codigo') ?? '',
      sortBy,
      sortDir,
      perPage: [20, 40, 80].includes(perPage) ? perPage : 40,
    };
  }

  private getActiveFilterCount(filters: ReportFiltersValue): number {
    let count = 0;

    if (filters.nombre.trim()) {
      count += 1;
    }

    if (filters.codigo.trim()) {
      count += 1;
    }

    if (filters.sortBy !== 'nombres' || filters.sortDir !== 'asc') {
      count += 1;
    }

    if (filters.perPage !== 40) {
      count += 1;
    }

    return count;
  }
}
