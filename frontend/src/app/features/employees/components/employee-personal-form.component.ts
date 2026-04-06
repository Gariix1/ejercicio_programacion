import { NgFor, NgIf } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { API_BASE_URL } from '../../../core/api.config';
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
    <div class="app-form-layout" [formGroup]="form()">
      <section class="app-form-section app-form-section--lead">
        <div class="app-form-heading">
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
              <div class="app-control-shell app-control-shell--select">
                <select class="form-select" [class.is-invalid]="hasError('provincia_personal_id')" [class.is-valid]="hasSuccess('provincia_personal_id')" formControlName="provincia_personal_id" required>
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
              label="Fecha de nacimiento"
              field="fecha_nacimiento"
              [required]="true"
              [control]="form().controls.fecha_nacimiento"
              [fieldErrors]="fieldErrors()"
            >
              <div class="app-control-shell app-control-shell--date" (click)="openDatePicker(birthDateInput)">
                <input #birthDateInput class="form-control form-control--date" [class.is-invalid]="hasError('fecha_nacimiento')" [class.is-valid]="hasSuccess('fecha_nacimiento')" type="date" formControlName="fecha_nacimiento" required [attr.max]="today" />
                <span class="app-control-divider" aria-hidden="true"></span>
                <span class="app-control-indicator app-control-indicator--date" aria-hidden="true"></span>
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

      <section class="app-form-section app-form-section--soft">
        <div class="app-form-heading">
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
              <div class="app-support-card photo-card">
              <div class="app-support-card-copy">
                <label class="form-label mb-0">Fotografia</label>
                <small class="text-muted">Sube una imagen JPG, PNG o WEBP de hasta 6 MB.</small>
              </div>

              <div class="photo-preview" [class.has-image]="!!photoPreviewUrl()">
                <span *ngIf="!photoPreviewUrl()">Sin imagen</span>
                <img
                  *ngIf="photoPreviewUrl()"
                  [src]="photoPreviewUrl()!"
                  alt="Previsualizacion de fotografia"
                />
              </div>

              <input
                #photoInput
                class="d-none"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                (change)="onPhotoInputChange($event)"
              />

              <app-ui-button
                class="w-100"
                variant="outline-primary"
                [disabled]="photoUploading()"
                (click)="photoInput.click()"
              >
                <span
                  *ngIf="photoUploading()"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {{ photoUploading() ? 'Subiendo imagen...' : 'Cargar imagen' }}
              </app-ui-button>

              <small class="photo-error" *ngIf="photoError()">{{ photoError() }}</small>
            </div>
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

    .photo-card {
      gap: 14px;
      align-content: start;
    }

    .photo-preview {
      display: grid;
      place-items: center;
      width: 156px;
      height: 156px;
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

    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }

    .photo-error {
      color: #b53838;
      font-size: 0.84rem;
      line-height: 1.45;
      text-align: center;
    }

    @media (max-width: 640px) {
      .photo-card {
        justify-items: center;
        text-align: center;
      }
    }
  `],
})
export class EmployeePersonalFormComponent {
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly backendBaseUrl = this.apiBaseUrl.replace(/\/api\/?$/, '');

  readonly form = input.required<EmployeeFormGroup>();
  readonly provinces = input<Province[]>([]);
  readonly fieldErrors = input<EmployeeFormFieldErrors>({});
  readonly photoPreviewSrc = input<string | null>(null);
  readonly photoUploading = input(false);
  readonly photoError = input<string | null>(null);
  readonly photoSelected = output<File>();
  protected readonly today = new Date().toISOString().slice(0, 10);

  protected openDatePicker(input: HTMLInputElement): void {
    input.focus();
    (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
  }

  protected onPhotoInputChange(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];

    if (!file) {
      return;
    }

    this.photoSelected.emit(file);
    input.value = '';
  }

  protected photoPreviewUrl(): string | null {
    return this.photoPreviewSrc() || this.resolvePhotoUrl(this.form().controls.fotografia.value);
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

  private resolvePhotoUrl(value: string | null | undefined): string | null {
    const normalized = String(value ?? '').trim();

    if (normalized === '') {
      return null;
    }

    if (/^(https?:|data:|blob:)/i.test(normalized)) {
      return normalized;
    }

    if (normalized.startsWith('/uploads/')) {
      return `${this.backendBaseUrl}${normalized}`;
    }

    if (normalized.startsWith('uploads/')) {
      return `${this.backendBaseUrl}/${normalized}`;
    }

    return `${this.backendBaseUrl}/uploads/${normalized.replace(/^\/+/, '')}`;
  }
}
