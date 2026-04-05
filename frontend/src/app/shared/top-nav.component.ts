import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <div class="brand">
        <div class="brand-mark">EP</div>

        <div class="brand-copy">
          <span class="brand-kicker">Ejercicio Programacion</span>
          <strong>Gestion de empleados</strong>
          <span class="brand-caption">Modulo, formularios y reportes en una sola vista de trabajo</span>
        </div>
      </div>

      <nav class="nav" aria-label="Secciones principales">
        <a
          routerLink="/employees"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Modulo
        </a>
        <a
          routerLink="/reports"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Reporte
        </a>
      </nav>
    </header>
  `,
  styles: [`
    .topbar {
      position: sticky;
      top: 12px;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 18px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 250, 244, 0.84) 100%);
      backdrop-filter: blur(12px);
      box-shadow: 0 14px 28px rgba(73, 44, 24, 0.08);
      padding: 14px 16px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }

    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 14px;
      background: linear-gradient(135deg, #3177a5 0%, #7ab8dd 100%);
      color: white;
      font-weight: 700;
      letter-spacing: 0.04em;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
      flex-shrink: 0;
    }

    .brand-copy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .brand strong {
      margin: 0;
      font-size: 1rem;
      line-height: 1.2;
    }

    .brand-kicker {
      color: var(--muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .brand-caption {
      color: var(--muted);
      font-size: 0.84rem;
      line-height: 1.25;
    }

    .nav {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .nav a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 100px;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid rgba(49, 119, 165, 0.22);
      background: rgba(197, 228, 247, 0.55);
      color: #255c80;
      text-decoration: none;
      font-weight: 600;
      transition:
        transform 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        color 160ms ease,
        box-shadow 160ms ease;
    }

    .nav a:hover {
      background: rgba(197, 228, 247, 0.82);
      border-color: rgba(49, 119, 165, 0.38);
      transform: translateY(-1px);
    }

    .nav a.is-active {
      background: linear-gradient(180deg, #3177a5 0%, #2b688f 100%);
      border-color: #2b688f;
      color: white;
      box-shadow: 0 12px 22px rgba(49, 119, 165, 0.22);
    }

    @media (max-width: 860px) {
      .topbar {
        align-items: stretch;
        flex-direction: column;
        top: 8px;
      }

      .nav {
        justify-content: stretch;
      }

      .nav a {
        flex: 1 1 0;
      }
    }

    @media (max-width: 640px) {
      .topbar {
        padding: 14px;
        border-radius: 18px;
      }

      .brand {
        align-items: flex-start;
      }

      .brand-caption {
        font-size: 0.85rem;
      }

      .brand-mark {
        width: 38px;
        height: 38px;
        border-radius: 12px;
      }

      .nav a {
        min-width: 0;
      }
    }
  `],
})
export class TopNavComponent {}
