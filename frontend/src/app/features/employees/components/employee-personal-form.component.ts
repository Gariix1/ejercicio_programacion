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
  selector: 'app-employee-personal-form',
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
        <label class="form-label">Nombres <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('nombres')" [class.is-valid]="hasSuccess('nombres')" type="text" formControlName="nombres" required maxlength="100" minlength="2" autocomplete="given-name" />
        <app-employee-field-feedback [field]="'nombres'" [control]="form().get('nombres')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Apellidos <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('apellidos')" [class.is-valid]="hasSuccess('apellidos')" type="text" formControlName="apellidos" required maxlength="100" minlength="2" autocomplete="family-name" />
        <app-employee-field-feedback [field]="'apellidos'" [control]="form().get('apellidos')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Cedula <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('cedula')" [class.is-valid]="hasSuccess('cedula')" type="text" formControlName="cedula" title="Debe tener 10 digitos" required maxlength="10" minlength="10" inputmode="numeric" autocomplete="off" />
        <app-employee-field-feedback [field]="'cedula'" [control]="form().get('cedula')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Provincia <span class="required-mark">*</span></label>
        <select class="form-select" [class.is-invalid]="hasError('provincia_personal_id')" [class.is-valid]="hasSuccess('provincia_personal_id')" formControlName="provincia_personal_id" required>
          <option [ngValue]="null">Seleccione una provincia</option>
          <option *ngFor="let province of provinces()" [ngValue]="province.id">
            {{ province.nombre }}
          </option>
        </select>
        <app-employee-field-feedback [field]="'provincia_personal_id'" [control]="form().get('provincia_personal_id')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Fecha de nacimiento <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('fecha_nacimiento')" [class.is-valid]="hasSuccess('fecha_nacimiento')" type="date" formControlName="fecha_nacimiento" required [attr.max]="today" />
        <app-employee-field-feedback [field]="'fecha_nacimiento'" [control]="form().get('fecha_nacimiento')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Email <span class="required-mark">*</span></label>
        <input class="form-control" [class.is-invalid]="hasError('email')" [class.is-valid]="hasSuccess('email')" type="email" formControlName="email" title="Ejemplo: nombre@dominio.com" required maxlength="150" autocomplete="email" />
        <app-employee-field-feedback [field]="'email'" [control]="form().get('email')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Telefono</label>
        <input class="form-control" [class.is-invalid]="hasError('telefono')" [class.is-valid]="hasSuccess('telefono')" type="text" formControlName="telefono" maxlength="15" inputmode="numeric" autocomplete="tel" />
        <app-employee-field-feedback [field]="'telefono'" [control]="form().get('telefono')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-6">
        <label class="form-label">Direccion</label>
        <input class="form-control" [class.is-invalid]="hasError('direccion')" [class.is-valid]="hasSuccess('direccion')" type="text" formControlName="direccion" maxlength="255" autocomplete="street-address" />
        <app-employee-field-feedback [field]="'direccion'" [control]="form().get('direccion')" [fieldErrors]="fieldErrors()"></app-employee-field-feedback>
      </div>

      <div class="col-md-8">
        <label class="form-label">Observaciones</label>
        <textarea
          class="form-control observations"
          rows="4"
          formControlName="observaciones_personales"
          placeholder="Comentario u observacion referente a la ficha personal"
        ></textarea>
      </div>

      <div class="col-md-4">
        <label class="form-label">Fotografia</label>
        <div class="photo-card">
          <div class="photo-preview" [class.has-image]="!!form().get('fotografia')?.value">
            <span *ngIf="!form().get('fotografia')?.value">Sin imagen</span>
            <img
              *ngIf="form().get('fotografia')?.value"
              [src]="form().get('fotografia')?.value"
              alt="Previsualizacion de fotografia"
            />
          </div>

          <button class="btn btn-primary" type="button" disabled>
            Cargar imagen
          </button>

          <small class="text-muted">La carga real de archivos se conectara despues.</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .photo-card {
      display: grid;
      gap: 12px;
      justify-items: center;
      align-content: start;
    }

    .photo-preview {
      display: grid;
      place-items: center;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--surface-alt);
      color: var(--muted);
      text-align: center;
      font-size: 0.82rem;
    }

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

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `],
})
export class EmployeePersonalFormComponent {
  readonly form = input.required<any>();
  readonly provinces = input<Province[]>([]);
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected errorFor(field: EmployeeFormField): string | null {
    return getEmployeeFieldErrorMessage(field, this.form().get(field), this.fieldErrors());
  }

  protected hasError(field: EmployeeFormField): boolean {
    return this.errorFor(field) !== null;
  }

  protected hasSuccess(field: EmployeeFormField): boolean {
    return hasEmployeeFieldSuccess(field, this.form().get(field), this.fieldErrors());
  }
}
