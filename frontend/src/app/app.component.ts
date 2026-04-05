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
      max-width: 1680px;
      margin: 0 auto;
      padding: 24px 20px 48px;
    }

    .content {
      padding-top: 24px;
    }

    @media (max-width: 640px) {
      .app-shell {
        padding-inline: 14px;
      }
    }
  `],
})
export class AppComponent {}
