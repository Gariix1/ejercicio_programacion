import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { StatusBannerComponent } from '../../../shared/status-banner.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { ProvincesApiService } from '../../provinces/data-access/provinces-api.service';
import { Province } from '../../provinces/models/province.model';
import { EmployeesApiService } from '../data-access/employees-api.service';
import {
  buildEmployeeForm,
  EmployeeFormTab,
  EmployeeFormGroup,
  mapEmployeeFormToPayload,
  patchEmployeeForm,
  resetEmployeeForm,
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
    ActionBarComponent,
    ModuleHeaderComponent,
    StatusBannerComponent,
    UiButtonComponent,
    EmployeeFormShellComponent,
    EmployeePersonalFormComponent,
    EmployeeLaborFormComponent,
  ],
  template: `
    <section class="screen">
      <ng-container *ngIf="vm$ | async as vm">
        <ng-container *ngIf="!vm.loadError; else loadErrorState">
          <app-employee-form-shell
            [sectionTitle]="vm.sectionTitle"
            [activeTab]="activeTab"
            [canAccessLaborTab]="canAccessLaborTab"
            (tabChange)="onTabChange($event)"
          >
            <app-status-banner variant="error" class="mb-3" *ngIf="submitError">
              {{ submitError }}
            </app-status-banner>

            <app-status-banner variant="info" class="mb-3" *ngIf="activeTab === 'personal'">
              Completa los datos personales obligatorios antes de continuar a la ficha laboral.
            </app-status-banner>

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

            <app-action-bar form-actions>
              <app-ui-button
                variant="success"
                [disabled]="isSubmitting"
                [wide]="true"
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
              </app-ui-button>

              <app-ui-button variant="outline-secondary" routerLink="/employees">
                {{ vm.mode === 'create' ? 'Cancelar' : 'Volver al listado' }}
              </app-ui-button>
            </app-action-bar>
          </app-employee-form-shell>
        </ng-container>

        <ng-template #loadErrorState>
          <div class="screen-stack">
            <app-module-header
              moduleTitle="Empleados"
              [sectionTitle]="vm.sectionTitle"
            ></app-module-header>

            <section class="load-error-card">
              <app-status-banner variant="error">
                {{ vm.loadError }}
              </app-status-banner>

              <app-action-bar class="mt-3">
                <app-ui-button variant="outline-primary" routerLink="/employees">Volver al modulo</app-ui-button>
              </app-action-bar>
            </section>
          </div>
        </ng-template>
      </ng-container>
    </section>
  `,
  styles: [`
    .screen {
      width: min(100%, 920px);
      margin: 0 auto;
      display: grid;
      gap: 16px;
    }

    .screen-stack {
      display: grid;
      gap: 14px;
    }

    .load-error-card {
      padding: 22px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 16px 32px rgba(73, 44, 24, 0.04);
    }

    @media (max-width: 640px) {
      .screen {
        gap: 14px;
      }

      .load-error-card {
        padding: 16px;
      }
    }
  `],
})
export class EmployeeFormPageComponent {
  protected readonly form: EmployeeFormGroup = buildEmployeeForm(this.formBuilder);
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
  ]).pipe(
    switchMap(([mode, employeeId]) =>
      this.provincesApiService.list().pipe(
        switchMap((provinces) => {
          if (mode === 'edit' && employeeId !== null) {
            return this.employeesApiService.findById(employeeId).pipe(
              tap((employee) => this.prepareEditForm(employee)),
              map(() => this.buildVm(mode, employeeId, provinces)),
              catchError((error) => of(this.buildLoadErrorVm(mode, error, employeeId, provinces))),
            );
          }

          if (mode === 'edit') {
            return of(this.buildLoadErrorVm(mode, new Error('missing-id'), employeeId, provinces));
          }

          this.prepareCreateForm();

          return of(this.buildVm(mode, employeeId, provinces));
        }),
        catchError((error) => of(this.buildLoadErrorVm(mode, error, employeeId, []))),
      ),
    ),
    catchError((error) =>
      of(this.buildLoadErrorVm('create', error, null, [])),
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
    if (tab === 'labor' && !this.canAccessLaborTab) {
      this.markFieldsTouched(this.personalFields);

      return;
    }

    this.activeTab = tab;
  }

  protected onPrimaryAction(mode: 'create' | 'edit', employeeId: number | null): void {
    this.clearSubmitState();

    if (this.activeTab === 'personal') {
      if (!this.canAccessLaborTab) {
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

  protected get canAccessLaborTab(): boolean {
    return !this.hasInvalidFields(this.personalFields) && !this.hasApiFieldErrors(this.personalFields);
  }

  private prepareCreateForm(): void {
    resetEmployeeForm(this.form);
    this.activeTab = 'personal';
    this.clearSubmitState();
  }

  private prepareEditForm(employee: Parameters<typeof patchEmployeeForm>[1]): void {
    patchEmployeeForm(this.form, employee);
    this.activeTab = 'personal';
    this.clearSubmitState();
  }

  private buildVm(
    mode: 'create' | 'edit',
    employeeId: number | null,
    provinces: Province[],
  ): EmployeeFormVm {
    return {
      mode,
      employeeId,
      provinces,
      sectionTitle: mode === 'edit' ? 'Editar empleado' : 'Crear empleado nuevo',
      loadError: null,
    };
  }

  private buildLoadErrorVm(
    mode: 'create' | 'edit',
    error: unknown,
    employeeId: number | null,
    provinces: Province[],
  ): EmployeeFormVm {
    this.activeTab = 'personal';
    this.clearSubmitState();

    const responseError = error instanceof HttpErrorResponse ? error : null;
    const loadError = mode === 'edit'
      ? responseError?.status === 404
        ? 'No encontramos el empleado que intentabas editar.'
        : 'No pudimos cargar la ficha del empleado. Intenta nuevamente o vuelve al modulo.'
      : 'No pudimos preparar el formulario del empleado. Intenta nuevamente.';

    return {
      mode,
      employeeId,
      provinces,
      sectionTitle: mode === 'edit' ? 'Editar empleado' : 'Crear empleado nuevo',
      loadError,
    };
  }
}

interface EmployeeFormVm {
  mode: 'create' | 'edit';
  employeeId: number | null;
  provinces: Province[];
  sectionTitle: string;
  loadError: string | null;
}
