import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Employee, EmployeeUpsertPayload } from '../models/employee.model';

export type EmployeeFormTab = 'personal' | 'labor';

export interface EmployeeFormValue {
  codigo_empleado: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  direccion: string;
  fecha_nacimiento: string;
  email: string;
  fotografia: string;
  observaciones_personales: string;
  fecha_ingreso: string;
  cargo: string;
  departamento: string;
  sueldo: number | null;
  jornada_parcial: boolean;
  observaciones_laborales: string;
  provincia_personal_id: number | null;
  provincia_laboral_id: number | null;
  estado_codigo: number;
  estado_nombre: string;
}

export type EmployeeFormControls = {
  [Field in keyof EmployeeFormValue]: FormControl<EmployeeFormValue[Field]>;
};

export type EmployeeFormGroup = FormGroup<EmployeeFormControls>;

export function createEmployeeFormValue(): EmployeeFormValue {
  return {
    codigo_empleado: '',
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    direccion: '',
    fecha_nacimiento: '',
    email: '',
    fotografia: '',
    observaciones_personales: '',
    fecha_ingreso: '',
    cargo: '',
    departamento: '',
    sueldo: 0,
    jornada_parcial: false,
    observaciones_laborales: '',
    provincia_personal_id: null,
    provincia_laboral_id: null,
    estado_codigo: 1,
    estado_nombre: 'VIGENTE',
  };
}

export function buildEmployeeForm(formBuilder: FormBuilder): EmployeeFormGroup {
  const defaults = createEmployeeFormValue();

  return formBuilder.group<EmployeeFormControls>(
    {
      codigo_empleado: formBuilder.nonNullable.control(defaults.codigo_empleado, [
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
        Validators.pattern(/^[A-Za-z0-9]{5}$/),
      ]),
      nombres: formBuilder.nonNullable.control(defaults.nombres, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      apellidos: formBuilder.nonNullable.control(defaults.apellidos, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      cedula: formBuilder.nonNullable.control(defaults.cedula, [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
      ]),
      telefono: formBuilder.nonNullable.control(defaults.telefono, [
        Validators.pattern(/^\d{7,15}$/),
      ]),
      direccion: formBuilder.nonNullable.control(defaults.direccion, [
        Validators.maxLength(255),
        Validators.minLength(5),
      ]),
      fecha_nacimiento: formBuilder.nonNullable.control(defaults.fecha_nacimiento, [Validators.required]),
      email: formBuilder.nonNullable.control(defaults.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(150),
        Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/),
      ]),
      fotografia: formBuilder.nonNullable.control(defaults.fotografia),
      observaciones_personales: formBuilder.nonNullable.control(defaults.observaciones_personales),
      fecha_ingreso: formBuilder.nonNullable.control(defaults.fecha_ingreso, [Validators.required]),
      cargo: formBuilder.nonNullable.control(defaults.cargo, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      departamento: formBuilder.nonNullable.control(defaults.departamento, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
      ]),
      sueldo: formBuilder.control<EmployeeFormValue['sueldo']>(defaults.sueldo, [
        Validators.required,
        Validators.min(0.01),
      ]),
      jornada_parcial: formBuilder.nonNullable.control(defaults.jornada_parcial, [Validators.required]),
      observaciones_laborales: formBuilder.nonNullable.control(defaults.observaciones_laborales),
      provincia_personal_id: formBuilder.control<EmployeeFormValue['provincia_personal_id']>(
        defaults.provincia_personal_id,
        [Validators.required],
      ),
      provincia_laboral_id: formBuilder.control<EmployeeFormValue['provincia_laboral_id']>(
        defaults.provincia_laboral_id,
        [Validators.required],
      ),
      estado_codigo: formBuilder.nonNullable.control(defaults.estado_codigo, [Validators.required]),
      estado_nombre: formBuilder.nonNullable.control(defaults.estado_nombre, [Validators.required]),
    },
    {
      validators: [employeeDatesValidator()],
    },
  );
}

export function resetEmployeeForm(form: EmployeeFormGroup): void {
  form.reset(createEmployeeFormValue());
}

export function patchEmployeeForm(form: EmployeeFormGroup, employee: Employee): void {
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

export function syncEmployeeStatusLabel(form: EmployeeFormGroup): void {
  const value = Number(form.controls.estado_codigo.value ?? 1);

  form.patchValue({
    estado_nombre: value === 9 ? 'RETIRADO' : 'VIGENTE',
  });
}

export function mapEmployeeFormToPayload(formValue: EmployeeFormValue): EmployeeUpsertPayload {
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
