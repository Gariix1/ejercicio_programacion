import { AsyncPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, firstValueFrom, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { ActionBarComponent } from '../../../shared/action-bar.component';
import { ConfirmActionChangeItem, ConfirmActionModalComponent } from '../../../shared/confirm-action-modal.component';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';
import { ProcessFeedbackModalComponent, ProcessFeedbackState } from '../../../shared/process-feedback-modal.component';
import { ensureMinimumProcessFeedbackDuration } from '../../../shared/process-feedback.utils';
import { StatusBannerComponent } from '../../../shared/status-banner.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';
import { ProvincesApiService } from '../../provinces/data-access/provinces-api.service';
import { Province } from '../../provinces/models/province.model';
import { EmployeesApiService } from '../data-access/employees-api.service';
import {
  buildEmployeeForm,
  createEmployeeFormValue,
  EmployeeFormTab,
  EmployeeFormGroup,
  EmployeeFormValue,
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
    ConfirmActionModalComponent,
    ModuleHeaderComponent,
    ProcessFeedbackModalComponent,
    StatusBannerComponent,
    UiButtonComponent,
    EmployeeFormShellComponent,
    EmployeePersonalFormComponent,
    EmployeeLaborFormComponent,
  ],
  template: `
    <section class="app-form-page-shell">
      <ng-container *ngIf="vm$ | async as vm">
        <ng-container *ngIf="!vm.loadError; else loadErrorState">
          <app-employee-form-shell
            [sectionTitle]="vm.sectionTitle"
            [activeTab]="activeTab"
            (tabChange)="onTabChange($event)"
          >
            <app-status-banner variant="error" class="mb-3" *ngIf="submitError">
              {{ submitError }}
            </app-status-banner>

            <form [formGroup]="form" (ngSubmit)="onPrimaryAction(vm.mode, vm.employeeId, vm.provinces)">
              <app-employee-personal-form
                *ngIf="activeTab === 'personal'"
                [form]="form"
                [provinces]="vm.provinces"
                [fieldErrors]="fieldErrors"
                [photoPreviewSrc]="photoPreviewUrl"
                [photoUploading]="isUploadingPhoto"
                [photoError]="photoUploadError"
                (photoSelected)="onPhotoSelected($event)"
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
                [disabled]="isSubmitting || isUploadingPhoto"
                [wide]="true"
                (click)="onPrimaryAction(vm.mode, vm.employeeId, vm.provinces)"
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
                    : vm.mode === 'create'
                      ? 'Guardar empleado'
                      : 'Actualizar empleado'
                }}
              </app-ui-button>

              <app-ui-button variant="outline-secondary" (click)="onCancelAction(vm.mode, vm.provinces)">
                {{ vm.mode === 'create' ? 'Cancelar' : 'Volver al listado' }}
              </app-ui-button>
            </app-action-bar>
          </app-employee-form-shell>
        </ng-container>

        <ng-template #loadErrorState>
          <div class="app-page-stack">
            <app-module-header
              moduleTitle="Empleados"
              [sectionTitle]="vm.sectionTitle"
            ></app-module-header>

            <section class="app-message-panel">
              <app-status-banner variant="error">
                {{ vm.loadError }}
              </app-status-banner>

              <app-action-bar class="mt-3">
                <app-ui-button variant="outline-primary" routerLink="/employees">Volver al modulo</app-ui-button>
              </app-action-bar>
            </section>
          </div>
        </ng-template>

        <app-process-feedback-modal
          [open]="isProcessModalOpen"
          [state]="processModalState"
          [title]="processModalTitle"
          [description]="processModalDescription"
          [actionLabel]="processModalActionLabel"
          [requireActionConfirm]="processModalRequiresConfirm"
          (close)="closeProcessModal()"
        ></app-process-feedback-modal>

        <app-confirm-action-modal
          [open]="isDiscardModalOpen"
          [title]="discardModalTitle"
          [description]="discardModalDescription"
          [changes]="discardModalChanges"
          [cancelLabel]="'Seguir editando'"
          [confirmLabel]="discardModalConfirmLabel"
          [confirmVariant]="'warning'"
          (close)="closeDiscardModal()"
          (confirm)="confirmDiscardChanges()"
        ></app-confirm-action-modal>

        <app-confirm-action-modal
          [open]="isSubmitConfirmModalOpen"
          [title]="submitConfirmTitle"
          [description]="submitConfirmDescription"
          [changes]="submitConfirmChanges"
          [cancelLabel]="'Seguir editando'"
          [confirmLabel]="submitConfirmLabel"
          [confirmVariant]="'primary'"
          (close)="closeSubmitConfirmModal()"
          (confirm)="confirmSubmitChanges()"
        ></app-confirm-action-modal>
      </ng-container>
    </section>
  `,
})
export class EmployeeFormPageComponent implements OnDestroy {
  protected readonly form: EmployeeFormGroup = buildEmployeeForm(this.formBuilder);
  protected activeTab: EmployeeFormTab = 'personal';
  protected isSubmitting = false;
  protected submitError: string | null = null;
  protected fieldErrors: EmployeeFormFieldErrors = {};
  protected isProcessModalOpen = false;
  protected processModalState: ProcessFeedbackState = 'loading';
  protected processModalTitle = '';
  protected processModalDescription = '';
  protected processModalActionLabel = 'Entendido';
  protected processModalRequiresConfirm = false;
  protected isUploadingPhoto = false;
  protected photoUploadError: string | null = null;
  protected photoPreviewUrl: string | null = null;
  protected isDiscardModalOpen = false;
  protected discardModalTitle = '';
  protected discardModalDescription = '';
  protected discardModalConfirmLabel = 'Descartar cambios';
  protected discardModalChanges: ConfirmActionChangeItem[] = [];
  protected isSubmitConfirmModalOpen = false;
  protected submitConfirmTitle = 'Confirmar actualizacion?';
  protected submitConfirmDescription = 'Revisa los cambios antes de guardar la ficha del empleado.';
  protected submitConfirmLabel = 'Guardar cambios';
  protected submitConfirmChanges: ConfirmActionChangeItem[] = [];
  private suppressBrowserUnloadPrompt = false;
  private pendingSubmitContext: {
    mode: 'create' | 'edit';
    employeeId: number | null;
    provinces: Province[];
  } | null = null;

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

  private initialFormValue: EmployeeFormValue = createEmployeeFormValue();
  private temporaryPhotoPreviewUrl: string | null = null;

  ngOnDestroy(): void {
    this.clearTemporaryPhotoPreview();
  }

  @HostListener('window:beforeunload', ['$event'])
  protected onBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasDiscardableChanges() && !this.isSubmitting && !this.suppressBrowserUnloadPrompt) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  protected onTabChange(tab: EmployeeFormTab): void {
    this.activeTab = tab;
  }

  protected onCancelAction(mode: 'create' | 'edit', provinces: Province[]): void {
    if (this.isSubmitting) {
      return;
    }

    const changes = this.getDiscardChanges(provinces);

    if (changes.length === 0) {
      this.navigateToEmployees();
      return;
    }

    this.discardModalTitle = mode === 'edit' ? 'Descartar cambios?' : 'Salir del formulario?';
    this.discardModalDescription = mode === 'edit'
      ? 'Tienes cambios sin guardar en la ficha del empleado. Si sales ahora, se perderan.'
      : 'Ya comenzaste a llenar la ficha del empleado. Si sales ahora, se perdera la informacion cargada.';
    this.discardModalConfirmLabel = mode === 'edit' ? 'Descartar cambios' : 'Salir sin guardar';
    this.discardModalChanges = changes;
    this.isDiscardModalOpen = true;
  }

  protected async onPhotoSelected(file: File): Promise<void> {
    if (this.isUploadingPhoto || this.isSubmitting) {
      return;
    }

    this.photoUploadError = null;

    if (!this.isSupportedPhoto(file)) {
      this.photoUploadError = 'La imagen debe estar en formato JPG, PNG o WEBP.';
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      this.photoUploadError = 'La imagen no puede superar los 6 MB.';
      return;
    }

    const previousPreviewUrl = this.photoPreviewUrl;
    this.photoPreviewUrl = this.createTemporaryPhotoPreview(file);
    this.isUploadingPhoto = true;

    try {
      const uploadedPhoto = await firstValueFrom(this.employeesApiService.uploadPhoto(file));
      this.clearTemporaryPhotoPreview();
      this.form.controls.fotografia.setValue(uploadedPhoto.path);
      this.form.controls.fotografia.markAsDirty();
      this.form.controls.fotografia.markAsTouched();
      this.photoPreviewUrl = uploadedPhoto.url;
    } catch (error) {
      this.clearTemporaryPhotoPreview();
      this.photoPreviewUrl = previousPreviewUrl;
      this.photoUploadError = this.resolvePhotoUploadError(error);
    } finally {
      this.isUploadingPhoto = false;
    }
  }

  protected async onPrimaryAction(
    mode: 'create' | 'edit',
    employeeId: number | null,
    provinces: Province[],
    skipConfirmation = false,
  ): Promise<void> {
    this.clearSubmitState();

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.activeTab = this.resolveInvalidTab();

      return;
    }

    if (mode === 'edit' && employeeId !== null && !skipConfirmation) {
      const changes = this.getDiscardChanges(provinces);

      if (changes.length > 0) {
        this.pendingSubmitContext = { mode, employeeId, provinces };
        this.submitConfirmChanges = changes;
        this.isSubmitConfirmModalOpen = true;
        return;
      }
    }

    const payload = mapEmployeeFormToPayload(this.form.getRawValue());

    const request$ = mode === 'edit' && employeeId !== null
      ? this.employeesApiService.update(employeeId, payload)
      : this.employeesApiService.create(payload);

    this.isSubmitting = true;
    const feedbackStartedAt = performance.now();
    this.openProcessModal(
      'loading',
      mode === 'edit' ? 'Actualizando empleado' : 'Guardando empleado',
      mode === 'edit'
        ? 'Estamos aplicando los cambios en la ficha del empleado.'
        : 'Estamos registrando la nueva ficha del empleado.',
    );

    try {
      await firstValueFrom(request$);
      await ensureMinimumProcessFeedbackDuration(feedbackStartedAt);

      this.openProcessModal(
        'success',
        mode === 'edit' ? 'Empleado actualizado' : 'Empleado creado',
        mode === 'edit'
          ? 'Los cambios se guardaron correctamente.'
          : 'La ficha del empleado se creo correctamente.',
        mode === 'edit' ? 'Volver al listado' : 'Ir al listado',
        true,
      );
    } catch (error) {
      await ensureMinimumProcessFeedbackDuration(feedbackStartedAt);
      this.isSubmitting = false;
      this.isProcessModalOpen = false;

      const parsedErrors = parseEmployeeApiErrors((error as HttpErrorResponse).error);

      this.submitError = parsedErrors.formError;
      this.fieldErrors = parsedErrors.fieldErrors;
      this.activeTab = this.resolveInvalidTab();
      this.markFieldsTouched(this.activeTab === 'personal' ? this.personalFields : this.laborFields);
    }
  }

  protected closeProcessModal(): void {
    if (this.processModalState === 'loading') {
      return;
    }

    this.isProcessModalOpen = false;

    if (this.processModalState === 'success') {
      this.navigateToEmployees({
        state: {
          flashMessage: this.route.snapshot.data['mode'] === 'edit'
            ? 'Empleado actualizado correctamente.'
            : 'Empleado creado correctamente.',
        },
      });
    }
  }

  protected closeDiscardModal(): void {
    this.isDiscardModalOpen = false;
  }

  protected confirmDiscardChanges(): void {
    this.isDiscardModalOpen = false;
    this.navigateToEmployees();
  }

  protected closeSubmitConfirmModal(): void {
    this.isSubmitConfirmModalOpen = false;
    this.pendingSubmitContext = null;
  }

  protected confirmSubmitChanges(): void {
    const context = this.pendingSubmitContext;

    this.isSubmitConfirmModalOpen = false;
    this.pendingSubmitContext = null;

    if (!context) {
      return;
    }

    void this.onPrimaryAction(context.mode, context.employeeId, context.provinces, true);
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

  private resolveInvalidTab(): EmployeeFormTab {
    const currentFields = this.activeTab === 'personal' ? this.personalFields : this.laborFields;

    if (this.hasInvalidFields(currentFields) || this.hasApiFieldErrors(currentFields)) {
      return this.activeTab;
    }

    return this.hasInvalidFields(this.personalFields) || this.hasApiFieldErrors(this.personalFields)
      ? 'personal'
      : 'labor';
  }

  private clearSubmitState(): void {
    this.submitError = null;
    this.fieldErrors = {};
    this.photoUploadError = null;
  }

  private isSupportedPhoto(file: File): boolean {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  }

  private resolvePhotoUploadError(error: unknown): string {
    const response = error as HttpErrorResponse | null;
    const apiDetail = response?.error?.errors?.[0]?.detail;

    if (typeof apiDetail === 'string' && apiDetail.trim() !== '') {
      return apiDetail;
    }

    return 'No pudimos cargar la imagen. Intenta nuevamente.';
  }

  private openProcessModal(
    state: ProcessFeedbackState,
    title: string,
    description: string,
    actionLabel = 'Entendido',
    requireActionConfirm = false,
  ): void {
    this.processModalState = state;
    this.processModalTitle = title;
    this.processModalDescription = description;
    this.processModalActionLabel = actionLabel;
    this.processModalRequiresConfirm = requireActionConfirm;
    this.isProcessModalOpen = true;
  }

  private prepareCreateForm(): void {
    this.clearTemporaryPhotoPreview();
    resetEmployeeForm(this.form);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.initialFormValue = { ...this.form.getRawValue() };
    this.photoPreviewUrl = null;
    this.activeTab = 'personal';
    this.clearSubmitState();
  }

  private prepareEditForm(employee: Parameters<typeof patchEmployeeForm>[1]): void {
    this.clearTemporaryPhotoPreview();
    patchEmployeeForm(this.form, employee);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.initialFormValue = { ...this.form.getRawValue() };
    this.photoPreviewUrl = employee.fotografia_url ?? employee.fotografia ?? null;
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

  private hasDiscardableChanges(): boolean {
    return this.getDiscardChanges().length > 0;
  }

  private getDiscardChanges(provinces: Province[] = []): ConfirmActionChangeItem[] {
    return this.buildDiscardChanges(provinces);
  }

  private navigateToEmployees(extras?: { state?: { flashMessage: string } }): void {
    this.suppressBrowserUnloadPrompt = true;

    void this.router.navigate(['/employees'], extras).catch(() => {
      this.suppressBrowserUnloadPrompt = false;
    });
  }

  private buildDiscardChanges(provinces: Province[]): ConfirmActionChangeItem[] {
    const current = this.form.getRawValue();
    const baseline = this.initialFormValue;
    const fields: (keyof EmployeeFormValue)[] = [
      'codigo_empleado',
      'nombres',
      'apellidos',
      'cedula',
      'telefono',
      'direccion',
      'fecha_nacimiento',
      'email',
      'fotografia',
      'observaciones_personales',
      'fecha_ingreso',
      'cargo',
      'departamento',
      'sueldo',
      'jornada_parcial',
      'observaciones_laborales',
      'provincia_personal_id',
      'provincia_laboral_id',
      'estado_codigo',
    ];

    return fields
      .filter((field) => this.normalizeCompareValue(baseline[field]) !== this.normalizeCompareValue(current[field]))
      .map((field) => {
        const before = this.formatChangeValue(field, baseline[field], provinces);
        const after = this.formatChangeValue(field, current[field], provinces);

        return before === 'Sin valor'
          ? { label: this.getChangeLabel(field), after }
          : { label: this.getChangeLabel(field), before, after };
      });
  }

  private getChangeLabel(field: keyof EmployeeFormValue): string {
    const labels: Record<keyof EmployeeFormValue, string> = {
      codigo_empleado: 'Codigo de empleado',
      nombres: 'Nombres',
      apellidos: 'Apellidos',
      cedula: 'Cedula',
      telefono: 'Telefono',
      direccion: 'Direccion',
      fecha_nacimiento: 'Fecha de nacimiento',
      email: 'Email',
      fotografia: 'Fotografia',
      observaciones_personales: 'Observaciones personales',
      fecha_ingreso: 'Fecha de ingreso',
      cargo: 'Cargo',
      departamento: 'Departamento',
      sueldo: 'Sueldo',
      jornada_parcial: 'Jornada parcial',
      observaciones_laborales: 'Observaciones laborales',
      provincia_personal_id: 'Provincia personal',
      provincia_laboral_id: 'Provincia laboral',
      estado_codigo: 'Estado',
      estado_nombre: 'Etiqueta de estado',
    };

    return labels[field];
  }

  private formatChangeValue(
    field: keyof EmployeeFormValue,
    value: EmployeeFormValue[keyof EmployeeFormValue],
    provinces: Province[],
  ): string {
    if (value === null || value === undefined || value === '') {
      return 'Sin valor';
    }

    switch (field) {
      case 'provincia_personal_id':
      case 'provincia_laboral_id': {
        const province = provinces.find((item) => item.id === Number(value));
        return province?.nombre ?? 'Sin valor';
      }
      case 'estado_codigo':
        return Number(value) === 9 ? 'Retirado' : 'Vigente';
      case 'jornada_parcial':
        return value ? 'Parcial' : 'Completa';
      case 'fotografia':
        return this.formatPhotoValue(value);
      case 'sueldo':
        return new Intl.NumberFormat('es-EC', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }).format(Number(value));
      case 'observaciones_personales':
      case 'observaciones_laborales':
      case 'direccion': {
        const text = String(value).trim();
        return text.length > 52 ? `${text.slice(0, 49)}...` : text;
      }
      default:
        return String(value).trim() || 'Sin valor';
    }
  }

  private formatPhotoValue(value: EmployeeFormValue[keyof EmployeeFormValue]): string {
    const normalized = String(value ?? '').trim();

    if (normalized === '') {
      return 'Sin valor';
    }

    const fileName = normalized
      .replace(/^https?:\/\/[^/]+/i, '')
      .split('/')
      .filter(Boolean)
      .at(-1);

    return fileName ? `Imagen: ${fileName}` : 'Imagen cargada';
  }

  private normalizeCompareValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }

    return String(value).trim();
  }

  private createTemporaryPhotoPreview(file: File): string {
    this.clearTemporaryPhotoPreview();
    this.temporaryPhotoPreviewUrl = URL.createObjectURL(file);

    return this.temporaryPhotoPreviewUrl;
  }

  private clearTemporaryPhotoPreview(): void {
    if (this.temporaryPhotoPreviewUrl) {
      URL.revokeObjectURL(this.temporaryPhotoPreviewUrl);
      this.temporaryPhotoPreviewUrl = null;
    }
  }
}

interface EmployeeFormVm {
  mode: 'create' | 'edit';
  employeeId: number | null;
  provinces: Province[];
  sectionTitle: string;
  loadError: string | null;
}
