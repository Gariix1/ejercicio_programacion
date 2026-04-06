import { NgClass } from '@angular/common';
import { Component, ElementRef, inject, input, output } from '@angular/core';
import { EmployeeFormTab } from '../forms/employee-form';
import { ModuleHeaderComponent } from '../../../shared/module-header.component';

@Component({
  selector: 'app-employee-form-shell',
  standalone: true,
  imports: [NgClass, ModuleHeaderComponent],
  template: `
    <section class="form-page d-grid">
      <app-module-header
        moduleTitle="Empleados"
        [sectionTitle]="sectionTitle()"
      ></app-module-header>

      <section class="tabs-region">
        <nav class="tabs d-flex align-items-end" role="tablist" aria-label="Secciones del formulario">
          <button
            type="button"
            role="tab"
            [id]="tabId('personal')"
            class="tab"
            [attr.aria-controls]="panelId"
            [attr.aria-selected]="activeTab() === 'personal'"
            [attr.tabindex]="activeTab() === 'personal' ? 0 : -1"
            [ngClass]="{ active: activeTab() === 'personal' }"
            (click)="tabChange.emit('personal')"
            (keydown)="onTabKeydown($event, 'personal')"
          >
            <span class="tab-copy">
              <span class="tab-text">
                <strong>Datos personales</strong>
                <small>Identidad y contacto</small>
              </span>
            </span>
          </button>

          <button
            type="button"
            role="tab"
            [id]="tabId('labor')"
            class="tab"
            [attr.aria-controls]="panelId"
            [attr.aria-selected]="activeTab() === 'labor'"
            [attr.tabindex]="activeTab() === 'labor' ? 0 : -1"
            [ngClass]="{ active: activeTab() === 'labor' }"
            (click)="tabChange.emit('labor')"
            (keydown)="onTabKeydown($event, 'labor')"
          >
            <span class="tab-copy">
              <span class="tab-text">
                <strong>Datos laborales</strong>
                <small>Cargo y condiciones</small>
              </span>
            </span>
          </button>
        </nav>
      </section>

      <section
        class="content-region"
        role="tabpanel"
        [id]="panelId"
        [attr.aria-labelledby]="tabId(activeTab())"
      >
        <ng-content></ng-content>
      </section>

      <footer class="actions d-flex justify-content-center flex-wrap">
        <ng-content select="[form-actions]"></ng-content>
      </footer>
    </section>
  `,
  styles: [`
    .form-page { gap: 0; }

    app-module-header {
      display: block;
      margin-bottom: 6px;
    }

    .tabs-region {
      position: relative;
      z-index: 2;
      margin-top: -2px;
      margin-bottom: -1px;
      animation: workflowReveal 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .tabs {
      position: relative;
      gap: 0;
      overflow-x: auto;
      overflow-y: hidden;
      padding-inline: 0;
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
      padding: 10px 18px 9px;
      min-width: 0;
    }

    .tab-text {
      display: grid;
      gap: 2px;
      min-width: 0;
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

    .tab.active .tab-text small {
      color: #5e86a7;
    }

    .tab.active .tab-copy {
      animation: tabLift 220ms ease;
    }

    .content-region {
      margin-top: 0;
      animation: cardReveal 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .actions {
      padding-top: 10px;
      gap: 12px;
    }

    @media (max-width: 767px) {
      .tabs {
        padding-bottom: 1px;
      }
    }

    @media (max-width: 640px) {
      .tab {
        min-width: 170px;
      }

      .tab-copy {
        padding: 9px 14px 8px;
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
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly sectionTitle = input.required<string>();
  readonly activeTab = input.required<EmployeeFormTab>();
  readonly tabChange = output<EmployeeFormTab>();
  protected readonly panelId = 'employee-form-tabpanel';

  protected tabId(tab: EmployeeFormTab): string {
    return `employee-form-tab-${tab}`;
  }

  protected onTabKeydown(event: KeyboardEvent, currentTab: EmployeeFormTab): void {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        this.activateAndFocus(currentTab === 'personal' ? 'labor' : 'personal');
        break;
      case 'Home':
        event.preventDefault();
        this.activateAndFocus('personal');
        break;
      case 'End':
        event.preventDefault();
        this.activateAndFocus('labor');
        break;
    }
  }

  private activateAndFocus(tab: EmployeeFormTab): void {
    this.tabChange.emit(tab);
    queueMicrotask(() => {
      this.hostElement.nativeElement.querySelector<HTMLButtonElement>(`#${this.tabId(tab)}`)?.focus();
    });
  }
}
