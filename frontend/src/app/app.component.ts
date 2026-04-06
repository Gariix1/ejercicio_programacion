import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavComponent } from './shared/top-nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TopNavComponent],
  template: `
    <main class="app-shell">
      <div class="top-nav-frame">
        <app-top-nav></app-top-nav>
      </div>

      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      --top-nav-offset: 12px;
      --top-nav-reserve: clamp(68px, 8vw, 80px);
      --mobile-bottom-nav-reserve: 0px;
    }

    .app-shell {
      width: min(100%, var(--shell-max));
      margin: 0 auto;
      padding: 0 var(--page-padding-x) 48px;
    }

    .top-nav-frame {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      padding: var(--top-nav-offset) var(--page-padding-x) 0;
      pointer-events: none;
    }

    .top-nav-frame app-top-nav {
      display: block;
      width: min(100%, calc(var(--shell-max) - (var(--page-padding-x) * 2)));
      margin: 0 auto;
      pointer-events: auto;
    }

    .content {
      padding-top: calc(var(--top-nav-offset) + var(--top-nav-reserve) + 12px);
      padding-bottom: calc(var(--mobile-bottom-nav-reserve) + env(safe-area-inset-bottom, 0px));
    }

    @media (max-width: 640px) {
      :host {
        --top-nav-offset: 8px;
        --top-nav-reserve: 70px;
        --mobile-bottom-nav-reserve: 94px;
      }
    }

    @media (max-width: 480px) {
      :host {
        --top-nav-reserve: 66px;
        --mobile-bottom-nav-reserve: 90px;
      }
    }
  `],
})
export class AppComponent {}
