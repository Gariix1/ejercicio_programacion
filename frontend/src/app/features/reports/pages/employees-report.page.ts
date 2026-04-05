import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';
import { RouterLink } from '@angular/router';
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

        <app-report-table
          class="mt-3"
          [result]="vm.report"
          [sortBy]="filters.sortBy"
          [sortDir]="filters.sortDir"
          (sortChange)="onSortChange($event)"
        ></app-report-table>

        <section class="actions mt-3">
          <a class="btn btn-danger" routerLink="/employees">Salir</a>
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
  `],
})
export class EmployeesReportPageComponent {
  protected filters: ReportFiltersValue = {
    search: '',
    sortBy: 'nombres',
    sortDir: 'asc',
  };

  private readonly filtersSubject = new BehaviorSubject<ReportFiltersValue>({
    ...this.filters,
  });

  readonly vm$ = combineLatest([
    this.reportsApiService.summary(),
    this.filtersSubject.pipe(
      switchMap((filters) => this.reportsApiService.listEmployees({
        search: filters.search,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
        page: 1,
        perPage: 40,
      })),
    ),
  ]).pipe(
    map(([summaryResult, reportResult]) => ({
      report: reportResult,
      summaryChips: [
        { label: 'Total empleados', value: summaryResult.summary.total_empleados },
        { label: 'Vigentes', value: summaryResult.summary.empleados_vigentes },
        { label: 'Retirados', value: summaryResult.summary.empleados_retirados },
        { label: 'Sueldo promedio', value: `$${summaryResult.summary.sueldo_promedio.toFixed(2)}` },
      ],
    })),
  );

  constructor(private readonly reportsApiService: ReportsApiService) {}

  protected onFiltersChange(filters: ReportFiltersValue): void {
    this.filters = filters;
    this.filtersSubject.next({ ...filters });
  }

  protected onSortChange(sort: { sortBy: EmployeeSortField; sortDir: 'asc' | 'desc' }): void {
    this.onFiltersChange({
      ...this.filters,
      sortBy: sort.sortBy,
      sortDir: sort.sortDir,
    });
  }
}
