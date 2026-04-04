import { Routes } from '@angular/router';
import { EmployeesListPageComponent } from './pages/employees-list.page';

export const EMPLOYEES_ROUTES: Routes = [
  {
    path: '',
    component: EmployeesListPageComponent,
  },
];
