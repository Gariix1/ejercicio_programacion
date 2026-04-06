import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.config';
import { ApiDocument } from '../../../core/api.types';
import { buildListQueryParams } from '../../../shared/query-utils';
import {
  Employee,
  EmployeeListQuery,
  EmployeeListResult,
  EmployeePhotoUploadResult,
  EmployeeUpsertPayload,
} from '../models/employee.model';
import { EmployeeApiResource, mapEmployeeResource } from '../models/employee.resource';

@Injectable({ providedIn: 'root' })
export class EmployeesApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  list(query: EmployeeListQuery = {}): Observable<EmployeeListResult> {
    const params = buildListQueryParams(query);

    const url = params.size > 0
      ? `${this.apiBaseUrl}/employees?${params.toString()}`
      : `${this.apiBaseUrl}/employees`;

    return this.http
      .get<ApiDocument<EmployeeApiResource[]>>(url)
      .pipe(
        map((response) => ({
          items: response.data.map((resource) => mapEmployeeResource(resource)),
          pagination: response.meta.pagination ?? null,
          meta: response.meta,
          links: response.links,
        })),
      );
  }

  findById(id: number): Observable<Employee> {
    return this.http
      .get<ApiDocument<EmployeeApiResource>>(`${this.apiBaseUrl}/employees/${id}`)
      .pipe(map((response) => mapEmployeeResource(response.data)));
  }

  create(payload: EmployeeUpsertPayload): Observable<Employee> {
    return this.http
      .post<ApiDocument<EmployeeApiResource>>(`${this.apiBaseUrl}/employees`, payload)
      .pipe(map((response) => mapEmployeeResource(response.data)));
  }

  update(id: number, payload: EmployeeUpsertPayload): Observable<Employee> {
    return this.http
      .put<ApiDocument<EmployeeApiResource>>(`${this.apiBaseUrl}/employees/${id}`, payload)
      .pipe(map((response) => mapEmployeeResource(response.data)));
  }

  patch(id: number, payload: Partial<EmployeeUpsertPayload>): Observable<Employee> {
    return this.http
      .patch<ApiDocument<EmployeeApiResource>>(`${this.apiBaseUrl}/employees/${id}`, payload)
      .pipe(map((response) => mapEmployeeResource(response.data)));
  }

  remove(id: number): Observable<Employee> {
    return this.http
      .delete<ApiDocument<EmployeeApiResource>>(`${this.apiBaseUrl}/employees/${id}`)
      .pipe(map((response) => mapEmployeeResource(response.data)));
  }

  uploadPhoto(file: File): Observable<EmployeePhotoUploadResult> {
    const formData = new FormData();
    formData.append('fotografia', file);

    return this.http
      .post<ApiDocument<{
        type: string;
        id: string;
        attributes: EmployeePhotoUploadResult;
      }>>(`${this.apiBaseUrl}/employees/photo`, formData)
      .pipe(map((response) => response.data.attributes));
  }
}
