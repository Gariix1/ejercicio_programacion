import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export type UiButtonVariant =
  | 'primary'
  | 'success'
  | 'warning'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-danger'
  | 'link';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  imports: [NgClass, RouterLink],
  template: `
    <button
      [type]="buttonType()"
      [routerLink]="routerLink()"
      class="btn ui-button"
      [disabled]="disabled()"
      [ngClass]="buttonClasses()"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    :host {
      display: inline-flex;
    }

    :host(.w-100) {
      width: 100%;
    }

    :host(.w-100) .ui-button {
      width: 100%;
    }

    .ui-button {
      position: relative;
      overflow: hidden;
      isolation: isolate;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 42px;
      border-radius: 999px;
      padding-inline: 18px;
      font-weight: 600;
      line-height: 1.15;
      white-space: nowrap;
      text-decoration: none;
      backdrop-filter: blur(14px) saturate(1.18);
      border-width: 1px;
      transition:
        transform 160ms ease,
        box-shadow 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        color 160ms ease,
        filter 160ms ease;
    }

    .ui-button::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.22) 30%, transparent 62%);
      opacity: 0;
      transform: translateX(-120%);
      transition:
        opacity 180ms ease,
        transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
      pointer-events: none;
      z-index: 0;
    }

    .ui-button::before {
      content: '';
      position: absolute;
      inset: 1px;
      border-radius: inherit;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.04) 44%, transparent 100%);
      opacity: 0.86;
      pointer-events: none;
      z-index: 0;
    }

    .ui-button > * {
      position: relative;
      z-index: 1;
    }

    .ui-button:hover:not(:disabled) {
      transform: translateY(-1px);
      filter: saturate(1.03);
    }

    .ui-button:hover:not(:disabled)::after,
    .ui-button:focus-visible::after {
      opacity: 1;
      transform: translateX(120%);
    }

    .ui-button:active:not(:disabled) {
      transform: translateY(0) scale(0.985);
      box-shadow: none;
    }

    .ui-button:focus-visible {
      outline: 0;
      box-shadow:
        0 0 0 0.22rem rgba(49, 119, 165, 0.16),
        0 10px 20px rgba(49, 119, 165, 0.12);
    }

    .ui-button.is-wide {
      min-width: 148px;
    }

    .ui-button.btn-primary,
    .ui-button.btn-success,
    .ui-button.btn-warning {
      color: white;
    }

    .ui-button.btn-primary {
      background: linear-gradient(180deg, rgba(67, 144, 195, 0.92) 0%, rgba(43, 104, 143, 0.84) 100%);
      border-color: rgba(255, 255, 255, 0.26);
      box-shadow:
        0 18px 30px rgba(49, 119, 165, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.24);
    }

    .ui-button.btn-primary:hover:not(:disabled) {
      background: linear-gradient(180deg, rgba(74, 153, 205, 0.94) 0%, rgba(43, 104, 143, 0.88) 100%);
      border-color: rgba(255, 255, 255, 0.32);
      color: white;
    }

    .ui-button.btn-success {
      background: linear-gradient(180deg, rgba(69, 173, 104, 0.9) 0%, rgba(47, 129, 80, 0.82) 100%);
      border-color: rgba(255, 255, 255, 0.24);
      box-shadow:
        0 18px 30px rgba(50, 130, 77, 0.16),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    .ui-button.btn-success:hover:not(:disabled) {
      background: linear-gradient(180deg, rgba(76, 183, 112, 0.92) 0%, rgba(47, 129, 80, 0.86) 100%);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
    }

    .ui-button.btn-warning {
      background: linear-gradient(180deg, rgba(222, 166, 63, 0.92) 0%, rgba(191, 125, 16, 0.84) 100%);
      border-color: rgba(255, 255, 255, 0.24);
      box-shadow:
        0 18px 30px rgba(191, 125, 16, 0.14),
        inset 0 1px 0 rgba(255, 255, 255, 0.24);
    }

    .ui-button.btn-warning:hover:not(:disabled) {
      background: linear-gradient(180deg, rgba(228, 173, 76, 0.94) 0%, rgba(191, 125, 16, 0.88) 100%);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
    }

    .ui-button.btn-outline-primary {
      color: #255c80;
      border-color: rgba(255, 255, 255, 0.34);
      background: rgba(255, 255, 255, 0.44);
      box-shadow:
        0 12px 24px rgba(49, 119, 165, 0.08),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    .ui-button.btn-outline-primary:hover:not(:disabled) {
      color: #1e567a;
      background: rgba(208, 232, 248, 0.48);
      border-color: rgba(255, 255, 255, 0.42);
    }

    .ui-button.btn-outline-secondary {
      color: #5c544b;
      border-color: rgba(255, 255, 255, 0.32);
      background: rgba(255, 255, 255, 0.42);
      box-shadow:
        0 10px 22px rgba(73, 44, 24, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    .ui-button.btn-outline-secondary:hover:not(:disabled) {
      color: #4c453d;
      background: rgba(255, 250, 244, 0.5);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .ui-button.btn-outline-danger {
      color: #9f3030;
      border-color: rgba(255, 255, 255, 0.32);
      background: rgba(255, 255, 255, 0.42);
      box-shadow:
        0 10px 22px rgba(181, 56, 56, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    .ui-button.btn-outline-danger:hover:not(:disabled) {
      color: #852424;
      background: rgba(245, 220, 220, 0.48);
      border-color: rgba(255, 255, 255, 0.4);
    }

    .ui-button.btn-link {
      color: #255c80;
      border-color: transparent;
      background: transparent;
      box-shadow: none;
      overflow: visible;
    }

    .ui-button.btn-link:hover:not(:disabled) {
      color: #1f5b82;
      background: transparent;
    }

    .ui-button.btn-link::after {
      display: none;
    }

    .ui-button:disabled {
      pointer-events: none;
      opacity: 0.7;
      transform: none;
      box-shadow: none;
    }
  `],
})
export class UiButtonComponent {
  readonly routerLink = input<string | any[] | null>(null);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly variant = input<UiButtonVariant>('outline-secondary');
  readonly disabled = input(false);
  readonly wide = input(false);

  protected readonly buttonType = computed(() => this.routerLink() ? 'button' : this.type());

  protected readonly buttonClasses = computed(() => [
    this.mapVariantToClass(this.variant()),
    this.wide() ? 'is-wide' : '',
  ]);

  private mapVariantToClass(variant: UiButtonVariant): string {
    switch (variant) {
      case 'primary':
        return 'btn-primary';
      case 'success':
        return 'btn-success';
      case 'warning':
        return 'btn-warning';
      case 'outline-primary':
        return 'btn-outline-primary';
      case 'outline-danger':
        return 'btn-outline-danger';
      case 'link':
        return 'btn-link';
      case 'outline-secondary':
      default:
        return 'btn-outline-secondary';
    }
  }
}
