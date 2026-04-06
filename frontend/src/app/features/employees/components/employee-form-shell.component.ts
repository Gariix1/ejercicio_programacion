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
        moduleTitle="Empleados"
        [sectionTitle]="sectionTitle()"
      ></app-module-header>

      <section class="workflow-card">
        <div class="workflow-copy">
          <strong>
            {{
              activeTab() === 'personal'
                ? 'Datos personales'
                : 'Asignacion laboral y condiciones del empleado'
            }}
          </strong>
          <span class="workflow-description">
            {{
              activeTab() === 'personal'
                ? 'Completa la informacion base antes de pasar a los datos laborales.'
                : 'Completa la informacion de cargo, estado y condiciones del empleado.'
            }}
          </span>
        </div>

        <nav class="tabs" role="tablist" aria-label="Pasos del formulario">
          <button
            type="button"
            role="tab"
            class="tab"
            [attr.aria-selected]="activeTab() === 'personal'"
            [ngClass]="{ active: activeTab() === 'personal' }"
            (click)="tabChange.emit('personal')"
          >
            <span class="tab-copy">
              <span class="tab-step">Paso 1</span>
              <span class="tab-text">
                <strong>Datos personales</strong>
                <small>Identidad y contacto</small>
              </span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            class="tab"
            [attr.aria-selected]="activeTab() === 'labor'"
            [disabled]="!canAccessLaborTab() && activeTab() !== 'labor'"
            [ngClass]="{
              active: activeTab() === 'labor',
              disabled: !canAccessLaborTab() && activeTab() !== 'labor'
            }"
            (click)="tabChange.emit('labor')"
          >
            <span class="tab-copy">
              <span class="tab-step">Paso 2</span>
              <span class="tab-text">
                <strong>Datos laborales</strong>
                <small>Cargo y condiciones</small>
              </span>
            </span>
          </button>
        </nav>
      </section>

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
      gap: 14px;
    }

    .workflow-card {
      display: grid;
      gap: 10px;
      animation: workflowReveal 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .workflow-copy {
      display: grid;
      gap: 2px;
      padding-inline: 4px;
    }

    .workflow-copy strong {
      font-size: var(--font-size-section-title);
      line-height: var(--line-height-tight);
      color: var(--text-strong);
    }

    .workflow-description {
      color: var(--muted);
      font-size: var(--font-size-caption);
      line-height: 1.45;
    }

    .tabs {
      position: relative;
      display: flex;
      align-items: flex-end;
      gap: 0;
      overflow-x: auto;
      overflow-y: hidden;
      padding-inline: 0;
      border-bottom: 1px solid rgba(103, 86, 67, 0.24);
      scrollbar-width: none;
    }

    .tabs::-webkit-scrollbar {
      display: none;
    }

    .tab {
      position: relative;
      display: inline-flex;
      align-items: stretch;
      gap: 0;
      min-width: 190px;
      flex: 0 0 auto;
      padding: 0;
      margin-bottom: -1px;
      border: 1px solid rgba(103, 86, 67, 0.12);
      border-bottom: 0;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      background: rgba(255, 255, 255, 0.48);
      color: #74695f;
      text-align: left;
      transition:
        border-color 160ms ease,
        background-color 160ms ease,
        color 160ms ease,
        box-shadow 160ms ease,
        transform 180ms ease;
    }

    .tab::after {
      content: '';
      position: absolute;
      left: 14px;
      right: 14px;
      bottom: 0;
      height: 2px;
      border-radius: 999px;
      background: linear-gradient(90deg, rgba(42, 124, 194, 0.12) 0%, rgba(42, 124, 194, 0.3) 100%);
      transform: scaleX(0.28);
      transform-origin: left center;
      opacity: 0;
      transition: transform 220ms ease, opacity 180ms ease, background 220ms ease;
    }

    .tab:hover:not(.disabled):not(:disabled) {
      color: #63594e;
      background: rgba(255, 255, 255, 0.68);
      transform: translateY(-1px);
    }

    .tab:hover:not(.disabled):not(:disabled)::after {
      opacity: 0.42;
      transform: scaleX(0.6);
    }

    .tab-copy {
      display: grid;
      gap: 2px;
      width: 100%;
      padding: 12px 18px 11px;
      min-width: 0;
    }

    .tab-text {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .tab-step {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .tab-text strong {
      font-size: 0.97rem;
      line-height: var(--line-height-tight);
      font-weight: 700;
    }

    .tab-text small {
      color: #7b7168;
      font-size: var(--font-size-caption);
      line-height: 1.32;
    }

    .tab.active {
      border-color: rgba(103, 86, 67, 0.16);
      background: rgba(255, 255, 255, 0.96);
      color: #2a7cc2;
      box-shadow: 0 -1px 0 rgba(255, 255, 255, 0.96), 0 10px 18px rgba(73, 44, 24, 0.04);
    }

    .tab.active::after {
      opacity: 1;
      transform: scaleX(1);
      background: linear-gradient(90deg, rgba(42, 124, 194, 0.78) 0%, rgba(42, 124, 194, 1) 100%);
    }

    .tab.active .tab-step {
      color: #2a7cc2;
    }

    .tab.active .tab-text small {
      color: #5e86a7;
    }

    .tab.active .tab-copy {
      animation: tabLift 220ms ease;
    }

    .tab.disabled,
    .tab:disabled {
      opacity: 0.58;
      cursor: not-allowed;
    }

    .content-card {
      padding: 22px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.88);
      box-shadow: 0 16px 32px rgba(73, 44, 24, 0.04);
      animation: cardReveal 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .actions {
      padding-top: 4px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    @media (max-width: 767px) {
      .tabs {
        padding-bottom: 1px;
      }
    }

    @media (max-width: 640px) {
      .content-card {
        padding: 16px;
      }

      .tab {
        min-width: 170px;
      }

      .tab-copy {
        padding: 11px 14px 10px;
      }
    }

    @keyframes tabLift {
      from {
        transform: translateY(3px);
        opacity: 0.92;
      }

      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes workflowReveal {
      from {
        opacity: 0;
        transform: translateY(6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes cardReveal {
      from {
        opacity: 0;
        transform: translateY(8px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class EmployeeFormShellComponent {
  readonly sectionTitle = input.required<string>();
  readonly activeTab = input.required<EmployeeFormTab>();
  readonly canAccessLaborTab = input(true);
  readonly tabChange = output<EmployeeFormTab>();
}
