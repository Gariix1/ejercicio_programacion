import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
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
import {
  EmployeeFormField,
  EmployeeFormFieldErrors,
  parseEmployeeApiErrors,
} from '../forms/employee-form-errors';
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
          <div class="status-banner status-banner--error mb-3" *ngIf="submitError">
            {{ submitError }}
          </div>

          <div class="status-banner status-banner--info mb-3" *ngIf="activeTab === 'personal'">
            Completa los datos personales obligatorios antes de continuar a la ficha laboral.
          </div>

          <form [formGroup]="form" (ngSubmit)="onPrimaryAction(vm.mode, vm.employeeId)">
            <app-employee-personal-form
              *ngIf="activeTab === 'personal'"
              [form]="form"
              [provinces]="vm.provinces"
              [fieldErrors]="fieldErrors"
            ></app-employee-personal-form>

            <app-employee-labor-form
              *ngIf="activeTab === 'labor'"
              [form]="form"
              [provinces]="vm.provinces"
              [fieldErrors]="fieldErrors"
            ></app-employee-labor-form>
          </form>

          <div form-actions class="d-flex flex-wrap justify-content-center gap-3">
            <button
              class="btn btn-success"
              type="button"
              [disabled]="isSubmitting"
              (click)="onPrimaryAction(vm.mode, vm.employeeId)"
            >
              <span
                *ngIf="isSubmitting"
                class="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              {{
                isSubmitting
                  ? 'Guardando...'
                  : activeTab === 'personal'
                    ? 'Continuar'
                    : vm.mode === 'create'
                      ? 'Guardar'
                      : 'Actualizar'
              }}
            </button>

            <a class="btn btn-warning text-white" routerLink="/reports">Ver reporte</a>
            <a class="btn btn-outline-secondary" routerLink="/employees">
              {{ vm.mode === 'create' ? 'Cancelar' : 'Volver al listado' }}
            </a>
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

    .status-banner {
      padding: 12px 14px;
      border-radius: 10px;
      border: 1px solid transparent;
      font-size: 0.92rem;
    }

    .status-banner--info {
      border-color: rgba(49, 119, 165, 0.18);
      background: rgba(197, 228, 247, 0.55);
      color: #255c80;
    }

    .status-banner--error {
      border-color: rgba(181, 56, 56, 0.2);
      background: rgba(239, 211, 211, 0.7);
      color: #8c1f1f;
    }
  `],
})
export class EmployeeFormPageComponent {
  protected readonly form = buildEmployeeForm(this.formBuilder);
  protected activeTab: EmployeeFormTab = 'personal';
  protected isSubmitting = false;
  protected submitError: string | null = null;
  protected fieldErrors: EmployeeFormFieldErrors = {};

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
    this.clearSubmitState();

    if (this.activeTab === 'personal') {
      if (this.hasInvalidFields(this.personalFields)) {
        this.markFieldsTouched(this.personalFields);

        return;
      }

      this.activeTab = 'labor';

      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.activeTab = this.hasInvalidFields(this.personalFields) ? 'personal' : 'labor';

      return;
    }

    const payload = mapEmployeeFormToPayload(this.form.getRawValue());

    const request$ = mode === 'edit' && employeeId !== null
      ? this.employeesApiService.update(employeeId, payload)
      : this.employeesApiService.create(payload);

    this.isSubmitting = true;

    request$.subscribe({
      next: () => {
        this.router.navigate(['/employees'], {
          state: {
            flashMessage: mode === 'edit'
              ? 'Empleado actualizado correctamente.'
              : 'Empleado creado correctamente.',
          },
        });
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting = false;

        const parsedErrors = parseEmployeeApiErrors(error.error);

        this.submitError = parsedErrors.formError;
        this.fieldErrors = parsedErrors.fieldErrors;

        const firstInvalidTab = this.hasInvalidFields(this.personalFields)
          || this.hasApiFieldErrors(this.personalFields)
          ? 'personal'
          : 'labor';

        this.activeTab = firstInvalidTab;
        this.markFieldsTouched(firstInvalidTab === 'personal' ? this.personalFields : this.laborFields);
      },
    });
  }

  private readonly personalFields: EmployeeFormField[] = [
    'nombres',
    'apellidos',
    'cedula',
    'provincia_personal_id',
    'fecha_nacimiento',
    'email',
    'telefono',
    'direccion',
  ];

  private readonly laborFields: EmployeeFormField[] = [
    'fecha_ingreso',
    'cargo',
    'departamento',
    'provincia_laboral_id',
    'codigo_empleado',
    'estado_codigo',
    'sueldo',
  ];

  private markFieldsTouched(fields: EmployeeFormField[]): void {
    for (const field of fields) {
      this.form.get(field)?.markAsTouched();
    }
  }

  private hasInvalidFields(fields: EmployeeFormField[]): boolean {
    return fields.some((field) => this.form.get(field)?.invalid);
  }

  private hasApiFieldErrors(fields: EmployeeFormField[]): boolean {
    return fields.some((field) => Boolean(this.fieldErrors[field]));
  }

  private clearSubmitState(): void {
    this.submitError = null;
    this.fieldErrors = {};
  }
}
