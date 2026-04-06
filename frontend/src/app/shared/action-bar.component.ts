import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  imports: [NgClass],
  template: `
    <section class="action-bar" [ngClass]="'action-bar--' + align()">
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
    .action-bar {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .action-bar--start {
      justify-content: flex-start;
    }

    .action-bar--end {
      justify-content: flex-end;
    }
  `],
})
export class ActionBarComponent {
  readonly align = input<'start' | 'center' | 'end'>('center');
}
