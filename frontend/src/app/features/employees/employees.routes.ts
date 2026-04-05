import { Routes } from '@angular/router';
import { EmployeeFormPageComponent } from './pages/employee-form.page';
import { EmployeesListPageComponent } from './pages/employees-list.page';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    component: EmployeesListPageComponent,
  },
  {
    path: 'new',
    component: EmployeeFormPageComponent,
    data: {
      mode: 'create',
    },
  },
  {
    path: ':id/edit',
    component: EmployeeFormPageComponent,
    data: {
      mode: 'edit',
    },
  },
];
