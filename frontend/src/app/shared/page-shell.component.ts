import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-shell',
  standalone: true,
  template: `
    <section class="page-shell">
      <div class="header">
        <p class="kicker">{{ kicker() }}</p>
        <h2>{{ title() }}</h2>
        <p class="description">{{ description() }}</p>
      </div>
      <ng-content></ng-content>
    </section>
  `,
  styles: [`
    .page-shell {
      display: grid;
      gap: 20px;
    }

    .header {
      background: rgba(255, 250, 244, 0.92);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 24px;
    }

    .kicker {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    h2 {
      margin: 0 0 8px;
    }

    .description {
      margin: 0;
      color: var(--muted);
    }
  `],
})
export class PageShellComponent {
  readonly title = input.required<string>();
  readonly description = input<string>('');
  readonly kicker = input<string>('Feature');
}
