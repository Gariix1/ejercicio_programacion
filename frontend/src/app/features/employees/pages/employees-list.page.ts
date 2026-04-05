import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { EmployeesApiService } from '../data-access/employees-api.service';
import { EmployeeFiltersComponent, EmployeeFiltersValue } from '../components/employee-filters.component';
import { EmployeeTableComponent } from '../components/employee-table.component';
import { Employee, EmployeeListQuery } from '../models/employee.model';

@Component({
  selector: 'app-employees-list-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    RouterLink,
    ModuleHeaderComponent,
    EmployeeFiltersComponent,
    EmployeeTableComponent,
  ],
  template: `
    <section class="screen">
      <app-module-header
        moduleTitle="Modulo de Empleados"
        sectionTitle=""
      ></app-module-header>

      <ng-container *ngIf="result$ | async as result">
        <app-employee-filters
          class="mt-3"
          [value]="filters"
          (filtersChange)="onFiltersChange($event)"
        ></app-employee-filters>

        <app-employee-table
          class="mt-3"
          [result]="result"
          (edit)="openEdit($event)"
        ></app-employee-table>

        <section class="actions mt-3">
          <a class="btn btn-success" routerLink="/employees/new">Crear</a>
          <a class="btn btn-warning text-white" routerLink="/reports">Reporte</a>
          <button class="btn btn-danger" type="button" (click)="exitModule()">Salir</button>
        </section>

        <section class="pager mt-3" *ngIf="result.pagination && result.pagination.last_page > 1">
          <button
            class="btn btn-outline-secondary"
            type="button"
            [disabled]="!result.links.prev"
            (click)="goToPreviousPage()"
          >
            Anterior
          </button>

          <button
            class="btn btn-outline-primary"
            type="button"
            [disabled]="!result.links.next"
            (click)="goToNextPage()"
          >
            Siguiente
          </button>
        </section>
      </ng-container>
    </section>
  `,
  styles: [`
    .screen {
      width: min(100%, 760px);
      margin: 0 auto;
      display: grid;
      gap: 16px;
    }

    .actions,
    .pager {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }
  `],
})
export class EmployeesListPageComponent {
  protected filters: EmployeeFiltersValue = {
    nombre: '',
    codigo: '',
  };

  readonly query: Required<EmployeeListQuery> = {
    search: '',
    sortBy: 'nombres',
    sortDir: 'asc',
    page: 1,
    perPage: 20,
  };

  private readonly querySubject = new BehaviorSubject<EmployeeListQuery>({ ...this.query });

  readonly result$ = this.querySubject.pipe(
    switchMap((query) => this.employeesApiService.list(query)),
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

    this.updateQuery({ search: terms.join(' '), page: 1 });
  }

  goToPreviousPage(): void {
    if (this.query.page > 1) {
      this.updateQuery({ page: this.query.page - 1 });
    }
  }

  goToNextPage(): void {
    this.updateQuery({ page: this.query.page + 1 });
  }

  protected openEdit(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }

  protected exitModule(): void {
    this.filters = { nombre: '', codigo: '' };
    this.updateQuery({ search: '', page: 1 });
  }

  private updateQuery(partial: Partial<EmployeeListQuery>): void {
    Object.assign(this.query, partial);
    this.querySubject.next({ ...this.query });
  }
}
