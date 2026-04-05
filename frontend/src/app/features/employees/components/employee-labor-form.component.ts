import { NgFor, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Province } from '../../provinces/models/province.model';
import {
  EmployeeFormField,
  EmployeeFormFieldErrors,
  hasEmployeeFieldSuccess,
  getEmployeeFieldErrorMessage,
} from '../forms/employee-form-errors';
import { EmployeeFieldFeedbackComponent } from './employee-field-feedback.component';

@Component({
  selector: 'app-employee-labor-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, EmployeeFieldFeedbackComponent],
  template: `
    <div class="row g-4" [formGroup]="form()">
      <div class="col-12">
        <p class="required-legend mb-0">
          <span class="required-mark">*</span> Campos obligatorios
        </p>
      </div>

      <div class="col-md-6">
        <label class="form-label">Fecha de ingreso <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('fecha_ingreso')" [class.is-valid]="hasSuccess('fecha_ingreso')" type="date" formControlName="fecha_ingreso" required [attr.min]="birthDateMin" [attr.max]="today" />
        <app-employee-field-feedback [field]="'fecha_ingreso'" [control]="form().get('fecha_ingreso')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Cargo <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('cargo')" [class.is-valid]="hasSuccess('cargo')" type="text" formControlName="cargo" required maxlength="100" minlength="2" autocomplete="organization-title" />
        <app-employee-field-feedback [field]="'cargo'" [control]="form().get('cargo')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Departamento <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('departamento')" [class.is-valid]="hasSuccess('departamento')" type="text" formControlName="departamento" required maxlength="100" minlength="2" autocomplete="organization" />
        <app-employee-field-feedback [field]="'departamento'" [control]="form().get('departamento')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Provincia laboral <span class="required-mark">*</span></label>
        <select class="form-select" [class.is-invalid]="hasError('provincia_laboral_id')" [class.is-valid]="hasSuccess('provincia_laboral_id')" formControlName="provincia_laboral_id" required>
          <option [ngValue]="null">Seleccione una provincia</option>
          <option *ngFor="let province of provinces()" [ngValue]="province.id">
            {{ province.nombre }}
          </option>
        </select>
        <app-employee-field-feedback [field]="'provincia_laboral_id'" [control]="form().get('provincia_laboral_id')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Codigo empleado <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('codigo_empleado')" [class.is-valid]="hasSuccess('codigo_empleado')" type="text" formControlName="codigo_empleado" title="Usa 5 caracteres" required maxlength="5" minlength="5" autocomplete="off" />
        <app-employee-field-feedback [field]="'codigo_empleado'" [control]="form().get('codigo_empleado')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Estado <span class="required-mark">*</span></label>
        <select class="form-select" [class.is-invalid]="hasError('estado_codigo')" [class.is-valid]="hasSuccess('estado_codigo')" formControlName="estado_codigo" (change)="syncStatusLabel()" required>
          <option [ngValue]="1">1 · Vigente</option>
          <option [ngValue]="9">9 · Retirado</option>
        </select>
        <app-employee-field-feedback [field]="'estado_codigo'" [control]="form().get('estado_codigo')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Sueldo <span class="required-mark">*</span></label>
        <div class="input-group">
          <input class="form-control" [class.is-invalid]="hasError('sueldo')" [class.is-valid]="hasSuccess('sueldo')" type="number" step="0.01" min="0.01" formControlName="sueldo" required />
          <span class="input-group-text">USD</span>
        </div>
        <app-employee-field-feedback [field]="'sueldo'" [control]="form().get('sueldo')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label d-block">Jornada parcial</label>
        <div class="d-flex gap-4 pt-2">
          <div class="form-check">
            <input
              id="jornada-si"
              class="form-check-input"
              type="radio"
              [value]="true"
              formControlName="jornada_parcial"
            />
            <label class="form-check-label" for="jornada-si">Si</label>
          </div>

          <div class="form-check">
            <input
              id="jornada-no"
              class="form-check-input"
              type="radio"
              [value]="false"
              formControlName="jornada_parcial"
            />
            <label class="form-check-label" for="jornada-no">No</label>
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
  `,
  styles: [`
    .observations {
      min-height: 112px;
      resize: vertical;
    }

    .required-legend {
      color: var(--muted);
      font-size: 0.88rem;
    }

    .required-mark {
      color: #c24f3d;
      font-weight: 700;
    }
  `],
})
export class EmployeeLaborFormComponent {
  readonly form = input.required<any>();
  readonly provinces = input<Province[]>([]);
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected syncStatusLabel(): void {
    const control = this.form().get('estado_codigo');
    const value = Number(control?.value ?? 1);

    this.form().patchValue({
      estado_nombre: value === 9 ? 'RETIRADO' : 'VIGENTE',
    });
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
