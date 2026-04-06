import { ElementRef, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

interface ModuleNavItem {
  label: string;
  href?: string;
  status?: 'available' | 'upcoming';
  description?: string;
}

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar d-flex align-items-center justify-content-between" [ngClass]="{ compact: isCompact() }">
      <div class="brand d-flex align-items-center flex-grow-1">
        <div class="brand-mark">EP</div>

        <div class="brand-copy">
          <span class="brand-kicker">Sistema interno</span>
          <strong>Empleados y reportes</strong>
        </div>
      </div>

      <nav class="nav d-flex align-items-center justify-content-end flex-nowrap" aria-label="Secciones principales">
        <div
          class="nav-dropdown d-flex align-items-center"
          [class.is-open]="isModulesMenuOpen()"
          (mouseenter)="onModulesPointerEnter()"
          (mouseleave)="onModulesPointerLeave()"
        >
          <button
            type="button"
            class="nav-trigger"
            id="top-nav-modules-trigger"
            [ngClass]="{ 'is-active': isModulesActive() }"
            [attr.aria-expanded]="isModulesMenuOpen()"
            [attr.aria-controls]="modulesMenuId"
            (click)="toggleModulesMenu($event)"
          >
            <span>Modulos</span>
            <span class="nav-caret" aria-hidden="true"></span>
          </button>

          <div class="nav-menu" *ngIf="isModulesMenuOpen()" [id]="modulesMenuId" aria-labelledby="top-nav-modules-trigger">
            <ng-container *ngFor="let item of moduleItems">
              <a
                *ngIf="item.href; else upcomingModule"
                class="nav-menu-item"
                [ngClass]="{ 'is-active': isModuleItemActive(item.href) }"
                [routerLink]="item.href"
                (click)="closeModulesMenu()"
              >
                <span class="nav-menu-copy">
                  <strong>{{ item.label }}</strong>
                  <small *ngIf="item.description">{{ item.description }}</small>
                </span>
              </a>

              <ng-template #upcomingModule>
                <button type="button" class="nav-menu-item nav-menu-item--upcoming" disabled>
                  <span class="nav-menu-copy">
                    <strong>{{ item.label }}</strong>
                    <small *ngIf="item.description">{{ item.description }}</small>
                  </span>
                  <span class="nav-menu-status app-status-pill app-status-pill--warning">Proximamente</span>
                </button>
              </ng-template>
            </ng-container>
          </div>
        </div>

        <a
          class="nav-link"
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
      --nav-soft-active-bg: rgba(210, 233, 248, 0.48);
      --nav-soft-active-border: rgba(255, 255, 255, 0.34);
      --nav-soft-active-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.54),
        0 8px 16px rgba(49, 119, 165, 0.08);
    }

    .topbar {
      position: relative;
      gap: clamp(10px, 1.6vw, 18px);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(255, 248, 242, 0.34) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.24), transparent 42%);
      backdrop-filter: blur(20px) saturate(1.18);
      box-shadow: 0 14px 28px rgba(73, 44, 24, 0.05), 0 8px 18px rgba(49, 119, 165, 0.05);
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
      background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.44) 10%, rgba(255, 255, 255, 0.44) 90%, rgba(255, 255, 255, 0) 100%);
      opacity: 0.9;
      transform: scaleX(0.985);
      transform-origin: center;
      transition:
        opacity 180ms ease,
        transform 180ms ease,
        background 180ms ease;
    }

    .brand {
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
      gap: 6px;
      flex: 0 0 auto;
      min-width: 0;
    }

    .nav-dropdown {
      position: relative;
    }

    .nav-dropdown.is-open::after {
      content: '';
      position: absolute;
      top: 100%;
      right: -12px;
      width: 280px;
      max-width: calc(100vw - 24px);
      height: 14px;
    }

    .nav-link,
    .nav-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      padding: clamp(6px, 0.95vw, 7px) clamp(12px, 1.5vw, 14px);
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.34);
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(14px) saturate(1.16);
      color: #255c80;
      text-decoration: none;
      font-weight: 600;
      font-size: clamp(0.88rem, 0.92vw, 0.96rem);
      white-space: nowrap;
      cursor: pointer;
      transition:
        transform 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        color 160ms ease,
        box-shadow 160ms ease;
    }

    .nav-trigger {
      gap: 8px;
      appearance: none;
    }

    .nav-link:hover,
    .nav-trigger:hover {
      background: rgba(214, 235, 248, 0.4);
      border-color: rgba(255, 255, 255, 0.42);
      transform: translateY(-1px);
    }

    .nav-link.is-active,
    .nav-trigger.is-active {
      background: var(--nav-soft-active-bg);
      border-color: var(--nav-soft-active-border);
      color: #255c80;
      box-shadow: var(--nav-soft-active-shadow);
    }

    .nav-caret {
      width: 9px;
      height: 9px;
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: rotate(45deg) translateY(-1px);
      transition: transform 180ms ease;
      opacity: 0.82;
    }

    .nav-dropdown.is-open .nav-caret {
      transform: rotate(-135deg) translateX(1px);
    }

    .nav-menu {
      position: absolute;
      top: calc(100% + 6px);
      right: 0;
      min-width: 248px;
      display: grid;
      gap: 6px;
      padding: 10px;
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(255, 248, 242, 0.54) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.34), transparent 44%);
      backdrop-filter: blur(28px) saturate(1.18);
      box-shadow:
        0 24px 40px rgba(73, 44, 24, 0.1),
        0 14px 26px rgba(49, 119, 165, 0.08);
      animation: dropdownReveal 180ms ease both;
    }

    .nav-menu-item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid transparent;
      border-radius: 10px;
      background: transparent;
      color: var(--text-strong);
      text-decoration: none;
      text-align: left;
      transition:
        background-color 160ms ease,
        border-color 160ms ease,
        transform 160ms ease,
        box-shadow 160ms ease;
    }

    .nav-menu-item:hover {
      background: rgba(214, 235, 248, 0.34);
      border-color: rgba(255, 255, 255, 0.34);
      transform: translateY(-1px);
      box-shadow: 0 10px 18px rgba(49, 119, 165, 0.05);
    }

    .nav-menu-item.is-active {
      background: var(--nav-soft-active-bg);
      border-color: var(--nav-soft-active-border);
      color: #255c80;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.48),
        0 8px 16px rgba(49, 119, 165, 0.05);
    }

    .nav-menu-item.is-active .nav-menu-copy strong {
      color: inherit;
    }

    .nav-menu-item.is-active .nav-menu-copy small {
      color: var(--muted);
    }

    .nav-menu-item--upcoming {
      opacity: 0.82;
      cursor: default;
    }

    .nav-menu-item--upcoming:hover {
      transform: none;
      background: rgba(255, 247, 239, 0.78);
      border-color: rgba(166, 111, 63, 0.14);
      box-shadow: none;
    }

    .nav-menu-copy {
      display: grid;
      gap: 2px;
      min-width: 0;
    }

    .nav-menu-copy strong {
      font-size: 0.92rem;
      line-height: 1.15;
      font-weight: 700;
    }

    .nav-menu-copy small {
      color: var(--muted);
      font-size: 0.79rem;
      line-height: 1.35;
    }

    .nav-menu-status {
      flex: 0 0 auto;
      min-height: auto;
      padding: 4px 8px;
      font-size: 0.72rem;
      letter-spacing: 0.04em;
    }

    .topbar.compact {
      padding: 8px 2px 9px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.58) 0%, rgba(255, 248, 242, 0.42) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.22), transparent 40%);
      box-shadow: 0 10px 18px rgba(73, 44, 24, 0.04), 0 6px 14px rgba(49, 119, 165, 0.04);
    }

    .topbar.compact::after {
      opacity: 0.96;
      transform: scaleX(1);
      background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(210, 233, 248, 0.38) 10%, rgba(210, 233, 248, 0.38) 90%, rgba(255, 255, 255, 0) 100%);
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

      .nav-link {
        padding: 6px 10px;
        font-size: 0.86rem;
      }

      .nav-trigger {
        padding: 6px 10px;
        font-size: 0.86rem;
      }

      .nav-menu {
        right: auto;
        left: 0;
        min-width: min(260px, calc(100vw - 32px));
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

      .nav-link {
        padding: 6px 9px;
        font-size: 0.82rem;
      }

      .nav-trigger {
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

    @keyframes dropdownReveal {
      from {
        opacity: 0;
        transform: translateY(-6px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `],
})
export class TopNavComponent {
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private readonly supportsHover =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  private closeModulesMenuTimer: ReturnType<typeof setTimeout> | null = null;
  private modulesMenuPinned = false;

  protected readonly isCompact = signal(false);
  protected readonly isModulesMenuOpen = signal(false);
  protected readonly modulesMenuId = 'top-nav-modules-menu';
  protected readonly moduleItems: ModuleNavItem[] = [
    {
      label: 'Empleados',
      href: '/employees',
      status: 'available',
      description: 'Gestion de empleados y formularios',
    },
    {
      label: 'Nomina',
      status: 'upcoming',
      description: 'Proximo modulo financiero',
    },
    {
      label: 'Asistencia',
      status: 'upcoming',
      description: 'Proximo modulo operativo',
    },
  ];

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    this.isCompact.set(window.scrollY > 24);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: Event): void {
    if (!this.hostElement.nativeElement.contains(event.target as Node)) {
      this.closeModulesMenu();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscapeKey(): void {
    this.closeModulesMenu();
  }

  protected toggleModulesMenu(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.cancelCloseModulesMenu();

    if (this.isModulesMenuOpen() && this.modulesMenuPinned) {
      this.closeModulesMenu();

      return;
    }

    this.modulesMenuPinned = true;
    this.isModulesMenuOpen.set(true);
  }

  protected onModulesPointerEnter(): void {
    if (!this.supportsHover) {
      return;
    }

    this.cancelCloseModulesMenu();

    if (!this.modulesMenuPinned) {
      this.openModulesMenu();
    }
  }

  protected onModulesPointerLeave(): void {
    if (!this.supportsHover || this.modulesMenuPinned) {
      return;
    }

    this.scheduleCloseModulesMenu();
  }

  protected openModulesMenu(): void {
    this.cancelCloseModulesMenu();
    this.isModulesMenuOpen.set(true);
  }

  protected closeModulesMenu(): void {
    this.cancelCloseModulesMenu();
    this.modulesMenuPinned = false;
    this.isModulesMenuOpen.set(false);
  }

  protected isModulesActive(): boolean {
    return this.moduleItems.some((item) => item.href && this.isModuleItemActive(item.href));
  }

  protected isModuleItemActive(href: string): boolean {
    return this.router.url.startsWith(href);
  }

  private scheduleCloseModulesMenu(): void {
    this.cancelCloseModulesMenu();
    this.closeModulesMenuTimer = setTimeout(() => {
      this.modulesMenuPinned = false;
      this.isModulesMenuOpen.set(false);
      this.closeModulesMenuTimer = null;
    }, 120);
  }

  private cancelCloseModulesMenu(): void {
    if (this.closeModulesMenuTimer !== null) {
      clearTimeout(this.closeModulesMenuTimer);
      this.closeModulesMenuTimer = null;
    }
  }
}
