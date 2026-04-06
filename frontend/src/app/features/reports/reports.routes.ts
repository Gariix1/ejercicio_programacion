import { Routes } from '@angular/router';
import { ReportsHomePageComponent } from './pages/reports-home.page';
import { EmployeesReportPageComponent } from './pages/employees-report.page';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    component: ReportsHomePageComponent,
  },
  {
    path: 'employees',
    component: EmployeesReportPageComponent,
    data: {
      moduleBackLink: '/employees',
      moduleBackLabel: 'Volver a empleados',
    },
  },
];
