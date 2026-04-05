import { NgIf } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-module-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="module-header">
      <div class="module-title">{{ moduleTitle() }}</div>
      <div class="section-title" *ngIf="sectionTitle() as title">{{ title }}</div>
    </section>
  `,
  styles: [`
    .module-header {
      display: grid;
      gap: 12px;
    }

    .module-title,
    .section-title {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      padding: 12px 18px;
      border: 1px solid var(--border);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.78);
      text-align: center;
    }

    .module-title {
      font-weight: 600;
    }

    .section-title {
      background: rgba(197, 228, 247, 0.92);
      color: #3177a5;
      font-weight: 600;
      text-transform: uppercase;
    }
  `],
})
export class ModuleHeaderComponent {
  readonly moduleTitle = input<string>('Modulo de Empleados');
  readonly sectionTitle = input<string>('');
}
