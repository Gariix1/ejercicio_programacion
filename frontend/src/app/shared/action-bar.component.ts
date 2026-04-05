import { Component } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  standalone: true,
  template: `
    <section class="action-bar">
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
  `],
})
export class ActionBarComponent {}
