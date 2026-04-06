import { NgFor, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Province } from '../../provinces/models/province.model';
import { EmployeeFormGroup } from '../forms/employee-form';
import { EmployeeFormField, EmployeeFormFieldErrors, hasEmployeeFieldSuccess, getEmployeeFieldErrorMessage } from '../forms/employee-form-errors';
import { EmployeeFormFieldComponent } from './employee-form-field.component';
import { UiButtonComponent } from '../../../shared/ui-button.component';

@Component({
  selector: 'app-employee-personal-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, EmployeeFormFieldComponent, UiButtonComponent],
  template: `
    <div class="form-layout" [formGroup]="form()">
      <div class="required-legend">
        <span class="required-mark">*</span>
        <span>Campos obligatorios para habilitar la ficha laboral</span>
      </div>

      <section class="section-block">
        <div class="section-heading">
          <h3>Identidad y contacto</h3>
          <p>Datos principales para identificar y contactar al empleado dentro del sistema.</p>
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <app-employee-form-field
              label="Nombres"
              field="nombres"
              [required]="true"
              [control]="form().controls.nombres"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('nombres')" [class.is-valid]="hasSuccess('nombres')" type="text" formControlName="nombres" required maxlength="100" minlength="2" autocomplete="given-name" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Apellidos"
              field="apellidos"
              [required]="true"
              [control]="form().controls.apellidos"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('apellidos')" [class.is-valid]="hasSuccess('apellidos')" type="text" formControlName="apellidos" required maxlength="100" minlength="2" autocomplete="family-name" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Cedula"
              field="cedula"
              [required]="true"
              [control]="form().controls.cedula"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('cedula')" [class.is-valid]="hasSuccess('cedula')" type="text" formControlName="cedula" title="Debe tener 10 digitos" required maxlength="10" minlength="10" inputmode="numeric" autocomplete="off" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Provincia"
              field="provincia_personal_id"
              [required]="true"
              [control]="form().controls.provincia_personal_id"
              [fieldErrors]="fieldErrors()"
            >
              <div class="control-shell control-shell--select">
                <select class="form-select" [class.is-invalid]="hasError('provincia_personal_id')" [class.is-valid]="hasSuccess('provincia_personal_id')" formControlName="provincia_personal_id" required>
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
              label="Fecha de nacimiento"
              field="fecha_nacimiento"
              [required]="true"
              [control]="form().controls.fecha_nacimiento"
              [fieldErrors]="fieldErrors()"
            >
              <div class="control-shell control-shell--date" (click)="openDatePicker(birthDateInput)">
                <input #birthDateInput class="form-control form-control--date" [class.is-invalid]="hasError('fecha_nacimiento')" [class.is-valid]="hasSuccess('fecha_nacimiento')" type="date" formControlName="fecha_nacimiento" required [attr.max]="today" />
                <span class="control-divider" aria-hidden="true"></span>
                <span class="control-indicator control-indicator--date" aria-hidden="true"></span>
              </div>
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Email"
              field="email"
              [required]="true"
              [control]="form().controls.email"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('email')" [class.is-valid]="hasSuccess('email')" type="email" formControlName="email" title="Ejemplo: nombre@dominio.com" required maxlength="150" autocomplete="email" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Telefono"
              field="telefono"
              [control]="form().controls.telefono"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('telefono')" [class.is-valid]="hasSuccess('telefono')" type="text" formControlName="telefono" maxlength="15" inputmode="numeric" autocomplete="tel" />
            </app-employee-form-field>
          </div>

          <div class="col-md-6">
            <app-employee-form-field
              label="Direccion"
              field="direccion"
              [control]="form().controls.direccion"
              [fieldErrors]="fieldErrors()"
            >
              <input class="form-control" [class.is-invalid]="hasError('direccion')" [class.is-valid]="hasSuccess('direccion')" type="text" formControlName="direccion" maxlength="255" autocomplete="street-address" />
            </app-employee-form-field>
          </div>
        </div>
      </section>

      <section class="section-block section-block--soft">
        <div class="section-heading">
          <h3>Notas y fotografia</h3>
          <p>Informacion de apoyo para la ficha personal y referencia visual del empleado.</p>
        </div>

        <div class="row g-4 align-items-start">
          <div class="col-lg-7">
            <label class="form-label">Observaciones</label>
            <textarea
              class="form-control observations"
              rows="4"
              formControlName="observaciones_personales"
              placeholder="Comentario u observacion referente a la ficha personal"
            ></textarea>
          </div>

          <div class="col-lg-5">
            <div class="photo-card">
              <div class="photo-copy">
                <label class="form-label mb-0">Fotografia</label>
                <small class="text-muted">La carga real de archivos se conectara despues.</small>
              </div>

              <div class="photo-preview" [class.has-image]="!!form().get('fotografia')?.value">
                <span *ngIf="!form().get('fotografia')?.value">Sin imagen</span>
                <img
                  *ngIf="form().get('fotografia')?.value"
                  [src]="form().get('fotografia')?.value"
                  alt="Previsualizacion de fotografia"
                />
              </div>

              <app-ui-button class="w-100" variant="outline-primary" [disabled]="true">
                Cargar imagen
              </app-ui-button>
            </div>
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

    .photo-card {
      display: grid;
      gap: 14px;
      align-content: start;
      padding: 16px;
      border: 1px dashed rgba(103, 86, 67, 0.18);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.72);
      transition:
        border-color 180ms ease,
        background-color 180ms ease,
        transform 180ms ease,
        box-shadow 180ms ease;
    }

    .photo-card:hover {
      border-color: rgba(49, 119, 165, 0.22);
      background: rgba(255, 255, 255, 0.78);
      box-shadow: 0 10px 20px rgba(49, 119, 165, 0.05);
    }

    .photo-preview {
      display: grid;
      place-items: center;
      width: 132px;
      height: 132px;
      border-radius: 50%;
      overflow: hidden;
      border: 1px solid var(--border);
      background: var(--surface-alt);
      color: var(--muted);
      text-align: center;
      font-size: 0.82rem;
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        border-color 180ms ease;
    }

    .photo-card:hover .photo-preview {
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(73, 44, 24, 0.06);
      border-color: rgba(49, 119, 165, 0.22);
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

    .photo-copy {
      display: grid;
      gap: 4px;
    }

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

    :host ::ng-deep .control-shell > .form-control,
    :host ::ng-deep .control-shell > .form-select {
      display: block;
      width: 100%;
      max-width: none;
      box-sizing: border-box;
    }

    :host ::ng-deep .form-control::placeholder {
      color: rgba(95, 86, 77, 0.62);
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

      .photo-card {
        justify-items: center;
        text-align: center;
      }
    }
  `],
})
export class EmployeePersonalFormComponent {
  readonly form = input.required<EmployeeFormGroup>();
  readonly provinces = input<Province[]>([]);
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected openDatePicker(input: HTMLInputElement): void {
    input.focus();
    (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
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
}
