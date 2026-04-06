import { NgIf } from '@angular/common';
import { Component, HostListener, computed, input, output } from '@angular/core';
import { UiButtonComponent } from './ui-button.component';

export type ProcessFeedbackState = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-process-feedback-modal',
  standalone: true,
  imports: [NgIf, UiButtonComponent],
  template: `
    <div class="process-backdrop" *ngIf="open()" (click)="onBackdropClick($event)">
      <section
        class="process-modal"
        role="dialog"
        aria-modal="true"
        [attr.aria-busy]="state() === 'loading' ? 'true' : null"
        [attr.aria-labelledby]="modalTitleId"
        [attr.aria-describedby]="modalDescriptionId"
      >
        <div class="process-visual" [class.is-success]="state() === 'success'" [class.is-error]="state() === 'error'">
          <div class="process-loader" *ngIf="state() === 'loading'">
            <span class="process-loader-ring"></span>
            <span class="process-loader-core"></span>
          </div>

          <div class="process-badge process-badge--success" *ngIf="state() === 'success'">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="20"></circle>
              <path d="M16 24.5 21.5 30 32.5 18.5"></path>
            </svg>
          </div>

          <div class="process-badge process-badge--error" *ngIf="state() === 'error'">
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <circle cx="24" cy="24" r="20"></circle>
              <path d="M18.5 18.5 29.5 29.5"></path>
              <path d="M29.5 18.5 18.5 29.5"></path>
            </svg>
          </div>
        </div>

        <div class="process-copy">
          <span class="process-kicker">{{ stateLabel() }}</span>
          <h2 class="process-title" [id]="modalTitleId">{{ title() }}</h2>
          <p class="process-description" [id]="modalDescriptionId">{{ description() }}</p>
        </div>

        <footer class="process-actions" *ngIf="state() !== 'loading'">
          <app-ui-button variant="primary" (click)="close.emit()">
            {{ actionLabel() }}
          </app-ui-button>
        </footer>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .process-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: grid;
      place-items: center;
      padding: 20px;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      background: rgba(18, 28, 38, 0.24);
      backdrop-filter: blur(22px) saturate(1.16);
      animation: processBackdropIn 220ms ease both;
    }

    .process-modal {
      width: min(100%, 420px);
      max-height: calc(100dvh - 40px);
      display: grid;
      gap: 18px;
      justify-items: center;
      padding: 28px 24px 22px;
      overflow: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      text-align: center;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.34);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 248, 242, 0.52) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.28), transparent 42%);
      box-shadow:
        0 34px 68px rgba(20, 33, 45, 0.18),
        0 18px 34px rgba(49, 119, 165, 0.08);
      backdrop-filter: blur(28px) saturate(1.18);
      animation: processModalIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .process-visual {
      position: relative;
      display: grid;
      place-items: center;
      width: 112px;
      height: 112px;
      border-radius: 50%;
      background:
        radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.78), rgba(214, 235, 248, 0.36)),
        rgba(255, 255, 255, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.34);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.4),
        0 18px 34px rgba(49, 119, 165, 0.1);
      overflow: hidden;
    }

    .process-visual::after {
      content: '';
      position: absolute;
      inset: 10px;
      border-radius: inherit;
      border: 1px solid rgba(255, 255, 255, 0.28);
      opacity: 0.9;
      pointer-events: none;
    }

    .process-loader {
      position: relative;
      width: 64px;
      height: 64px;
      display: grid;
      place-items: center;
    }

    .process-loader-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid rgba(49, 119, 165, 0.14);
      border-top-color: rgba(49, 119, 165, 0.84);
      border-right-color: rgba(49, 119, 165, 0.44);
      animation: processSpin 0.95s linear infinite;
    }

    .process-loader-core {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: linear-gradient(180deg, rgba(67, 144, 195, 0.96), rgba(43, 104, 143, 0.88));
      box-shadow:
        0 10px 20px rgba(49, 119, 165, 0.22),
        inset 0 1px 0 rgba(255, 255, 255, 0.28);
      animation: processPulse 1.25s ease-in-out infinite;
    }

    .process-badge {
      width: 72px;
      height: 72px;
      display: grid;
      place-items: center;
      animation: processBadgeIn 300ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .process-badge svg {
      width: 72px;
      height: 72px;
      overflow: visible;
    }

    .process-badge circle {
      fill: none;
      stroke-width: 2.5;
    }

    .process-badge path {
      fill: none;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 28;
      stroke-dashoffset: 28;
      animation: processStrokeIn 280ms ease 120ms forwards;
    }

    .process-badge--success circle {
      stroke: rgba(76, 183, 112, 0.28);
      fill: rgba(76, 183, 112, 0.14);
    }

    .process-badge--success path {
      stroke: #2e8751;
    }

    .process-badge--error circle {
      stroke: rgba(181, 56, 56, 0.26);
      fill: rgba(181, 56, 56, 0.12);
    }

    .process-badge--error path {
      stroke: #a83535;
    }

    .process-copy {
      display: grid;
      gap: 8px;
      justify-items: center;
    }

    .process-kicker {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .process-title {
      margin: 0;
      color: var(--text-strong);
      font-size: clamp(1.25rem, 2vw, 1.55rem);
      line-height: 1.1;
    }

    .process-description {
      margin: 0;
      max-width: 30ch;
      color: var(--muted);
      font-size: 0.94rem;
      line-height: 1.55;
    }

    .process-actions {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    @keyframes processBackdropIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes processModalIn {
      from {
        opacity: 0;
        transform: translateY(14px) scale(0.97);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes processSpin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes processPulse {
      0%, 100% {
        transform: scale(0.92);
        opacity: 0.92;
      }

      50% {
        transform: scale(1.06);
        opacity: 1;
      }
    }

    @keyframes processBadgeIn {
      from {
        opacity: 0;
        transform: scale(0.84);
      }

      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes processStrokeIn {
      to {
        stroke-dashoffset: 0;
      }
    }

    @media (max-width: 560px) {
      .process-backdrop {
        place-items: start center;
        padding: 12px;
      }

      .process-modal {
        max-height: calc(100dvh - 24px);
        padding: 24px 18px 18px;
        border-radius: 24px;
      }

      .process-visual {
        width: 96px;
        height: 96px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .process-backdrop,
      .process-modal,
      .process-loader-ring,
      .process-loader-core,
      .process-badge,
      .process-badge path {
        animation: none !important;
      }
    }
  `],
})
export class ProcessFeedbackModalComponent {
  readonly open = input(false);
  readonly state = input<ProcessFeedbackState>('loading');
  readonly title = input('');
  readonly description = input('');
  readonly actionLabel = input('Entendido');
  readonly requireActionConfirm = input(false);

  readonly close = output<void>();

  protected readonly modalTitleId = 'process-feedback-modal-title';
  protected readonly modalDescriptionId = 'process-feedback-modal-description';
  protected readonly stateLabel = computed(() => {
    switch (this.state()) {
      case 'success':
        return 'Completado';
      case 'error':
        return 'No completado';
      default:
        return 'Procesando';
    }
  });

  protected onBackdropClick(event: MouseEvent): void {
    if (this.state() === 'loading' || this.requireActionConfirm()) {
      return;
    }

    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open() && this.state() !== 'loading' && !this.requireActionConfirm()) {
      this.close.emit();
    }
  }
}
