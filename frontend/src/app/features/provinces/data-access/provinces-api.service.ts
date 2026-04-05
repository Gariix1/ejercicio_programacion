import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.config';
import { ApiDocument, ApiResource } from '../../../core/api.types';
import { Province } from '../models/province.model';

interface ProvinceAttributes {
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

type ProvinceResource = ApiResource<ProvinceAttributes>;

@Injectable({ providedIn: 'root' })
export class ProvincesApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  list(): Observable<Province[]> {
    return this.http
      .get<ApiDocument<ProvinceResource[]>>(`${this.apiBaseUrl}/provinces`)
      .pipe(map((response) => response.data.map((resource) => this.mapProvince(resource))));
  }

  private mapProvince(resource: ProvinceResource): Province {
    return {
      id: Number(resource.id),
      nombre: resource.attributes.nombre,
      capital: resource.attributes.capital,
      descripcion: resource.attributes.descripcion,
      poblacion: resource.attributes.poblacion,
      superficie: resource.attributes.superficie,
      latitud: resource.attributes.latitud,
      longitud: resource.attributes.longitud,
      id_region: resource.attributes.id_region,
      created_at: resource.attributes.created_at,
      updated_at: resource.attributes.updated_at,
    };
  }
}
