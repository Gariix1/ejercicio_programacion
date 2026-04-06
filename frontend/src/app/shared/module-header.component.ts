import { NgIf } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-module-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <header class="app-page-header">
      <div class="app-page-copy">
        <span class="app-page-kicker" *ngIf="resolvedKicker() as kicker">{{ kicker }}</span>
        <strong class="app-page-title">{{ resolvedTitle() }}</strong>
        <p class="app-page-subtitle" *ngIf="subtitle() as copy">{{ copy }}</p>
      </div>
    </header>
  `,
})
export class ModuleHeaderComponent {
  readonly moduleTitle = input<string>('Modulo de Empleados');
  readonly sectionTitle = input<string>('');
  readonly subtitle = input<string>('');

  protected readonly resolvedTitle = computed(() => {
    const section = this.sectionTitle().trim();
    const module = this.moduleTitle().trim();

    return section || module;
  });

  protected readonly resolvedKicker = computed(() => {
    const section = this.sectionTitle().trim();
    const module = this.moduleTitle().trim();

    return section && section !== module ? module : '';
  });
}
