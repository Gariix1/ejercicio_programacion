import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Province } from '../../provinces/models/province.model';

@Component({
  selector: 'app-employee-labor-form',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule],
  template: `
    <div class="row g-4" [formGroup]="form()">
      <div class="col-md-6">
        <label class="form-label">Fecha de ingreso</label>
        <input class="form-control" type="date" formControlName="fecha_ingreso" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Cargo</label>
        <input class="form-control" type="text" formControlName="cargo" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Departamento</label>
        <input class="form-control" type="text" formControlName="departamento" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Provincia laboral</label>
        <select class="form-select" formControlName="provincia_laboral_id">
          <option [ngValue]="null">Seleccione una provincia</option>
          <option *ngFor="let province of provinces()" [ngValue]="province.id">
            {{ province.nombre }}
          </option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Codigo empleado</label>
        <input class="form-control" type="text" formControlName="codigo_empleado" />
      </div>

      <div class="col-md-6">
        <label class="form-label">Estado</label>
        <select class="form-select" formControlName="estado_codigo" (change)="syncStatusLabel()">
          <option [ngValue]="1">1 · Vigente</option>
          <option [ngValue]="9">9 · Retirado</option>
        </select>
      </div>

      <div class="col-md-6">
        <label class="form-label">Sueldo</label>
        <div class="input-group">
          <input class="form-control" type="number" step="0.01" formControlName="sueldo" />
          <span class="input-group-text">USD</span>
        </div>
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
  `],
})
export class EmployeeLaborFormComponent {
  readonly form = input.required<any>();
  readonly provinces = input<Province[]>([]);

  protected syncStatusLabel(): void {
    const control = this.form().get('estado_codigo');
    const value = Number(control?.value ?? 1);

    this.form().patchValue({
      estado_nombre: value === 9 ? 'RETIRADO' : 'VIGENTE',
    });
  }
}
