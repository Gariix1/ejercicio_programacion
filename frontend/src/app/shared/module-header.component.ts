import { NgIf } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-module-header',
  standalone: true,
  imports: [NgIf],
  template: `
    <header class="page-header">
      <div class="page-copy">
        <span class="page-kicker" *ngIf="resolvedKicker() as kicker">{{ kicker }}</span>
        <strong class="page-title">{{ resolvedTitle() }}</strong>
        <p class="page-subtitle" *ngIf="subtitle() as copy">{{ copy }}</p>
      </div>
    </header>
  `,
  styles: [`
    .page-header {
      display: grid;
      gap: 10px;
      padding: 4px 2px 14px;
      border-bottom: 1px solid rgba(216, 195, 175, 0.72);
    }

    .page-copy {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .page-kicker {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      line-height: 1.2;
    }

    .page-title {
      margin: 0;
      font-size: clamp(1.38rem, 2vw, 1.8rem);
      font-weight: 700;
      line-height: 1.08;
      color: var(--text-strong);
      text-wrap: balance;
    }

    .page-subtitle {
      margin: 0;
      max-width: 720px;
      color: var(--muted);
      font-size: var(--font-size-caption);
      line-height: 1.5;
    }

    @media (max-width: 640px) {
      .page-header {
        gap: 8px;
        padding-bottom: 12px;
      }

      .page-title {
        font-size: 1.28rem;
      }
    }
  `],
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
