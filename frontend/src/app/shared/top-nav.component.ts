import { DestroyRef, ElementRef, inject } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

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
          <strong>{{ brandTitle() }}</strong>
        </div>
      </div>

      <nav class="nav nav--desktop d-flex align-items-center justify-content-end flex-nowrap" aria-label="Secciones principales">
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
          (click)="closeModulesMenu()"
        >
          Reportes
        </a>
      </nav>
    </header>

    <nav
      class="mobile-bottom-nav"
      [class.is-condensed]="isMobileNavCondensed()"
      aria-label="Navegacion movil principal"
    >
      <button
        type="button"
        class="mobile-bottom-item"
        [ngClass]="{
          'is-active': isModulesActive(),
          'is-open': isModulesMenuOpen() && !isModulesActive()
        }"
        [attr.aria-expanded]="isModulesMenuOpen()"
        [attr.aria-controls]="mobileModulesSheetId"
        (click)="toggleModulesMenu($event)"
      >
        <span class="mobile-bottom-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <rect x="4" y="4" width="6" height="6" rx="2"></rect>
            <rect x="14" y="4" width="6" height="6" rx="2"></rect>
            <rect x="4" y="14" width="6" height="6" rx="2"></rect>
            <rect x="14" y="14" width="6" height="6" rx="2"></rect>
          </svg>
        </span>
        <span class="mobile-bottom-label">Modulos</span>
      </button>

      <a
        class="mobile-bottom-item"
        routerLink="/reports"
        routerLinkActive="is-active"
        [routerLinkActiveOptions]="{ exact: false }"
        (click)="closeModulesMenu()"
      >
        <span class="mobile-bottom-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M5 18h14"></path>
            <path d="M7 16V9"></path>
            <path d="M12 16V6"></path>
            <path d="M17 16v-4"></path>
          </svg>
        </span>
        <span class="mobile-bottom-label">Reportes</span>
      </a>
    </nav>

    <div
      class="mobile-sheet-backdrop"
      *ngIf="isMobileLayout() && isModulesMenuOpen()"
      [style.background]="'rgba(18, 28, 38, ' + mobileSheetBackdropOpacity() + ')'"
      (click)="onMobileSheetBackdropClick($event)"
    >
      <section
        class="mobile-sheet"
        role="dialog"
        aria-modal="true"
        [id]="mobileModulesSheetId"
        aria-labelledby="top-nav-mobile-modules-title"
        [class.is-dragging]="isMobileSheetDragging()"
        [class.is-closing]="isMobileSheetClosing()"
        [style.transform]="'translateY(' + mobileSheetDragOffset() + 'px)'"
        >
        <span
          class="mobile-sheet-handle"
          aria-hidden="true"
          (pointerdown)="onMobileSheetDragStart($event)"
          (click)="onMobileSheetHandleClick($event)"
        ></span>

        <header class="mobile-sheet-header" (pointerdown)="onMobileSheetDragStart($event)">
          <span class="mobile-sheet-kicker">Modulos</span>
          <strong id="top-nav-mobile-modules-title">Explora las secciones del sistema</strong>
        </header>

        <div class="mobile-sheet-list">
          <ng-container *ngFor="let item of moduleItems">
            <a
              *ngIf="item.href; else mobileUpcomingModule"
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

            <ng-template #mobileUpcomingModule>
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
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      isolation: isolate;
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

    .nav--desktop {
      display: inline-flex;
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
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.38);
      border-radius: 18px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.94) 10%, rgba(250, 246, 241, 0.74) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.34), transparent 35%),
        rgba(246, 250, 253, 0.48);
      backdrop-filter: blur(36px) saturate(1.22);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.38),
        0 24px 42px rgba(73, 44, 24, 0.1),
        0 16px 28px rgba(49, 119, 165, 0.08);
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

    .mobile-bottom-nav,
    .mobile-sheet-backdrop {
      display: none;
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
      .nav--desktop {
        display: none !important;
      }

      .topbar {
        gap: 10px;
        padding: 8px 2px 9px;
        border-radius: 22px;
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
        font-size: 0.92rem;
      }

      .brand-kicker {
        display: none;
      }

      .topbar.compact {
        padding: 8px 0 9px;
      }

      .mobile-bottom-nav {
        position: fixed;
        left: 50%;
        bottom: calc(10px + env(safe-area-inset-bottom, 0px));
        z-index: 1010;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        width: min(calc(100vw - 16px), 420px);
        padding: 8px;
        border: 1px solid rgba(255, 255, 255, 0.38);
        border-radius: 26px;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.76) 0%, rgba(250, 246, 241, 0.56) 100%),
          radial-gradient(circle at top left, rgba(255, 255, 255, 0.34), transparent 44%),
          rgba(246, 250, 253, 0.5);
        backdrop-filter: blur(30px) saturate(1.18);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.36),
          0 18px 34px rgba(73, 44, 24, 0.1),
          0 10px 20px rgba(49, 119, 165, 0.08);
        transform: translateX(-50%);
        animation: mobileDockReveal 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
        transition:
          padding 180ms ease,
          gap 180ms ease,
          border-radius 180ms ease,
          background-color 180ms ease,
          box-shadow 180ms ease;
      }

      .mobile-bottom-nav.is-condensed {
        gap: 4px;
        padding: 6px;
        border-radius: 22px;
      }

      .mobile-bottom-item {
        min-width: 0;
        min-height: 56px;
        display: grid;
        gap: 5px;
        align-content: center;
        justify-items: center;
        padding: 9px 12px 10px;
        border: 1px solid rgba(255, 255, 255, 0.18);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.14);
        color: #386987;
        text-decoration: none;
        text-align: center;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          transform 160ms ease,
          box-shadow 160ms ease,
          color 160ms ease,
          min-height 180ms ease,
          padding 180ms ease;
        -webkit-tap-highlight-color: transparent;
      }

      .mobile-bottom-item:active {
        transform: scale(0.975);
      }

      .mobile-bottom-nav.is-condensed .mobile-bottom-item {
        min-height: 44px;
        padding: 8px 10px;
      }

      .mobile-bottom-icon {
        width: 24px;
        height: 24px;
        display: inline-grid;
        place-items: center;
        color: currentColor;
        transition: transform 180ms ease;
      }

      .mobile-bottom-icon svg {
        width: 20px;
        height: 20px;
        overflow: visible;
      }

      .mobile-bottom-icon rect,
      .mobile-bottom-icon path {
        fill: none;
        stroke: currentColor;
        stroke-width: 1.9;
        stroke-linecap: round;
        stroke-linejoin: round;
      }

      .mobile-bottom-item.is-active {
        background: var(--nav-soft-active-bg);
        border-color: var(--nav-soft-active-border);
        color: #255c80;
        box-shadow: var(--nav-soft-active-shadow);
      }

      .mobile-bottom-item.is-open {
        background: rgba(255, 255, 255, 0.28);
        border-color: rgba(255, 255, 255, 0.3);
        color: #255c80;
      }

      .mobile-bottom-label {
        font-size: 0.84rem;
        font-weight: 700;
        line-height: 1.1;
        transition:
          opacity 160ms ease,
          transform 180ms ease,
          max-height 180ms ease;
      }

      .mobile-bottom-nav.is-condensed .mobile-bottom-label {
        opacity: 0;
        max-height: 0;
        overflow: hidden;
        transform: translateY(4px);
      }

      .mobile-bottom-nav.is-condensed .mobile-bottom-icon {
        transform: scale(1.04);
      }

      .mobile-sheet-backdrop {
        position: fixed;
        inset: 0;
        z-index: 1005;
        display: grid;
        align-items: end;
        justify-items: center;
        padding: 0 12px calc(92px + env(safe-area-inset-bottom, 0px));
        background: rgba(18, 28, 38, 0.16);
        backdrop-filter: blur(12px) saturate(1.08);
        animation: mobileSheetBackdropIn 200ms cubic-bezier(0.22, 1, 0.36, 1) both;
        transition: opacity 160ms ease;
        overscroll-behavior: contain;
        touch-action: none;
      }

      .mobile-sheet {
        width: min(100%, 420px);
        max-height: min(68vh, 540px);
        display: grid;
        gap: 12px;
        padding: 12px;
        overflow: auto;
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.38);
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(250, 246, 241, 0.58) 100%),
          radial-gradient(circle at top left, rgba(255, 255, 255, 0.36), transparent 44%),
          rgba(246, 250, 253, 0.56);
        backdrop-filter: blur(32px) saturate(1.2);
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.38),
          0 26px 44px rgba(73, 44, 24, 0.14),
          0 14px 28px rgba(49, 119, 165, 0.1);
        -webkit-overflow-scrolling: touch;
        animation: mobileSheetReveal 240ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
        transition:
          transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 180ms ease;
        will-change: transform;
        overscroll-behavior: contain;
        touch-action: pan-y;
      }

      .mobile-sheet.is-dragging {
        transition: none;
        box-shadow:
          inset 0 1px 0 rgba(255, 255, 255, 0.32),
          0 18px 28px rgba(73, 44, 24, 0.1),
          0 10px 18px rgba(49, 119, 165, 0.08);
      }

      .mobile-sheet.is-closing {
        pointer-events: none;
        opacity: 0.98;
      }

      .mobile-sheet-handle {
        width: 52px;
        height: 5px;
        justify-self: center;
        border-radius: 999px;
        background: rgba(37, 92, 128, 0.2);
        touch-action: none;
        cursor: grab;
        transition:
          transform 140ms ease,
          background-color 140ms ease,
        opacity 140ms ease;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
      }

      .mobile-sheet-handle:active,
      .mobile-sheet.is-dragging .mobile-sheet-handle {
        transform: scaleX(1.08);
        background: rgba(37, 92, 128, 0.3);
      }

      .mobile-sheet-header {
        display: grid;
        gap: 4px;
        padding: 2px 4px 0;
        touch-action: none;
        cursor: grab;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        transition: transform 140ms ease, opacity 140ms ease;
      }

      .mobile-sheet-header:active,
      .mobile-sheet.is-dragging .mobile-sheet-header {
        transform: translateY(1px);
      }

      .mobile-sheet-kicker {
        color: var(--text-soft);
        font-size: var(--font-size-kicker);
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }

      .mobile-sheet-header strong {
        color: var(--text-strong);
        font-size: 1rem;
        line-height: 1.18;
      }

      .mobile-sheet-list {
        display: grid;
        gap: 8px;
      }

      .mobile-sheet .nav-menu-item {
        padding: 14px 16px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.3);
        animation: mobileSheetItemReveal 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        -webkit-tap-highlight-color: transparent;
      }

      .mobile-sheet .nav-menu-item:active {
        transform: scale(0.986);
        background: rgba(214, 235, 248, 0.42);
        box-shadow: 0 8px 14px rgba(49, 119, 165, 0.06);
      }

      .mobile-sheet .nav-menu-item:nth-child(1) {
        animation-delay: 24ms;
      }

      .mobile-sheet .nav-menu-item:nth-child(2) {
        animation-delay: 48ms;
      }

      .mobile-sheet .nav-menu-item:nth-child(3) {
        animation-delay: 72ms;
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

      .mobile-bottom-nav {
        bottom: calc(8px + env(safe-area-inset-bottom, 0px));
        width: calc(100vw - 12px);
        padding: 7px;
        gap: 6px;
        border-radius: 24px;
      }

      .mobile-bottom-nav.is-condensed {
        padding: 5px;
        gap: 3px;
        border-radius: 20px;
      }

      .mobile-bottom-item {
        min-height: 54px;
        padding: 8px 10px 9px;
      }

      .mobile-bottom-nav.is-condensed .mobile-bottom-item {
        min-height: 42px;
        padding: 7px 8px;
      }

      .mobile-sheet-backdrop {
        padding: 0 8px calc(88px + env(safe-area-inset-bottom, 0px));
      }

      .mobile-sheet {
        padding: 10px;
        border-radius: 22px;
      }

      .mobile-sheet .nav-menu-item {
        padding: 12px 14px;
        gap: 10px;
      }

      .mobile-sheet .nav-menu-copy strong,
      .mobile-sheet .nav-menu-copy small {
        overflow-wrap: anywhere;
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

    @keyframes mobileDockReveal {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(10px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0) scale(1);
      }
    }

    @keyframes mobileSheetBackdropIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes mobileSheetReveal {
      from {
        opacity: 0;
        transform: translateY(28px) scale(0.985);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes mobileSheetItemReveal {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.988);
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly supportsHover =
    typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  private closeModulesMenuTimer: ReturnType<typeof setTimeout> | null = null;
  private mobileSheetCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private modulesMenuPinned = false;
  private lastScrollY = 0;
  private mobileSheetDragPointerId: number | null = null;
  private mobileSheetDragStartY = 0;
  private mobileSheetDragLastY = 0;
  private mobileSheetDragLastTime = 0;
  private mobileSheetDidDrag = false;
  private mobileSheetLastDragAt = 0;
  private lockedBodyScrollY: number | null = null;

  protected readonly isCompact = signal(false);
  protected readonly isMobileLayout = signal(typeof window !== 'undefined' ? window.innerWidth <= 640 : false);
  protected readonly isMobileNavCondensed = signal(false);
  protected readonly mobileSheetDragOffset = signal(0);
  protected readonly isMobileSheetDragging = signal(false);
  protected readonly isMobileSheetClosing = signal(false);
  protected readonly isModulesMenuOpen = signal(false);
  protected readonly modulesMenuId = 'top-nav-modules-menu';
  protected readonly mobileModulesSheetId = 'top-nav-mobile-modules-sheet';
  protected readonly brandTitle = signal('Empleados y reportes');
  protected readonly mobileSheetBackdropOpacity = computed(() => {
    const openness = 1 - Math.min(this.mobileSheetDragOffset() / 220, 1);

    return (0.16 * openness).toFixed(3);
  });
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

  constructor() {
    this.updateBrandTitle(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.updateBrandTitle(event.urlAfterRedirects);
      });

    this.destroyRef.onDestroy(() => {
      this.cancelMobileSheetClose();
      this.unlockDocumentScroll();
    });
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    const currentScrollY = Math.max(window.scrollY, 0);
    this.isCompact.set(currentScrollY > 24);

    if (currentScrollY <= 16) {
      this.isMobileNavCondensed.set(false);
    } else if (currentScrollY > this.lastScrollY + 4) {
      this.isMobileNavCondensed.set(true);
    } else if (currentScrollY < this.lastScrollY - 4) {
      this.isMobileNavCondensed.set(false);
    }

    this.lastScrollY = currentScrollY;
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    const isMobile = window.innerWidth <= 640;

    if (this.isMobileLayout() !== isMobile) {
      this.isMobileLayout.set(isMobile);
      this.closeModulesMenu();
    }

    if (!isMobile) {
      this.isMobileNavCondensed.set(false);
    }

    this.syncDocumentScrollLock();
  }

  @HostListener('document:pointermove', ['$event'])
  protected onDocumentPointerMove(event: PointerEvent): void {
    if (!this.isMobileSheetDragging() || event.pointerId !== this.mobileSheetDragPointerId) {
      return;
    }

    const offset = Math.max(event.clientY - this.mobileSheetDragStartY, 0);
    this.mobileSheetDidDrag = this.mobileSheetDidDrag || offset > 8;
    this.mobileSheetDragLastY = event.clientY;
    this.mobileSheetDragLastTime = event.timeStamp;
    this.mobileSheetDragOffset.set(offset);
  }

  @HostListener('document:pointerup', ['$event'])
  protected onDocumentPointerUp(event: PointerEvent): void {
    if (!this.isMobileSheetDragging() || event.pointerId !== this.mobileSheetDragPointerId) {
      return;
    }

    const releaseOffset = this.mobileSheetDragOffset();
    const elapsedSinceLastMove = Math.max(event.timeStamp - this.mobileSheetDragLastTime, 1);
    const velocity = (event.clientY - this.mobileSheetDragLastY) / elapsedSinceLastMove;
    const shouldClose = releaseOffset > 56 || (releaseOffset > 18 && velocity > 0.42);
    if (this.mobileSheetDidDrag) {
      this.mobileSheetLastDragAt = event.timeStamp;
    }
    this.finishMobileSheetDrag(!shouldClose);

    if (shouldClose) {
      this.beginMobileSheetClose(releaseOffset);
    }
  }

  @HostListener('document:pointercancel')
  protected onDocumentPointerCancel(): void {
    this.finishMobileSheetDrag();
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
    this.cancelMobileSheetClose();
    this.isMobileSheetClosing.set(false);
    this.mobileSheetDragOffset.set(0);
    this.isModulesMenuOpen.set(true);
    this.syncDocumentScrollLock();
  }

  protected closeModulesMenu(): void {
    this.cancelCloseModulesMenu();
    this.modulesMenuPinned = false;

    if (this.isMobileLayout() && this.isModulesMenuOpen()) {
      this.beginMobileSheetClose(this.mobileSheetDragOffset());
      return;
    }

    this.cancelMobileSheetClose();
    this.isModulesMenuOpen.set(false);
    this.isMobileSheetClosing.set(false);
    this.finishMobileSheetDrag();
    this.syncDocumentScrollLock();
  }

  protected onMobileSheetBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModulesMenu();
    }
  }

  protected onMobileSheetDragStart(event: PointerEvent): void {
    if (!this.isMobileLayout()) {
      return;
    }

    event.preventDefault();
    this.mobileSheetDragPointerId = event.pointerId;
    this.mobileSheetDragStartY = event.clientY;
    this.mobileSheetDragLastY = event.clientY;
    this.mobileSheetDragLastTime = event.timeStamp;
    this.mobileSheetDidDrag = false;
    this.mobileSheetDragOffset.set(0);
    this.isMobileSheetDragging.set(true);

    const pointerTarget = event.currentTarget as Element | null;
    if (pointerTarget && 'setPointerCapture' in pointerTarget) {
      (pointerTarget as Element & { setPointerCapture(pointerId: number): void }).setPointerCapture(event.pointerId);
    }
  }

  protected onMobileSheetHandleClick(event: MouseEvent): void {
    if (event.timeStamp - this.mobileSheetLastDragAt < 240) {
      return;
    }

    this.closeModulesMenu();
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
      this.isMobileSheetClosing.set(false);
      this.closeModulesMenuTimer = null;
      this.syncDocumentScrollLock();
    }, 120);
  }

  private cancelCloseModulesMenu(): void {
    if (this.closeModulesMenuTimer !== null) {
      clearTimeout(this.closeModulesMenuTimer);
      this.closeModulesMenuTimer = null;
    }
  }

  private finishMobileSheetDrag(resetOffset = true): void {
    this.mobileSheetDragPointerId = null;
    this.mobileSheetDragStartY = 0;
    this.mobileSheetDragLastY = 0;
    this.mobileSheetDragLastTime = 0;
    this.mobileSheetDidDrag = false;
    if (resetOffset) {
      this.mobileSheetDragOffset.set(0);
    }
    this.isMobileSheetDragging.set(false);
  }

  private beginMobileSheetClose(fromOffset = 0): void {
    this.cancelMobileSheetClose();
    this.finishMobileSheetDrag(false);
    this.isMobileSheetClosing.set(true);
    this.mobileSheetDragOffset.set(Math.max(fromOffset, 0));

    requestAnimationFrame(() => {
      this.mobileSheetDragOffset.set(Math.max(fromOffset, 240));
    });

    this.mobileSheetCloseTimer = setTimeout(() => {
      this.isModulesMenuOpen.set(false);
      this.isMobileSheetClosing.set(false);
      this.mobileSheetDragOffset.set(0);
      this.mobileSheetCloseTimer = null;
      this.syncDocumentScrollLock();
    }, 210);
  }

  private cancelMobileSheetClose(): void {
    if (this.mobileSheetCloseTimer !== null) {
      clearTimeout(this.mobileSheetCloseTimer);
      this.mobileSheetCloseTimer = null;
    }
  }

  private updateBrandTitle(url: string): void {
    const path = url.split('?')[0] || '/';

    if (path.startsWith('/reports/employees')) {
      this.brandTitle.set('Reporte de empleados');
      return;
    }

    if (path.startsWith('/reports')) {
      this.brandTitle.set('Reportes');
      return;
    }

    if (/^\/employees\/[^/]+\/edit$/.test(path)) {
      this.brandTitle.set('Editar empleado');
      return;
    }

    if (path.startsWith('/employees/new')) {
      this.brandTitle.set('Crear empleado');
      return;
    }

    if (path.startsWith('/employees')) {
      this.brandTitle.set('Empleados');
      return;
    }

    this.brandTitle.set('Empleados y reportes');
  }

  private syncDocumentScrollLock(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (this.isMobileLayout() && this.isModulesMenuOpen()) {
      this.lockDocumentScroll();
      return;
    }

    this.unlockDocumentScroll();
  }

  private lockDocumentScroll(): void {
    if (typeof window === 'undefined' || this.lockedBodyScrollY !== null) {
      return;
    }

    this.lockedBodyScrollY = Math.max(window.scrollY, 0);

    document.documentElement.classList.add('app-scroll-locked');
    document.body.classList.add('app-scroll-locked');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.lockedBodyScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  private unlockDocumentScroll(): void {
    if (typeof window === 'undefined' || this.lockedBodyScrollY === null) {
      return;
    }

    const scrollY = this.lockedBodyScrollY;

    document.documentElement.classList.remove('app-scroll-locked');
    document.body.classList.remove('app-scroll-locked');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
    this.lockedBodyScrollY = null;
    window.scrollTo(0, scrollY);
  }
}
