import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { combineLatest, map, switchMap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
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
    RouterLink,
    ModuleHeaderComponent,
    ReportFiltersComponent,
    ReportTableComponent,
  ],
  template: `
    <section class="screen">
      <app-module-header
        moduleTitle="Modulo de Empleados"
        sectionTitle="Reporte empleado"
      ></app-module-header>

      <ng-container *ngIf="vm$ | async as vm">
        <section class="report-meta">
          <article class="meta-chip" *ngFor="let chip of vm.summaryChips">
            <span class="meta-label">{{ chip.label }}</span>
            <strong class="meta-value">{{ chip.value }}</strong>
          </article>
        </section>

        <app-report-filters
          class="mt-3"
          [value]="filters"
          (filtersChange)="onFiltersChange($event)"
        ></app-report-filters>

        <section class="active-filters" *ngIf="vm.activeFilters.length > 0">
          <span class="active-label">Filtros activos:</span>
          <span class="active-chip" *ngFor="let filter of vm.activeFilters">{{ filter }}</span>
        </section>

        <app-report-table
          class="mt-3"
          [result]="vm.report"
          [sortBy]="filters.sortBy"
          [sortDir]="filters.sortDir"
          (sortChange)="onSortChange($event)"
        ></app-report-table>

        <section class="pager" *ngIf="vm.report.pagination && vm.report.pagination.last_page > 1">
          <button
            class="btn btn-outline-secondary"
            type="button"
            [disabled]="!vm.report.links.prev"
            (click)="goToPage(vm.report.pagination.current_page - 1)"
          >
            Anterior
          </button>

          <span class="pager-status">
            Pagina {{ vm.report.pagination.current_page }} de {{ vm.report.pagination.last_page }}
          </span>

          <button
            class="btn btn-outline-primary"
            type="button"
            [disabled]="!vm.report.links.next"
            (click)="goToPage(vm.report.pagination.current_page + 1)"
          >
            Siguiente
          </button>
        </section>

        <section class="actions mt-3">
          <a class="btn btn-outline-secondary" routerLink="/employees">Volver al modulo</a>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .screen {
      width: min(100%, 1620px);
      margin: 0 auto;
      display: grid;
      gap: 16px;
    }

    .report-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid var(--border);
      background: rgba(255, 255, 255, 0.85);
    }

    .meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding-right: 14px;
      border-right: 1px solid rgba(102, 124, 149, 0.18);
    }

    .meta-chip:last-child {
      border-right: none;
      padding-right: 0;
    }

    .meta-label {
      color: var(--muted);
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .meta-value {
      font-size: 0.95rem;
    }

    .actions {
      display: flex;
      justify-content: center;
    }

    .active-filters,
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .active-label {
      color: var(--muted);
      font-size: 0.88rem;
    }

    .active-chip {
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(197, 228, 247, 0.75);
      color: #255c80;
      font-size: 0.85rem;
    }

    .pager-status {
      color: var(--muted);
      font-size: 0.9rem;
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

  protected goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page,
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
}
