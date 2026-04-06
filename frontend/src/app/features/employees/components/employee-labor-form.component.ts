import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Province } from '../../provinces/models/province.model';
import { EmployeeFormGroup } from '../forms/employee-form';
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
    <div class="app-form-layout" [formGroup]="form()">
      <section class="app-form-section app-form-section--lead">
        <div class="app-form-heading">
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
              <div class="app-control-shell app-control-shell--date" (click)="openDatePicker(entryDateInput)">
                <input #entryDateInput class="form-control form-control--date" [class.is-invalid]="hasError('fecha_ingreso')" [class.is-valid]="hasSuccess('fecha_ingreso')" type="date" formControlName="fecha_ingreso" required [attr.min]="birthDateMin" [attr.max]="today" />
                <span class="app-control-divider" aria-hidden="true"></span>
                <span class="app-control-indicator app-control-indicator--date" aria-hidden="true"></span>
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
              <div class="app-control-shell app-control-shell--select">
                <select class="form-select" [class.is-invalid]="hasError('provincia_laboral_id')" [class.is-valid]="hasSuccess('provincia_laboral_id')" formControlName="provincia_laboral_id" required>
                  <option [ngValue]="null">Seleccione una provincia</option>
                  <option *ngFor="let province of provinces()" [ngValue]="province.id">
                    {{ province.nombre }}
                  </option>
                </select>
                <span class="app-control-divider" aria-hidden="true"></span>
                <span class="app-control-indicator app-control-indicator--select" aria-hidden="true"></span>
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
                class="app-state-card"
                [class.app-state-card--positive]="isCurrentStatusActive()"
                [class.app-state-card--warning]="!isCurrentStatusActive()"
                [class.app-state-card--invalid]="hasError('estado_codigo')"
              >
                <div class="app-state-card-copy">
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

      <section class="app-form-section app-form-section--soft">
        <div class="app-form-heading">
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
            <div class="app-support-card radio-card">
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
    .observations {
      min-height: 140px;
      resize: vertical;
    }

    .radio-card {
      gap: 10px;
      min-height: 100%;
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

    @media (max-width: 640px) {
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

  protected isCurrentStatusActive(): boolean {
    return Number(this.form().controls.estado_codigo.value ?? 1) !== 9;
  }

  protected onStatusToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const control = this.form().controls.estado_codigo;

    control.setValue(checked ? 1 : 9);
    control.markAsDirty();
    control.markAsTouched();
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
