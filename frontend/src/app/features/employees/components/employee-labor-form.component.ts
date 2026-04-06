import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Province } from '../../provinces/models/province.model';
import { EmployeeFormGroup, syncEmployeeStatusLabel } from '../forms/employee-form';
import {
  EmployeeFormField,
  EmployeeFormFieldErrors,
  hasEmployeeFieldSuccess,
  getEmployeeFieldErrorMessage,
} from '../forms/employee-form-errors';
import { EmployeeFormFieldComponent } from './employee-form-field.component';

@Component({
  selector: 'app-employee-labor-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, EmployeeFormFieldComponent],
  template: `
    <div class="form-layout" [formGroup]="form()">
      <div class="required-legend">
        <span class="required-mark">*</span>
        <span>Campos obligatorios para guardar o actualizar la ficha del empleado</span>
      </div>

      <section class="section-block">
        <div class="section-heading">
          <h3>Asignacion laboral</h3>
          <p>Define la ubicacion, el rol y el estado actual del empleado dentro de la organizacion.</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <app-employee-form-field
              label="Fecha de ingreso"
              field="fecha_ingreso"
              [required]="true"
              [control]="form().controls.fecha_ingreso"
              [fieldErrors]="fieldErrors()"
            >
              <div class="control-shell control-shell--date" (click)="openDatePicker(entryDateInput)">
                <input #entryDateInput class="form-control form-control--date" [class.is-invalid]="hasError('fecha_ingreso')" [class.is-valid]="hasSuccess('fecha_ingreso')" type="date" formControlName="fecha_ingreso" required [attr.min]="birthDateMin" [attr.max]="today" />
                <span class="control-divider" aria-hidden="true"></span>
                <span class="control-indicator control-indicator--date" aria-hidden="true"></span>
              </div>
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Codigo empleado"
              field="codigo_empleado"
              [required]="true"
              [control]="form().controls.codigo_empleado"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('codigo_empleado')" [class.is-valid]="hasSuccess('codigo_empleado')" type="text" formControlName="codigo_empleado" title="Usa 5 caracteres" required maxlength="5" minlength="5" autocomplete="off" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Cargo"
              field="cargo"
              [required]="true"
              [control]="form().controls.cargo"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('cargo')" [class.is-valid]="hasSuccess('cargo')" type="text" formControlName="cargo" required maxlength="100" minlength="2" autocomplete="organization-title" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Departamento"
              field="departamento"
              [required]="true"
              [control]="form().controls.departamento"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('departamento')" [class.is-valid]="hasSuccess('departamento')" type="text" formControlName="departamento" required maxlength="100" minlength="2" autocomplete="organization" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Provincia laboral"
              field="provincia_laboral_id"
              [required]="true"
              [control]="form().controls.provincia_laboral_id"
              [fieldErrors]="fieldErrors()"
            >
              <div class="control-shell control-shell--select">
                <select class="form-select" [class.is-invalid]="hasError('provincia_laboral_id')" [class.is-valid]="hasSuccess('provincia_laboral_id')" formControlName="provincia_laboral_id" required>
                  <option [ngValue]="null">Seleccione una provincia</option>
                  <option *ngFor="let province of provinces()" [ngValue]="province.id">
                    {{ province.nombre }}
                  </option>
                </select>
                <span class="control-divider" aria-hidden="true"></span>
                <span class="control-indicator control-indicator--select" aria-hidden="true"></span>
              </div>
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Estado"
              field="estado_codigo"
              [required]="true"
              [control]="form().controls.estado_codigo"
              [fieldErrors]="fieldErrors()"
            >
              <div
                class="status-switch-card"
                [class.status-switch-card--inactive]="!isCurrentStatusActive()"
                [class.status-switch-card--invalid]="hasError('estado_codigo')"
              >
                <div class="status-switch-copy">
                  <strong>{{ isCurrentStatusActive() ? 'Vigente' : 'Retirado' }}</strong>
                  <span>
                    {{
                      isCurrentStatusActive()
                        ? 'El empleado se muestra como activo en el catalogo.'
                        : 'El empleado queda marcado como no vigente dentro del catalogo.'
                    }}
                  </span>
                </div>

                <div class="status-switch-control">
                  <label class="ios-switch" for="employee-status-switch">
                    <input
                      id="employee-status-switch"
                      class="ios-switch-input"
                      type="checkbox"
                      role="switch"
                      [checked]="isCurrentStatusActive()"
                      (change)="onStatusToggle($event)"
                      [attr.aria-label]="isCurrentStatusActive() ? 'Cambiar a retirado' : 'Cambiar a vigente'"
                    />
                    <span class="ios-switch-track" aria-hidden="true"></span>
                  </label>
                </div>
              </div>
            </app-employee-form-field>
          </div>
        </div>
      </section>

      <section class="section-block section-block--soft">
        <div class="section-heading">
          <h3>Condiciones y observaciones</h3>
          <p>Completa la informacion economica y deja notas internas para el seguimiento del empleado.</p>
        </div>

        <div class="row g-4 align-items-start">
          <div class="col-lg-6">
            <app-employee-form-field
              label="Sueldo"
              field="sueldo"
              [required]="true"
              [control]="form().controls.sueldo"
              [fieldErrors]="fieldErrors()"
            >
              <div class="input-group">
                <input class="form-control" [class.is-invalid]="hasError('sueldo')" [class.is-valid]="hasSuccess('sueldo')" type="number" step="0.01" min="0.01" formControlName="sueldo" required />
                <span class="input-group-text">USD</span>
              </div>
            </app-employee-form-field>
          </div>

          <div class="col-lg-6">
            <div class="radio-card">
              <label class="form-label d-block mb-2">Jornada parcial</label>
              <div class="radio-options">
                <label class="radio-option">
                  <input
                    id="jornada-si"
                    class="form-check-input"
                    type="radio"
                    [value]="true"
                    formControlName="jornada_parcial"
                  />
                  <span>Si</span>
                </label>

                <label class="radio-option">
                  <input
                    id="jornada-no"
                    class="form-check-input"
                    type="radio"
                    [value]="false"
                    formControlName="jornada_parcial"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          </div>

          <div class="col-12">
            <label class="form-label">Observaciones laborales</label>
            <textarea
              class="form-control observations"
              rows="4"
              formControlName="observaciones_laborales"
              placeholder="Comentario u observacion referente a la ficha laboral"
            ></textarea>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .form-layout {
      display: grid;
      gap: 18px;
    }

    .section-block {
      display: grid;
      gap: 18px;
      padding: 18px;
      border: 1px solid rgba(103, 86, 67, 0.14);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.74);
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease,
        background-color 180ms ease;
    }

    .section-block--soft {
      background: linear-gradient(180deg, rgba(255, 250, 244, 0.74) 0%, rgba(255, 255, 255, 0.72) 100%);
    }

    .section-block:hover {
      border-color: rgba(103, 86, 67, 0.18);
      box-shadow: 0 10px 20px rgba(73, 44, 24, 0.04);
    }

    .section-heading {
      display: grid;
      gap: 4px;
    }

    .section-heading h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    .section-heading p {
      margin: 0;
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.45;
    }

    .observations {
      min-height: 140px;
      resize: vertical;
    }

    .required-legend {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font-size: 0.88rem;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(197, 228, 247, 0.38);
      border: 1px solid rgba(49, 119, 165, 0.12);
    }

    .required-mark {
      color: #c24f3d;
      font-weight: 700;
    }

    .control-shell {
      --control-affordance-space: 3.45rem;
      position: relative;
      display: block;
      width: 100%;
      min-width: 0;
    }

    .control-divider {
      position: absolute;
      top: 9px;
      bottom: 9px;
      right: 1.85rem;
      width: 1px;
      background: rgba(103, 86, 67, 0.12);
      pointer-events: none;
      z-index: 2;
      transition:
        background-color 180ms ease,
        transform 160ms ease;
    }

    .control-indicator {
      position: absolute;
      top: 50%;
      right: 0.58rem;
      width: 12px;
      height: 12px;
      transform: translateY(-50%);
      pointer-events: none;
      z-index: 2;
      opacity: 0.72;
      transition:
        opacity 180ms ease,
        transform 160ms ease;
    }

    .control-indicator--select::before {
      content: '';
      position: absolute;
      inset: 1px 0 0 1px;
      border-right: 2px solid rgba(37, 92, 128, 0.82);
      border-bottom: 2px solid rgba(37, 92, 128, 0.82);
      transform: rotate(45deg);
      border-radius: 1px;
    }

    .control-indicator--date::before {
      content: '';
      position: absolute;
      inset: 1px;
      border: 1.8px solid rgba(37, 92, 128, 0.78);
      border-radius: 3px;
      box-sizing: border-box;
    }

    .control-indicator--date::after {
      content: '';
      position: absolute;
      left: 2px;
      right: 2px;
      top: 2px;
      height: 3px;
      border-radius: 2px 2px 1px 1px;
      background: rgba(37, 92, 128, 0.78);
      box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.35);
    }

    .control-shell:hover .control-divider {
      background: rgba(49, 119, 165, 0.18);
      transform: translateY(-1px);
    }

    .control-shell:hover .control-indicator {
      opacity: 0.9;
      transform: translateY(calc(-50% - 1px));
    }

    .radio-card {
      display: grid;
      gap: 10px;
      padding: 14px 16px;
      min-height: 100%;
      border: 1px dashed rgba(103, 86, 67, 0.18);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.7);
      transition:
        border-color 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease;
    }

    .radio-card:hover {
      border-color: rgba(49, 119, 165, 0.22);
      box-shadow: 0 10px 18px rgba(49, 119, 165, 0.05);
    }

    .status-switch-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 12px 14px;
      min-height: 62px;
      border: 1px solid rgba(57, 134, 83, 0.2);
      border-radius: 16px;
      background: linear-gradient(180deg, rgba(240, 250, 243, 0.92) 0%, rgba(255, 255, 255, 0.9) 100%);
      transition:
        transform 180ms ease,
        border-color 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease;
    }

    .status-switch-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(73, 44, 24, 0.05);
    }

    .status-switch-card--inactive {
      border-color: rgba(166, 111, 63, 0.24);
      background: linear-gradient(180deg, rgba(255, 248, 242, 0.92) 0%, rgba(255, 255, 255, 0.9) 100%);
    }

    .status-switch-card--invalid {
      border-color: rgba(181, 56, 56, 0.34);
      box-shadow: 0 0 0 0.16rem rgba(181, 56, 56, 0.08);
    }

    .status-switch-copy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .status-switch-copy strong {
      color: var(--text-strong);
      font-size: 0.93rem;
      line-height: 1.1;
    }

    .status-switch-copy span {
      color: var(--muted);
      font-size: 0.82rem;
      line-height: 1.4;
    }

    .status-switch-control {
      margin: 0;
      flex: 0 0 auto;
    }

    .ios-switch {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 3.35rem;
      height: 2rem;
      margin: 0;
      cursor: pointer;
    }

    .ios-switch-input {
      position: absolute;
      inset: 0;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }

    .ios-switch-track {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 999px;
      background: rgba(120, 120, 128, 0.2);
      border: 1px solid rgba(103, 86, 67, 0.12);
      box-shadow:
        inset 0 1px 2px rgba(73, 44, 24, 0.06),
        0 3px 8px rgba(73, 44, 24, 0.04);
      transition:
        transform 180ms ease,
        background-color 180ms ease,
        border-color 180ms ease,
        box-shadow 180ms ease;
    }

    .ios-switch-track::before {
      content: '';
      position: absolute;
      top: 1px;
      left: 1px;
      width: calc(2rem - 4px);
      height: calc(2rem - 4px);
      border-radius: 50%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 246, 246, 0.94) 100%);
      box-shadow:
        0 2px 6px rgba(0, 0, 0, 0.16),
        0 1px 2px rgba(0, 0, 0, 0.08);
      transition:
        transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
        box-shadow 180ms ease;
    }

    .ios-switch:hover .ios-switch-track {
      transform: translateY(-1px);
      box-shadow:
        inset 0 1px 2px rgba(73, 44, 24, 0.06),
        0 6px 14px rgba(73, 44, 24, 0.08);
    }

    .ios-switch-input:focus-visible + .ios-switch-track {
      box-shadow:
        0 0 0 0.2rem rgba(49, 119, 165, 0.14),
        inset 0 1px 2px rgba(73, 44, 24, 0.05);
    }

    .ios-switch-input:checked + .ios-switch-track {
      background: linear-gradient(180deg, #34c759 0%, #2eb650 100%);
      border-color: rgba(47, 129, 80, 0.68);
    }

    .ios-switch-input:checked + .ios-switch-track::before {
      transform: translateX(1.35rem);
    }

    .ios-switch-input:active + .ios-switch-track::before {
      box-shadow:
        0 1px 4px rgba(0, 0, 0, 0.18),
        0 1px 2px rgba(0, 0, 0, 0.08);
    }

    .radio-options {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .radio-option {
      position: relative;
      display: flex;
      align-items: center;
      margin: 0;
      cursor: pointer;
    }

    .radio-option .form-check-input {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }

    .radio-option span {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 48px;
      padding: 0 14px;
      border-radius: 14px;
      border: 1px solid rgba(103, 86, 67, 0.14);
      background: rgba(255, 250, 244, 0.82);
      color: var(--text-strong);
      font-weight: 600;
      transition:
        transform 160ms ease,
        border-color 180ms ease,
        background-color 180ms ease,
        box-shadow 180ms ease,
        color 180ms ease;
    }

    .radio-option span::before {
      content: '';
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: rgba(103, 86, 67, 0.14);
      box-shadow: 0 0 0 5px rgba(103, 86, 67, 0.08);
      transition:
        background-color 180ms ease,
        box-shadow 180ms ease,
        transform 180ms ease;
    }

    .radio-option:hover span {
      transform: translateY(-1px);
      border-color: rgba(49, 119, 165, 0.24);
      background: rgba(197, 228, 247, 0.34);
      box-shadow: 0 8px 14px rgba(49, 119, 165, 0.04);
    }

    .radio-option .form-check-input:focus-visible + span {
      box-shadow:
        0 0 0 0.18rem rgba(49, 119, 165, 0.12),
        0 8px 14px rgba(49, 119, 165, 0.04);
    }

    .radio-option .form-check-input:checked + span {
      border-color: rgba(49, 119, 165, 0.34);
      background: rgba(197, 228, 247, 0.48);
      color: #255c80;
      box-shadow: 0 10px 18px rgba(49, 119, 165, 0.06);
    }

    .radio-option .form-check-input:checked + span::before {
      background: #3177a5;
      box-shadow: 0 0 0 5px rgba(49, 119, 165, 0.16);
      transform: scale(1.05);
    }

    :host ::ng-deep .form-control,
    :host ::ng-deep .form-select,
    :host ::ng-deep .input-group-text {
      min-height: 48px;
      padding: 0.72rem 0.95rem;
      border-radius: 14px;
      border-color: rgba(103, 86, 67, 0.16);
      background: rgba(255, 255, 255, 0.94);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.72),
        0 1px 2px rgba(73, 44, 24, 0.03);
      transition:
        border-color 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease,
        transform 160ms ease,
        filter 160ms ease;
    }

    :host ::ng-deep .form-control::placeholder {
      color: rgba(95, 86, 77, 0.62);
    }

    :host ::ng-deep .control-shell > .form-control,
    :host ::ng-deep .control-shell > .form-select {
      display: block;
      width: 100%;
      max-width: none;
      box-sizing: border-box;
    }

    :host ::ng-deep .form-select {
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      cursor: pointer;
      padding-right: var(--control-affordance-space);
      background-image: none;
    }

    :host ::ng-deep .control-shell--date .form-control {
      cursor: pointer;
      padding-right: var(--control-affordance-space);
      background-image: none;
    }

    :host ::ng-deep .form-control--date::-webkit-calendar-picker-indicator {
      position: absolute;
      top: 0;
      right: 0;
      width: 3.4rem;
      height: 100%;
      margin: 0;
      padding: 0;
      opacity: 0;
      cursor: pointer;
    }

    :host ::ng-deep textarea.form-control {
      padding-top: 0.82rem;
      padding-bottom: 0.82rem;
    }

    :host ::ng-deep .form-control:hover,
    :host ::ng-deep .form-select:hover,
    :host ::ng-deep .input-group:hover .form-control,
    :host ::ng-deep .input-group:hover .input-group-text {
      border-color: rgba(49, 119, 165, 0.24);
      background: rgba(255, 255, 255, 0.98);
      filter: saturate(1.01);
    }

    :host ::ng-deep .form-control:focus,
    :host ::ng-deep .form-select:focus {
      transform: translateY(-1px);
      border-color: rgba(49, 119, 165, 0.34);
      background: rgba(255, 255, 255, 0.99);
      box-shadow:
        0 0 0 0.18rem rgba(49, 119, 165, 0.12),
        0 10px 20px rgba(49, 119, 165, 0.05);
    }

    :host ::ng-deep .input-group .form-control:focus + .input-group-text {
      border-color: rgba(49, 119, 165, 0.34);
      background: rgba(240, 248, 252, 0.94);
    }

    :host ::ng-deep .form-control.is-valid,
    :host ::ng-deep .form-select.is-valid {
      border-color: rgba(57, 134, 83, 0.34);
      padding-right: var(--control-affordance-space);
      background-image: none;
      box-shadow:
        0 0 0 0.14rem rgba(57, 134, 83, 0.08),
        0 6px 14px rgba(57, 134, 83, 0.04);
    }

    :host ::ng-deep .form-control.is-invalid,
    :host ::ng-deep .form-select.is-invalid {
      border-color: rgba(181, 56, 56, 0.38);
      padding-right: var(--control-affordance-space);
      background-image: none;
      box-shadow:
        0 0 0 0.14rem rgba(181, 56, 56, 0.08),
        0 6px 14px rgba(181, 56, 56, 0.04);
    }

    :host ::ng-deep .form-select:focus + .control-divider,
    :host ::ng-deep .form-control--date:focus + .control-divider {
      background: rgba(49, 119, 165, 0.24);
    }

    :host ::ng-deep .form-select:focus ~ .control-indicator,
    :host ::ng-deep .form-control--date:focus ~ .control-indicator {
      opacity: 0.96;
    }

    @media (max-width: 640px) {
      .section-block {
        padding: 16px;
      }

      .status-switch-card {
        align-items: flex-start;
      }

      .radio-options {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class EmployeeLaborFormComponent {
  readonly form = input.required<EmployeeFormGroup>();
  readonly provinces = input<Province[]>([]);
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected openDatePicker(input: HTMLInputElement): void {
    input.focus();
    (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
  }

  protected syncStatusLabel(): void {
    syncEmployeeStatusLabel(this.form());
  }

  protected isCurrentStatusActive(): boolean {
    return Number(this.form().controls.estado_codigo.value ?? 1) !== 9;
  }

  protected onStatusToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const control = this.form().controls.estado_codigo;

    control.setValue(checked ? 1 : 9);
    control.markAsDirty();
    control.markAsTouched();
    this.syncStatusLabel();
  }

  protected errorFor(field: EmployeeFormField): string | null {
    return getEmployeeFieldErrorMessage(field, this.form().get(field), this.fieldErrors());
  }

  protected hasError(field: EmployeeFormField): boolean {
    return this.errorFor(field) !== null;
  }

  protected hasSuccess(field: EmployeeFormField): boolean {
    return hasEmployeeFieldSuccess(field, this.form().get(field), this.fieldErrors());
  }

  protected get birthDateMin(): string | null {
    return this.form().get('fecha_nacimiento')?.value || null;
  }
}
