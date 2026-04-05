import { FormBuilder, Validators } from '@angular/forms';
import { Employee, EmployeeUpsertPayload } from '../models/employee.model';

export type EmployeeFormTab = 'personal' | 'labor';

export function buildEmployeeForm(formBuilder: FormBuilder) {
  return formBuilder.group<any>({
    codigo_empleado: ['', [Validators.required, Validators.maxLength(5), Validators.minLength(5)]],
    nombres: ['', [Validators.required, Validators.maxLength(100)]],
    apellidos: ['', [Validators.required, Validators.maxLength(100)]],
    cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    telefono: ['', [Validators.pattern(/^\d{7,15}$/)]],
    direccion: ['', [Validators.maxLength(255)]],
    fecha_nacimiento: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    fotografia: [''],
    observaciones_personales: [''],
    fecha_ingreso: ['', [Validators.required]],
    cargo: ['', [Validators.required, Validators.maxLength(100)]],
    departamento: ['', [Validators.required, Validators.maxLength(100)]],
    sueldo: [0, [Validators.required, Validators.min(0.01)]],
    jornada_parcial: [false, [Validators.required]],
    observaciones_laborales: [''],
    provincia_personal_id: [null, [Validators.required]],
    provincia_laboral_id: [null, [Validators.required]],
    estado_codigo: [1, [Validators.required]],
    estado_nombre: ['VIGENTE', [Validators.required]],
  });
}

export function patchEmployeeForm(form: ReturnType<typeof buildEmployeeForm>, employee: Employee): void {
  form.patchValue({
    codigo_empleado: employee.codigo_empleado,
    nombres: employee.nombres,
    apellidos: employee.apellidos,
    cedula: employee.cedula,
    telefono: employee.telefono ?? '',
    direccion: employee.direccion ?? '',
    fecha_nacimiento: employee.fecha_nacimiento,
    email: employee.email,
    fotografia: employee.fotografia ?? '',
    observaciones_personales: employee.observaciones_personales ?? '',
    fecha_ingreso: employee.fecha_ingreso,
    cargo: employee.cargo,
    departamento: employee.departamento,
    sueldo: employee.sueldo,
    jornada_parcial: employee.jornada_parcial,
    observaciones_laborales: employee.observaciones_laborales ?? '',
    provincia_personal_id: employee.provincia_personal_id,
    provincia_laboral_id: employee.provincia_laboral_id,
    estado_codigo: employee.estado_codigo,
    estado_nombre: employee.estado_nombre,
  });
}

export function mapEmployeeFormToPayload(formValue: any): EmployeeUpsertPayload {
  return {
    codigo_empleado: String(formValue.codigo_empleado).trim().toUpperCase(),
    nombres: String(formValue.nombres).trim(),
    apellidos: String(formValue.apellidos).trim(),
    cedula: String(formValue.cedula).trim(),
    telefono: normalizeOptional(formValue.telefono),
    direccion: normalizeOptional(formValue.direccion),
    fecha_nacimiento: String(formValue.fecha_nacimiento),
    email: String(formValue.email).trim().toLowerCase(),
    fotografia: normalizeOptional(formValue.fotografia),
    observaciones_personales: normalizeOptional(formValue.observaciones_personales),
    fecha_ingreso: String(formValue.fecha_ingreso),
    cargo: String(formValue.cargo).trim(),
    departamento: String(formValue.departamento).trim(),
    sueldo: Number(formValue.sueldo),
    jornada_parcial: Boolean(formValue.jornada_parcial),
    observaciones_laborales: normalizeOptional(formValue.observaciones_laborales),
    provincia_personal_id: Number(formValue.provincia_personal_id),
    provincia_laboral_id: Number(formValue.provincia_laboral_id),
    estado_codigo: Number(formValue.estado_codigo),
    estado_nombre: String(formValue.estado_nombre).trim().toUpperCase(),
  };
}

function normalizeOptional(value: unknown): string | null {
  const normalized = String(value ?? '').trim();

  return normalized !== '' ? normalized : null;
}
