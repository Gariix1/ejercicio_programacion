import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/api.config';
import { ApiDocument, ApiResource } from '../../../core/api.types';
import { buildListQueryParams } from '../../../shared/query-utils';
import { EmployeeListQuery } from '../../employees/models/employee.model';
import {
  EmployeeApiResource,
  mapEmployeeResource,
} from '../../employees/models/employee.resource';
import {
  EmployeeReportSummary,
  EmployeeReportSummaryResult,
  EmployeesReportResult,
} from '../models/report.model';

interface EmployeeReportSummaryAttributes {
  total_empleados: number;
  empleados_vigentes: number;
  empleados_retirados: number;
  sueldo_promedio: number;
}

type EmployeeReportSummaryResource = ApiResource<EmployeeReportSummaryAttributes>;

@Injectable({ providedIn: 'root' })
export class ReportsApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  listEmployees(query: EmployeeListQuery = {}): Observable<EmployeesReportResult> {
    const params = buildListQueryParams(query);

    const url = params.size > 0
      ? `${this.apiBaseUrl}/reports/employees?${params.toString()}`
      : `${this.apiBaseUrl}/reports/employees`;

    return this.http.get<ApiDocument<EmployeeApiResource[]>>(url).pipe(
      map((response) => ({
        items: response.data.map((resource) => mapEmployeeResource(resource)),
        pagination: response.meta.pagination ?? null,
        meta: response.meta,
        links: response.links,
      })),
    );
  }

  summary(): Observable<EmployeeReportSummaryResult> {
    return this.http
      .get<ApiDocument<EmployeeReportSummaryResource>>(`${this.apiBaseUrl}/reports/summary`)
      .pipe(
        map((response) => ({
          summary: this.mapSummary(response.data),
          meta: response.meta,
          links: response.links,
        })),
      );
  }

  private mapSummary(resource: EmployeeReportSummaryResource): EmployeeReportSummary {
    return {
      total_empleados: resource.attributes.total_empleados,
      empleados_vigentes: resource.attributes.empleados_vigentes,
      empleados_retirados: resource.attributes.empleados_retirados,
      sueldo_promedio: resource.attributes.sueldo_promedio,
    };
  }
}
