import { ApiResource } from '../../../core/api.types';
import { Employee } from './employee.model';

interface EmployeeAttributes {
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
  estado_codigo: number;
  estado_nombre: string;
  estado_descripcion: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface EmployeeRelationships {
  provincia_personal: {
    data: { type: 'provinces'; id: string };
    meta: { nombre: string | null };
  };
  provincia_laboral: {
    data: { type: 'provinces'; id: string };
    meta: { nombre: string | null };
  };
  estado: {
    data: { type: 'employee-statuses'; id: string };
    meta: {
      codigo: number;
      nombre: string;
      descripcion: string | null;
    };
  };
}

export type EmployeeApiResource = ApiResource<EmployeeAttributes, EmployeeRelationships>;

export function mapEmployeeResource(resource: EmployeeApiResource): Employee {
  return {
    id: Number(resource.id),
    codigo_empleado: resource.attributes.codigo_empleado,
    nombres: resource.attributes.nombres,
    apellidos: resource.attributes.apellidos,
    cedula: resource.attributes.cedula,
    telefono: resource.attributes.telefono,
    direccion: resource.attributes.direccion,
    fecha_nacimiento: resource.attributes.fecha_nacimiento,
    email: resource.attributes.email,
    fotografia: resource.attributes.fotografia,
    observaciones_personales: resource.attributes.observaciones_personales,
    fecha_ingreso: resource.attributes.fecha_ingreso,
    cargo: resource.attributes.cargo,
    departamento: resource.attributes.departamento,
    sueldo: resource.attributes.sueldo,
    jornada_parcial: resource.attributes.jornada_parcial,
    jornada_parcial_label: resource.attributes.jornada_parcial_label,
    observaciones_laborales: resource.attributes.observaciones_laborales,
    provincia_personal_id: Number(resource.relationships?.provincia_personal.data.id ?? 0),
    provincia_personal_nombre: resource.relationships?.provincia_personal.meta.nombre ?? null,
    provincia_laboral_id: Number(resource.relationships?.provincia_laboral.data.id ?? 0),
    provincia_laboral_nombre: resource.relationships?.provincia_laboral.meta.nombre ?? null,
    estado_codigo: resource.attributes.estado_codigo,
    estado_nombre: resource.attributes.estado_nombre,
    estado_descripcion: resource.attributes.estado_descripcion,
    created_at: resource.attributes.created_at,
    updated_at: resource.attributes.updated_at,
    self_link: resource.links?.self ?? null,
  };
}
