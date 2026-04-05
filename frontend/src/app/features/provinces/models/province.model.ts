export interface Province {
  id: number;
  nombre: string;
  capital: string | null;
  descripcion: string | null;
  poblacion: string | null;
  superficie: number | null;
  latitud: number | null;
  longitud: number | null;
  id_region: number | null;
  created_at: string | null;
  updated_at: string | null;
}
