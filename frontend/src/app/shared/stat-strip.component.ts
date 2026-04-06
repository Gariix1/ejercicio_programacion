import { NgFor } from '@angular/common';
import { Component, input } from '@angular/core';

export interface StatStripItem {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-stat-strip',
  standalone: true,
  imports: [NgFor],
  template: `
    <section class="stat-strip d-flex align-items-stretch flex-nowrap" [attr.aria-label]="ariaLabel()">
      <article class="stat-item" *ngFor="let item of items()">
        <span class="stat-label">{{ item.label }}</span>
        <strong class="stat-value">{{ item.value }}</strong>
      </article>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 0;
    }

    .stat-strip {
      overflow-x: auto;
      overflow-y: hidden;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-radius: 14px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 248, 242, 0.36) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.24), transparent 42%);
      backdrop-filter: blur(16px) saturate(1.14);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 10px 22px rgba(73, 44, 24, 0.05);
      scrollbar-width: none;
    }

    .stat-strip::-webkit-scrollbar {
      display: none;
    }

    .stat-item {
      display: grid;
      gap: 2px;
      flex: 1 1 0;
      min-width: 0;
      padding: 8px 12px;
      align-content: center;
      background: transparent;
    }

    .stat-item:not(:last-child) {
      border-right: 1px solid rgba(255, 255, 255, 0.28);
    }

    .stat-label {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .stat-value {
      font-size: clamp(0.96rem, 1.16vw, 1.08rem);
      color: var(--text-strong);
      font-weight: 700;
      line-height: 1.1;
    }

    @media (max-width: 992px) {
      .stat-item {
        min-width: 170px;
      }
    }
  `],
})
export class StatStripComponent {
  readonly ariaLabel = input('Resumen');
  readonly items = input<readonly StatStripItem[]>([]);
}
