import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

export type StatusBannerVariant = 'info' | 'error' | 'success';

@Component({
  selector: 'app-status-banner',
  standalone: true,
  imports: [NgClass],
  template: `
    <section
      class="app-status-banner"
      [ngClass]="'app-status-banner--' + variant()"
      [attr.role]="variant() === 'error' ? 'alert' : 'status'"
    >
      <ng-content></ng-content>
    </section>
  `,
})
export class StatusBannerComponent {
  readonly variant = input<StatusBannerVariant>('info');
}
