import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/top-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  template: `
    <main class="app-shell">
      <app-top-nav></app-top-nav>

      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: [`
    .app-shell {
      width: min(100%, var(--shell-max));
      margin: 0 auto;
      padding: var(--page-padding-y) var(--page-padding-x) 48px;
    }

    .content {
      padding-top: clamp(18px, 2vw, 24px);
    }
  `],
})
export class AppComponent {}
