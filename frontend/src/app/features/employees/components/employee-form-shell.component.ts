import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { EmployeeFormTab } from '../forms/employee-form';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';

@Component({
  selector: 'app-employee-form-shell',
  standalone: true,
  imports: [NgClass, ModuleHeaderComponent],
  template: `
    <section class="form-page">
      <app-module-header
        moduleTitle="Modulo de Empleados"
        [sectionTitle]="sectionTitle()"
      ></app-module-header>

      <nav class="tabs">
        <button
          type="button"
          class="tab"
          [ngClass]="{ active: activeTab() === 'personal' }"
          (click)="tabChange.emit('personal')"
        >
          Datos personales
        </button>

        <button
          type="button"
          class="tab"
          [ngClass]="{ active: activeTab() === 'labor' }"
          (click)="tabChange.emit('labor')"
        >
          Datos laborales
        </button>
      </nav>

      <section class="content-card">
        <ng-content></ng-content>
      </section>

      <footer class="actions">
        <ng-content select="[form-actions]"></ng-content>
      </footer>
    </section>
  `,
  styles: [`
    .form-page {
      display: grid;
      gap: 12px;
    }

    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
      padding: 0;
      border-bottom: 1px solid var(--border);
      background: transparent;
    }

    .tab {
      min-width: 160px;
      border: 1px solid var(--border);
      border-bottom: none;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      background: rgba(255, 255, 255, 0.76);
      color: #8f8a82;
      padding: 10px 16px;
      text-align: left;
    }

    .tab + .tab {
      margin-left: 6px;
    }

    .tab.active {
      border-color: rgba(89, 165, 214, 0.28);
      background: rgba(255, 255, 255, 0.96);
      color: #2a7cc2;
      font-weight: 600;
    }

    .content-card {
      padding: 20px;
      border: 1px solid var(--border);
      border-radius: 0 0 12px 12px;
      background: rgba(255, 255, 255, 0.86);
    }

    .actions {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    @media (max-width: 640px) {
      .tab {
        flex: 1 1 calc(50% - 3px);
        min-width: 0;
      }
    }
  `],
})
export class EmployeeFormShellComponent {
  readonly sectionTitle = input.required<string>();
  readonly activeTab = input.required<EmployeeFormTab>();
  readonly tabChange = output<EmployeeFormTab>();
}
