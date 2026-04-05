import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <main class="app-shell">
      <header class="topbar">
        <div class="brand">
          <span class="brand-kicker">Ejercicio Programacion</span>
          <strong>Modulo de empleados</strong>
        </div>

        <nav class="nav">
          <a routerLink="/employees">Modulo</a>
          <a routerLink="/reports">Reporte</a>
        </nav>
      </header>

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

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.82);
      padding: 16px 18px;
    }

    .brand {
      display: grid;
      gap: 2px;
    }

    .brand strong {
      margin: 0;
      font-size: 1rem;
    }

    .brand-kicker {
      color: var(--muted);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .nav {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .nav a {
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid rgba(49, 119, 165, 0.2);
      background: rgba(197, 228, 247, 0.72);
      color: #255c80;
      text-decoration: none;
      font-weight: 600;
    }

    .content {
      padding-top: 24px;
    }

    @media (max-width: 640px) {
      .topbar {
        align-items: stretch;
        flex-direction: column;
      }
    }
  `],
})
export class AppComponent {}
