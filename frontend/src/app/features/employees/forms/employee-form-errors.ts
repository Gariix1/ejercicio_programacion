import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiErrorDocument } from '../../../core/api.types';

export type EmployeeFormField =
  | 'codigo_empleado'
  | 'nombres'
  | 'apellidos'
  | 'cedula'
  | 'telefono'
  | 'direccion'
  | 'fecha_nacimiento'
  | 'email'
  | 'fecha_ingreso'
  | 'cargo'
  | 'departamento'
  | 'sueldo'
  | 'provincia_personal_id'
  | 'provincia_laboral_id'
  | 'estado_codigo'
  | 'estado_nombre';

export type EmployeeFormFieldErrors = Partial<Record<EmployeeFormField, string>>;

const REQUIRED_FIELDS = new Set<EmployeeFormField>([
  'codigo_empleado',
  'nombres',
  'apellidos',
  'cedula',
  'fecha_nacimiento',
  'email',
  'fecha_ingreso',
  'cargo',
  'departamento',
  'provincia_personal_id',
  'provincia_laboral_id',
  'estado_codigo',
]);

const FIELD_LABELS: Record<EmployeeFormField, string> = {
  codigo_empleado: 'El codigo de empleado',
  nombres: 'Los nombres',
  apellidos: 'Los apellidos',
  cedula: 'La cedula',
  telefono: 'El telefono',
  direccion: 'La direccion',
  fecha_nacimiento: 'La fecha de nacimiento',
  email: 'El email',
  fecha_ingreso: 'La fecha de ingreso',
  cargo: 'El cargo',
  departamento: 'El departamento',
  sueldo: 'El sueldo',
  provincia_personal_id: 'La provincia personal',
  provincia_laboral_id: 'La provincia laboral',
  estado_codigo: 'El estado',
  estado_nombre: 'La etiqueta de estado',
};

export function parseEmployeeApiErrors(payload: unknown): {
  formError: string | null;
  fieldErrors: EmployeeFormFieldErrors;
} {
  const document = payload as Partial<ApiErrorDocument> | null;

  if (!document || !Array.isArray(document.errors)) {
    return {
      formError: 'No se pudo guardar el empleado. Intenta nuevamente.',
      fieldErrors: {},
    };
  }

  const fieldErrors: EmployeeFormFieldErrors = {};
  let formError: string | null = null;

  for (const error of document.errors) {
    const field = String(error?.source?.['field'] ?? '') as EmployeeFormField;

    if (field && !(field in fieldErrors)) {
      fieldErrors[field] = error.detail;
      continue;
    }

    if (!formError) {
      formError = error.detail;
    }
  }

  return {
    formError,
    fieldErrors,
  };
}

export function getEmployeeFieldErrorMessage(
  field: EmployeeFormField,
  control: AbstractControl | null,
  fieldErrors: EmployeeFormFieldErrors,
): string | null {
  if (fieldErrors[field]) {
    return fieldErrors[field] ?? null;
  }

  if (!control || !control.errors || !(control.touched || control.dirty)) {
    return null;
  }

  return mapValidationErrors(field, control.errors);
}

export function getEmployeeFieldHint(field: EmployeeFormField): string | null {
  switch (field) {
    case 'codigo_empleado':
      return 'Usa 5 caracteres. Ejemplo: 00001.';
    case 'cedula':
      return 'Debe tener exactamente 10 digitos.';
    case 'telefono':
      return 'Opcional. Debe tener entre 7 y 15 digitos.';
    case 'fecha_nacimiento':
      return 'Selecciona una fecha anterior a hoy.';
    case 'email':
      return 'Ejemplo: nombre@dominio.com';
    case 'fecha_ingreso':
      return 'Debe ser valida y no futura.';
    case 'sueldo':
      return 'Ingresa un valor mayor que 0.';
    case 'provincia_personal_id':
    case 'provincia_laboral_id':
      return 'Selecciona una provincia de la lista.';
    case 'estado_codigo':
      return 'Elige si el empleado esta vigente o retirado.';
    default:
      return null;
  }
}

export function getEmployeeFieldSuccessMessage(
  field: EmployeeFormField,
  control: AbstractControl | null,
  fieldErrors: EmployeeFormFieldErrors,
): string | null {
  if (fieldErrors[field]) {
    return null;
  }

  if (!control || control.invalid) {
    return null;
  }

  if (!hasValue(control.value)) {
    return null;
  }

  switch (field) {
    case 'provincia_personal_id':
    case 'provincia_laboral_id':
      return 'Seleccion correcta.';
    case 'estado_codigo':
      return 'Estado valido.';
    case 'email':
      return 'Correo con formato valido.';
    case 'cedula':
      return 'Cedula con formato valido.';
    case 'telefono':
      return 'Telefono con formato valido.';
    case 'codigo_empleado':
      return 'Codigo valido.';
    case 'fecha_nacimiento':
    case 'fecha_ingreso':
      return 'Fecha valida.';
    case 'sueldo':
      return 'Valor valido.';
    default:
      return REQUIRED_FIELDS.has(field) ? 'Dato valido.' : null;
  }
}

export function hasEmployeeFieldSuccess(
  field: EmployeeFormField,
  control: AbstractControl | null,
  fieldErrors: EmployeeFormFieldErrors,
): boolean {
  return getEmployeeFieldSuccessMessage(field, control, fieldErrors) !== null;
}

function mapValidationErrors(field: EmployeeFormField, errors: ValidationErrors): string | null {
  const label = FIELD_LABELS[field];

  if (errors['required']) {
    return `${label} es obligatorio.`;
  }

  if (errors['email']) {
    return 'Ingresa un email valido.';
  }

  if (errors['minlength']) {
    return `${label} debe tener al menos ${errors['minlength'].requiredLength} caracteres.`;
  }

  if (errors['maxlength']) {
    return `${label} no puede superar ${errors['maxlength'].requiredLength} caracteres.`;
  }

  if (errors['min']) {
    return `${label} debe ser mayor que ${errors['min'].min}.`;
  }

  if (errors['pattern']) {
    switch (field) {
      case 'codigo_empleado':
        return 'El codigo debe tener 5 caracteres alfanumericos.';
      case 'cedula':
        return 'La cedula debe tener exactamente 10 digitos.';
      case 'telefono':
        return 'El telefono debe tener entre 7 y 15 digitos.';
      case 'email':
        return 'El correo debe incluir @ y un dominio valido.';
      default:
        return `${label} tiene un formato invalido.`;
    }
  }

  if (errors['date_before_today']) {
    return 'La fecha de nacimiento debe ser anterior a hoy.';
  }

  if (errors['date_not_future']) {
    return 'La fecha de ingreso no puede estar en el futuro.';
  }

  if (errors['date_after_birth']) {
    return 'La fecha de ingreso debe ser posterior a la fecha de nacimiento.';
  }

  return 'Revisa el valor ingresado.';
}

function hasValue(value: unknown): boolean {
  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  if (typeof value === 'boolean') {
    return true;
  }

  return String(value ?? '').trim() !== '';
}
