import { Component, input } from '@angular/core';
import { Employee } from '../models/employee.model';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  template: `
    <article class="card">
      <div class="top">
        <span class="badge">{{ employee().codigo_empleado }}</span>
        <span>{{ employee().estado_nombre }}</span>
      </div>

      <h3>{{ employee().nombres }} {{ employee().apellidos }}</h3>
      <p>{{ employee().cargo }} · {{ employee().departamento }}</p>
      <small>{{ employee().email }}</small>
      <small class="meta">
        {{ employee().provincia_personal_nombre }} · {{ employee().jornada_parcial_label }}
      </small>
    </article>
  `,
  styles: [`
    .card {
      display: grid;
      gap: 10px;
      padding: 18px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--surface);
      box-shadow: 0 12px 24px rgba(73, 44, 24, 0.08);
    }

    .top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      color: var(--muted);
      font-size: 0.88rem;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      background: var(--surface-alt);
      color: var(--accent-strong);
      padding: 4px 10px;
      font-weight: 700;
    }

    h3, p, small {
      margin: 0;
    }

    .meta {
      color: var(--muted);
    }
  `],
})
export class EmployeeCardComponent {
  readonly employee = input.required<Employee>();
}
