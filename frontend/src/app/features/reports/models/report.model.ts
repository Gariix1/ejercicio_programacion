import { ApiLinks, ApiMeta } from '../../../core/api.types';
import { Employee, EmployeeListQuery, EmployeeListResult } from '../../employees/models/employee.model';

export interface EmployeeReportSummary {
  total_empleados: number;
  empleados_vigentes: number;
  empleados_retirados: number;
  sueldo_promedio: number;
}

export interface EmployeeReportSummaryResult {
  summary: EmployeeReportSummary;
  meta: ApiMeta;
  links: ApiLinks;
}

export interface EmployeesReportResult extends EmployeeListResult {
  items: Employee[];
}

export type EmployeesReportQuery = EmployeeListQuery;
