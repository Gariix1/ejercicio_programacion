import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { PageShellComponent } from '../../../shared/page-shell.component';
import { EmployeeCardComponent } from '../components/employee-card.component';
import { EmployeesApiService } from '../data-access/employees-api.service';

@Component({
  selector: 'app-employees-list-page',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, PageShellComponent, EmployeeCardComponent],
  template: `
    <app-page-shell
      title="Empleados"
      kicker="Feature"
      description="Esta vista consume la API REST del backend y renderiza el listado base del modulo Employees."
    >
      <div class="grid" *ngIf="employees$ | async as employees">
        <app-employee-card
          *ngFor="let employee of employees"
          [employee]="employee"
        ></app-employee-card>
      </div>
    </app-page-shell>
  `,
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
    }
  `],
})
export class EmployeesListPageComponent {
  readonly employees$ = this.employeesApiService.list();

  constructor(private readonly employeesApiService: EmployeesApiService) {}
}
