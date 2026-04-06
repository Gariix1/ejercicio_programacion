import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [NgClass],
  template: `
    <section class="action-bar d-flex flex-wrap" [ngClass]="alignmentClass()">
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
    .action-bar {
      gap: 12px;
    }

    .action-bar.justify-content-end {
      width: 100%;
    }
  `],
})
export class ActionBarComponent {
  readonly align = input<'start' | 'center' | 'end'>('center');

  protected readonly alignmentClass = computed(() => {
    switch (this.align()) {
      case 'start':
        return 'justify-content-start';
      case 'end':
        return 'justify-content-end';
      case 'center':
      default:
        return 'justify-content-center';
    }
  });
}
