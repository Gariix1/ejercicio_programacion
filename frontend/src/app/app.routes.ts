import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'employees',
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./features/employees/employees.routes').then((module) => module.EMPLOYEES_ROUTES),
  },
];
