import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Employee, EmployeeUpsertPayload } from '../models/employee.model';

export type EmployeeFormTab = 'personal' | 'labor';

export function buildEmployeeForm(formBuilder: FormBuilder) {
  return formBuilder.group<any>(
    {
      codigo_empleado: ['', [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
        Validators.pattern(/^[A-Za-z0-9]{5}$/),
      ]],
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      telefono: ['', [Validators.pattern(/^\d{7,15}$/)]],
      direccion: ['', [Validators.maxLength(255), Validators.minLength(5)]],
      fecha_nacimiento: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(150),
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      ]],
      fotografia: [''],
      observaciones_personales: [''],
      fecha_ingreso: ['', [Validators.required]],
      cargo: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      departamento: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      sueldo: [0, [Validators.required, Validators.min(0.01)]],
      jornada_parcial: [false, [Validators.required]],
      observaciones_laborales: [''],
      provincia_personal_id: [null, [Validators.required]],
      provincia_laboral_id: [null, [Validators.required]],
      estado_codigo: [1, [Validators.required]],
      estado_nombre: ['VIGENTE', [Validators.required]],
    },
    {
      validators: [employeeDatesValidator()],
    },
  );
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
  const estadoCodigo = Number(formValue.estado_codigo);

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
    estado_codigo: estadoCodigo,
    estado_nombre: estadoCodigo === 9 ? 'RETIRADO' : 'VIGENTE',
  };
}

function normalizeOptional(value: unknown): string | null {
  const normalized = String(value ?? '').trim();

  return normalized !== '' ? normalized : null;
}

function employeeDatesValidator(): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const birthControl = group.get('fecha_nacimiento');
    const ingresoControl = group.get('fecha_ingreso');

    if (!birthControl || !ingresoControl) {
      return null;
    }

    clearControlError(birthControl, 'date_before_today');
    clearControlError(ingresoControl, 'date_not_future');
    clearControlError(ingresoControl, 'date_after_birth');

    const today = startOfDay(new Date());
    const birthDate = parseDate(birthControl.value);
    const ingresoDate = parseDate(ingresoControl.value);

    if (birthDate && birthDate >= today) {
      addControlError(birthControl, 'date_before_today');
    }

    if (ingresoDate && ingresoDate > today) {
      addControlError(ingresoControl, 'date_not_future');
    }

    if (birthDate && ingresoDate && ingresoDate <= birthDate) {
      addControlError(ingresoControl, 'date_after_birth');
    }

    return null;
  };
}

function parseDate(value: unknown): Date | null {
  const normalized = String(value ?? '').trim();

  if (normalized === '') {
    return null;
  }

  const parsed = new Date(`${normalized}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? null : startOfDay(parsed);
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);

  return copy;
}

function addControlError(control: AbstractControl, errorKey: string): void {
  control.setErrors({
    ...(control.errors ?? {}),
    [errorKey]: true,
  });
}

function clearControlError(control: AbstractControl, errorKey: string): void {
  if (!control.errors?.[errorKey]) {
    return;
  }

  const { [errorKey]: _removed, ...rest } = control.errors;
  control.setErrors(Object.keys(rest).length > 0 ? rest : null);
}
