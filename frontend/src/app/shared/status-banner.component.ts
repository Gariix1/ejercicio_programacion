import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

export type StatusBannerVariant = 'info' | 'error' | 'success';

@Component({
  selector: 'app-status-banner',
  standalone: true,
  imports: [NgClass],
  template: `
    <section
      class="status-banner"
      [ngClass]="'status-banner--' + variant()"
      [attr.role]="variant() === 'error' ? 'alert' : 'status'"
    >
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    .status-banner {
      padding: 13px 15px;
      border-radius: 12px;
      border: 1px solid transparent;
      font-size: 0.93rem;
      line-height: 1.45;
      animation: bannerEnter 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
      transition:
        transform 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease,
        border-color 180ms ease;
    }

    .status-banner--info {
      border-color: rgba(49, 119, 165, 0.18);
      background: rgba(197, 228, 247, 0.48);
      color: #255c80;
      box-shadow: inset 4px 0 0 rgba(49, 119, 165, 0.24);
    }

    .status-banner--error {
      border-color: rgba(181, 56, 56, 0.2);
      background: rgba(239, 211, 211, 0.66);
      color: #8c1f1f;
      box-shadow: inset 4px 0 0 rgba(181, 56, 56, 0.24);
    }

    .status-banner--success {
      border-color: rgba(57, 134, 83, 0.18);
      background: rgba(224, 241, 229, 0.82);
      color: #27643b;
      box-shadow: inset 4px 0 0 rgba(57, 134, 83, 0.22);
    }

    @keyframes bannerEnter {
      from {
        opacity: 0;
        transform: translateY(6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class StatusBannerComponent {
  readonly variant = input<StatusBannerVariant>('info');
}
