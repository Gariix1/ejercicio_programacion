import { NgFor, NgIf } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Province } from '../../provinces/models/province.model';

@Component({
  selector: 'app-employee-personal-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule],
  template: `
    <div class="row g-4" [formGroup]="form()">
      <div class="col-md-6">
        <label class="form-label">Nombres</label>
        <input class="form-control" type="text" formControlName="nombres" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Apellidos</label>
        <input class="form-control" type="text" formControlName="apellidos" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Cedula</label>
        <input class="form-control" type="text" formControlName="cedula" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Provincia</label>
        <select class="form-select" formControlName="provincia_personal_id">
          <option [ngValue]="null">Seleccione una provincia</option>
          <option *ngFor="let province of provinces()" [ngValue]="province.id">
            {{ province.nombre }}
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Fecha de nacimiento</label>
        <input class="form-control" type="date" formControlName="fecha_nacimiento" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Email</label>
        <input class="form-control" type="email" formControlName="email" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Telefono</label>
        <input class="form-control" type="text" formControlName="telefono" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Direccion</label>
        <input class="form-control" type="text" formControlName="direccion" />
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
}
