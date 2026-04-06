import { NgClass } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar" [ngClass]="{ compact: isCompact() }">
      <div class="brand">
        <div class="brand-mark">EP</div>

        <div class="brand-copy">
          <span class="brand-kicker">Sistema interno</span>
          <strong>Empleados y reportes</strong>
        </div>
      </div>

      <nav class="nav" aria-label="Secciones principales">
        <a
          routerLink="/employees"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Empleados
        </a>
        <a
          routerLink="/reports"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: false }"
        >
          Reportes
        </a>
      </nav>
    </header>
  `,
  styles: [`
    :host {
      position: sticky;
      top: 12px;
      z-index: 1000;
      display: block;
    }

    .topbar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: clamp(10px, 1.6vw, 18px);
      background: linear-gradient(180deg, rgba(255, 251, 247, 0.84) 0%, rgba(255, 250, 244, 0.74) 100%);
      backdrop-filter: blur(12px);
      box-shadow: 0 8px 18px rgba(73, 44, 24, 0.05);
      padding: 10px 4px 12px;
      animation: navReveal 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
      transition:
        padding 180ms ease,
        box-shadow 180ms ease,
        background-color 180ms ease,
        border-color 180ms ease;
    }

    .topbar::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: linear-gradient(90deg, rgba(216, 195, 175, 0) 0%, rgba(216, 195, 175, 0.72) 10%, rgba(216, 195, 175, 0.72) 90%, rgba(216, 195, 175, 0) 100%);
      opacity: 0.7;
      transform: scaleX(0.985);
      transform-origin: center;
      transition:
        opacity 180ms ease,
        transform 180ms ease,
        background 180ms ease;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      flex: 1 1 auto;
    }

    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: linear-gradient(135deg, #3177a5 0%, #7ab8dd 100%);
      color: white;
      font-weight: 700;
      letter-spacing: 0.04em;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
      flex-shrink: 0;
      transition:
        width 180ms ease,
        height 180ms ease,
        border-radius 180ms ease,
        font-size 180ms ease;
    }

    .brand-copy {
      display: grid;
      gap: 1px;
      min-width: 0;
      flex: 1 1 auto;
      transition: gap 180ms ease;
    }

    .brand strong {
      margin: 0;
      font-size: clamp(0.98rem, 1.16vw, 1.06rem);
      line-height: var(--line-height-tight);
      color: var(--text-strong);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: font-size 180ms ease;
    }

    .brand-kicker {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: opacity 160ms ease, transform 180ms ease;
    }

    .nav {
      display: flex;
      gap: 6px;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
      flex: 0 0 auto;
      min-width: 0;
    }

    .nav a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      padding: clamp(6px, 0.95vw, 7px) clamp(12px, 1.5vw, 14px);
      border-radius: 999px;
      border: 1px solid rgba(49, 119, 165, 0.22);
      background: rgba(197, 228, 247, 0.46);
      color: #255c80;
      text-decoration: none;
      font-weight: 600;
      font-size: clamp(0.88rem, 0.92vw, 0.96rem);
      white-space: nowrap;
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
      box-shadow: 0 8px 16px rgba(49, 119, 165, 0.18);
    }

    .topbar.compact {
      padding: 8px 2px 9px;
      background: linear-gradient(180deg, rgba(255, 251, 247, 0.9) 0%, rgba(255, 250, 244, 0.82) 100%);
      box-shadow: 0 6px 14px rgba(73, 44, 24, 0.05);
    }

    .topbar.compact::after {
      opacity: 0.96;
      transform: scaleX(1);
      background: linear-gradient(90deg, rgba(49, 119, 165, 0) 0%, rgba(49, 119, 165, 0.28) 10%, rgba(49, 119, 165, 0.28) 90%, rgba(49, 119, 165, 0) 100%);
    }

    .topbar.compact .brand-mark {
      width: 32px;
      height: 32px;
      border-radius: 11px;
      font-size: 0.86rem;
    }

    .topbar.compact .brand strong {
      font-size: 0.95rem;
    }

    .topbar.compact .brand-kicker {
      opacity: 0;
      max-height: 0;
      overflow: hidden;
      transform: translateY(-1px);
    }

    @media (max-width: 640px) {
      :host {
        top: 8px;
      }

      .topbar {
        padding: 9px 0 10px;
      }

      .brand {
        gap: 10px;
      }

      .brand-mark {
        width: 36px;
        height: 36px;
        border-radius: 12px;
      }

      .brand strong {
        font-size: 0.94rem;
      }

      .nav {
        gap: 6px;
      }

      .nav a {
        padding: 6px 10px;
        font-size: 0.86rem;
      }

      .topbar.compact {
        padding: 8px 0 9px;
      }
    }

    @media (max-width: 480px) {
      .topbar {
        gap: 8px;
        padding: 8px 0 9px;
      }

      .brand {
        gap: 8px;
      }

      .brand-mark {
        width: 34px;
        height: 34px;
        border-radius: 11px;
        font-size: 0.84rem;
      }

      .brand strong {
        font-size: 0.88rem;
      }

      .nav a {
        padding: 6px 9px;
        font-size: 0.82rem;
      }
    }

    @keyframes navReveal {
      from {
        opacity: 0;
        transform: translateY(-8px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class TopNavComponent {
  protected readonly isCompact = signal(false);

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.isCompact.set(window.scrollY > 24);
  }
}
