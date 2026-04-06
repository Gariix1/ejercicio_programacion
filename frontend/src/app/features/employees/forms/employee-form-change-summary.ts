import { ConfirmActionChangeItem } from '../../../shared/confirm-action-modal.component';
import { Province } from '../../provinces/models/province.model';
import { EmployeeFormValue } from './employee-form';

type EmployeeFormFieldKey = keyof EmployeeFormValue;

const CHANGE_FIELDS: EmployeeFormFieldKey[] = [
  'codigo_empleado',
  'nombres',
  'apellidos',
  'cedula',
  'telefono',
  'direccion',
  'fecha_nacimiento',
  'email',
  'fotografia',
  'observaciones_personales',
  'fecha_ingreso',
  'cargo',
  'departamento',
  'sueldo',
  'jornada_parcial',
  'observaciones_laborales',
  'provincia_personal_id',
  'provincia_laboral_id',
  'estado_codigo',
];

const CHANGE_LABELS: Record<EmployeeFormFieldKey, string> = {
  codigo_empleado: 'Codigo de empleado',
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  cedula: 'Cedula',
  telefono: 'Telefono',
  direccion: 'Direccion',
  fecha_nacimiento: 'Fecha de nacimiento',
  email: 'Email',
  fotografia: 'Fotografia',
  observaciones_personales: 'Observaciones personales',
  fecha_ingreso: 'Fecha de ingreso',
  cargo: 'Cargo',
  departamento: 'Departamento',
  sueldo: 'Sueldo',
  jornada_parcial: 'Jornada parcial',
  observaciones_laborales: 'Observaciones laborales',
  provincia_personal_id: 'Provincia personal',
  provincia_laboral_id: 'Provincia laboral',
  estado_codigo: 'Estado',
};

export function buildEmployeeChangeSummary(
  baseline: EmployeeFormValue,
  current: EmployeeFormValue,
  provinces: Province[],
): ConfirmActionChangeItem[] {
  return CHANGE_FIELDS
    .filter((field) => normalizeCompareValue(baseline[field]) !== normalizeCompareValue(current[field]))
    .map((field) => {
      const before = formatChangeValue(field, baseline[field], provinces);
      const after = formatChangeValue(field, current[field], provinces);

      return before === 'Sin valor'
        ? { label: CHANGE_LABELS[field], after }
        : { label: CHANGE_LABELS[field], before, after };
    });
}

function formatChangeValue(
  field: EmployeeFormFieldKey,
  value: EmployeeFormValue[EmployeeFormFieldKey],
  provinces: Province[],
): string {
  if (value === null || value === undefined || value === '') {
    return 'Sin valor';
  }

  switch (field) {
    case 'provincia_personal_id':
    case 'provincia_laboral_id': {
      const province = provinces.find((item) => item.id === Number(value));
      return province?.nombre ?? 'Sin valor';
    }
    case 'estado_codigo':
      return Number(value) === 9 ? 'Retirado' : 'Vigente';
    case 'jornada_parcial':
      return value ? 'Parcial' : 'Completa';
    case 'fotografia':
      return formatPhotoValue(value);
    case 'sueldo':
      return new Intl.NumberFormat('es-EC', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(Number(value));
    case 'observaciones_personales':
    case 'observaciones_laborales':
    case 'direccion': {
      const text = String(value).trim();
      return text.length > 52 ? `${text.slice(0, 49)}...` : text;
    }
    default:
      return String(value).trim() || 'Sin valor';
  }
}

function formatPhotoValue(value: EmployeeFormValue[EmployeeFormFieldKey]): string {
  const normalized = String(value ?? '').trim();

  if (normalized === '') {
    return 'Sin valor';
  }

  const fileName = normalized
    .replace(/^https?:\/\/[^/]+/i, '')
    .split('/')
    .filter(Boolean)
    .at(-1);

  return fileName ? `Imagen: ${fileName}` : 'Imagen cargada';
}

function normalizeCompareValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  return String(value).trim();
}
