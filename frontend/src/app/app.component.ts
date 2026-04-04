import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <main class="app-shell">
      <header class="hero">
        <p class="eyebrow">MVC modular + API</p>
        <h1>Gestion de empleados y provincias</h1>
        <p class="lead">
          Frontend organizado por features y preparado para consumir el backend REST en PHP.
        </p>
        <nav class="nav">
          <a routerLink="/employees">Empleados</a>
        </nav>
      </header>

      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styles: [`
    .app-shell {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px 20px 48px;
    }

    .hero {
      background: linear-gradient(135deg, rgba(239, 226, 209, 0.92), rgba(255, 250, 244, 0.96));
      border: 1px solid var(--border);
      border-radius: 28px;
      box-shadow: var(--shadow);
      padding: 32px;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: var(--accent-strong);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 5vw, 3.6rem);
      line-height: 0.98;
    }

    .lead {
      max-width: 62ch;
      color: var(--muted);
      font-size: 1.05rem;
    }

    .nav {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .nav a {
      padding: 10px 16px;
      border-radius: 999px;
      background: var(--accent);
      color: white;
      text-decoration: none;
      font-weight: 600;
    }

    .content {
      padding-top: 24px;
    }
  `],
})
export class AppComponent {}
