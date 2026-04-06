import { formatNumber } from '@angular/common';
import { Employee, EmployeeSortField } from '../../employees/models/employee.model';

export type ReportColumnWidth = 'compact' | 'short' | 'date' | 'standard' | 'wide' | 'xwide';
export type ReportColumnCellType = 'plain' | 'overflow';
export type ReportColumnAlign = 'left' | 'center';

export interface ReportColumn {
  key: string;
  label: string;
  width: ReportColumnWidth;
  sortBy?: EmployeeSortField;
  cellType?: ReportColumnCellType;
  align?: ReportColumnAlign;
  cellClass?: string;
  value: (employee: Employee) => string;
}

const textOrDash = (value: string | null | undefined): string => {
  const normalized = value?.trim() ?? '';
  return normalized.length > 0 ? normalized : '-';
};

export const DEFAULT_REPORT_COLUMNS: ReportColumn[] = [
  {
    key: 'full_name',
    label: 'Nombre',
    width: 'wide',
    sortBy: 'nombres',
    cellType: 'overflow',
    cellClass: 'cell-name',
    value: (employee) => `${employee.nombres} ${employee.apellidos}`.trim(),
  },
  {
    key: 'cedula',
    label: 'Cedula',
    width: 'short',
    sortBy: 'cedula',
    value: (employee) => textOrDash(employee.cedula),
  },
  {
    key: 'codigo_empleado',
    label: 'Codigo',
    width: 'compact',
    sortBy: 'codigo_empleado',
    value: (employee) => textOrDash(employee.codigo_empleado),
  },
  {
    key: 'direccion',
    label: 'Direccion',
    width: 'xwide',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.direccion),
  },
  {
    key: 'telefono',
    label: 'Telefono',
    width: 'short',
    value: (employee) => textOrDash(employee.telefono),
  },
  {
    key: 'fecha_ingreso',
    label: 'Fecha ingreso',
    width: 'date',
    sortBy: 'fecha_ingreso',
    value: (employee) => textOrDash(employee.fecha_ingreso),
  },
  {
    key: 'cargo',
    label: 'Cargo',
    width: 'standard',
    sortBy: 'cargo',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.cargo),
  },
  {
    key: 'departamento',
    label: 'Departamento',
    width: 'standard',
    sortBy: 'departamento',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.departamento),
  },
  {
    key: 'sueldo',
    label: 'Sueldo',
    width: 'compact',
    sortBy: 'sueldo',
    value: (employee) => formatNumber(employee.sueldo, 'en-US', '1.2-2'),
  },
  {
    key: 'jornada_parcial_label',
    label: 'Jornada',
    width: 'compact',
    value: (employee) => textOrDash(employee.jornada_parcial_label),
  },
  {
    key: 'estado_nombre',
    label: 'Estado',
    width: 'compact',
    sortBy: 'estado_nombre',
    value: (employee) => textOrDash(employee.estado_nombre),
  },
  {
    key: 'provincia_display',
    label: 'Provincia',
    width: 'standard',
    sortBy: 'provincia_laboral_nombre',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.provincia_laboral_nombre || employee.provincia_personal_nombre),
  },
  {
    key: 'email',
    label: 'Email',
    width: 'xwide',
    sortBy: 'email',
    cellType: 'overflow',
    value: (employee) => textOrDash(employee.email),
  },
];
