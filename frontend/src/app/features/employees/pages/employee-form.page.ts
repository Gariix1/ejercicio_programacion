import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ProvincesApiService } from '../../provinces/data-access/provinces-api.service';
import { EmployeesApiService } from '../data-access/employees-api.service';
import {
  buildEmployeeForm,
  EmployeeFormTab,
  mapEmployeeFormToPayload,
  patchEmployeeForm,
} from '../forms/employee-form';
import { EmployeeFormShellComponent } from '../components/employee-form-shell.component';
import { EmployeeLaborFormComponent } from '../components/employee-labor-form.component';
import { EmployeePersonalFormComponent } from '../components/employee-personal-form.component';

@Component({
  selector: 'app-employee-form-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    EmployeeFormShellComponent,
    EmployeePersonalFormComponent,
    EmployeeLaborFormComponent,
  ],
  template: `
    <section class="screen">
      <ng-container *ngIf="vm$ | async as vm">
        <app-employee-form-shell
          [sectionTitle]="vm.sectionTitle"
          [activeTab]="activeTab"
          (tabChange)="onTabChange($event)"
        >
          <form [formGroup]="form" (ngSubmit)="onPrimaryAction(vm.mode, vm.employeeId)">
            <app-employee-personal-form
              *ngIf="activeTab === 'personal'"
              [form]="form"
              [provinces]="vm.provinces"
            ></app-employee-personal-form>

            <app-employee-labor-form
              *ngIf="activeTab === 'labor'"
              [form]="form"
              [provinces]="vm.provinces"
            ></app-employee-labor-form>
          </form>

          <div form-actions class="d-flex flex-wrap justify-content-center gap-3">
            <button
              class="btn btn-success"
              type="button"
              (click)="onPrimaryAction(vm.mode, vm.employeeId)"
            >
              {{ activeTab === 'personal' ? 'Continuar' : vm.mode === 'create' ? 'Guardar' : 'Actualizar' }}
            </button>

            <a class="btn btn-warning text-white" routerLink="/reports">Reporte</a>
            <a class="btn btn-danger" routerLink="/employees">Salir</a>
          </div>
        </app-employee-form-shell>
      </ng-container>
    </section>
  `,
  styles: [`
    .screen {
      width: min(100%, 760px);
      margin: 0 auto;
    }
  `],
})
export class EmployeeFormPageComponent {
  protected readonly form = buildEmployeeForm(this.formBuilder);
  protected activeTab: EmployeeFormTab = 'personal';

  protected readonly vm$ = combineLatest([
    this.route.data.pipe(
      map((data) => (data['mode'] as 'create' | 'edit') ?? 'create'),
    ),
    this.route.paramMap.pipe(
      map((params) => {
        const id = params.get('id');

        return id ? Number(id) : null;
      }),
    ),
    this.provincesApiService.list(),
  ]).pipe(
    switchMap(([mode, employeeId, provinces]) => {
      if (mode === 'edit' && employeeId !== null) {
        return this.employeesApiService.findById(employeeId).pipe(
          tap((employee) => patchEmployeeForm(this.form, employee)),
          map(() => ({
            mode,
            employeeId,
            provinces,
            sectionTitle: 'Editar empleado',
          })),
        );
      }

      return of({
        mode,
        employeeId,
        provinces,
        sectionTitle: 'Crear empleado nuevo',
      });
    }),
    catchError(() =>
      of({
        mode: 'create' as const,
        employeeId: null,
        provinces: [],
        sectionTitle: 'Crear empleado nuevo',
      }),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(
    private readonly employeesApiService: EmployeesApiService,
    private readonly formBuilder: FormBuilder,
    private readonly provincesApiService: ProvincesApiService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  protected onTabChange(tab: EmployeeFormTab): void {
    this.activeTab = tab;
  }

  protected onPrimaryAction(mode: 'create' | 'edit', employeeId: number | null): void {
    if (this.activeTab === 'personal') {
      this.activeTab = 'labor';

      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const payload = mapEmployeeFormToPayload(this.form.getRawValue());

    const request$ = mode === 'edit' && employeeId !== null
      ? this.employeesApiService.update(employeeId, payload)
      : this.employeesApiService.create(payload);

    request$.subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
    });
  }
}
