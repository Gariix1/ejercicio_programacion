import { ApiLinks, ApiMeta, ApiPaginationMeta } from '../../../core/api.types';

export interface Employee {
  id: number;
  codigo_empleado: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: string;
  email: string;
  fotografia: string | null;
  observaciones_personales: string | null;
  fecha_ingreso: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  jornada_parcial: boolean;
  jornada_parcial_label: string;
  observaciones_laborales: string | null;
  provincia_personal_id: number;
  provincia_personal_nombre: string | null;
  provincia_laboral_id: number;
  provincia_laboral_nombre: string | null;
  estado_codigo: number;
  estado_nombre: string;
  estado_descripcion: string | null;
  created_at: string | null;
  updated_at: string | null;
  self_link: string | null;
}

export type EmployeeSortField =
  | 'id'
  | 'codigo_empleado'
  | 'nombres'
  | 'apellidos'
  | 'cedula'
  | 'email'
  | 'cargo'
  | 'departamento'
  | 'sueldo'
  | 'fecha_ingreso'
  | 'estado_nombre'
  | 'provincia_personal_nombre'
  | 'provincia_laboral_nombre';

export interface EmployeeListQuery {
  search?: string;
  sortBy?: EmployeeSortField;
  sortDir?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface EmployeeUpsertPayload {
  codigo_empleado: string;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: string;
  email: string;
  fotografia: string | null;
  observaciones_personales: string | null;
  fecha_ingreso: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  jornada_parcial: boolean;
  observaciones_laborales: string | null;
  provincia_personal_id: number;
  provincia_laboral_id: number;
  estado_codigo: number;
  estado_nombre: string;
}

export interface EmployeeListResult {
  items: Employee[];
  pagination: ApiPaginationMeta | null;
  meta: ApiMeta;
  links: ApiLinks;
}
