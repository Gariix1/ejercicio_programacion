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
  jornada_parcial: number;
  observaciones_laborales: string | null;
  provincia_personal_id: number;
  provincia_laboral_id: number;
  estado_codigo: number;
  estado_nombre: string;
}
