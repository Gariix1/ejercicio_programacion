import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';
import { UiButtonComponent, UiButtonVariant } from './ui-button.component';

export interface ConfirmActionChangeItem {
  label: string;
  before?: string;
  after?: string;
}

@Component({
  selector: 'app-confirm-action-modal',
  standalone: true,
  imports: [NgFor, NgIf, UiButtonComponent],
  template: `
    <div class="confirm-backdrop" *ngIf="open()" (click)="onBackdropClick($event)">
      <section
        class="confirm-modal"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="modalTitleId"
        [attr.aria-describedby]="modalDescriptionId"
      >
        <header class="confirm-header">
          <div class="confirm-icon" aria-hidden="true">!</div>

          <div class="confirm-copy">
            <span class="confirm-kicker">Confirmacion</span>
            <h2 class="confirm-title" [id]="modalTitleId">{{ title() }}</h2>
            <p class="confirm-description" [id]="modalDescriptionId">{{ description() }}</p>
          </div>
        </header>

        <section class="confirm-changes" *ngIf="changes().length > 0">
          <span class="confirm-changes-label">Cambios detectados</span>

          <div class="confirm-change-list">
            <article class="confirm-change-item" *ngFor="let change of changes(); trackBy: trackChange">
              <strong>{{ change.label }}</strong>

              <div class="confirm-change-values" *ngIf="change.before !== undefined && change.after !== undefined; else singleValue">
                <span class="confirm-change-before">{{ change.before }}</span>
                <span class="confirm-change-arrow" aria-hidden="true">-></span>
                <span class="confirm-change-after">{{ change.after }}</span>
              </div>

              <ng-template #singleValue>
                <span class="confirm-change-after">{{ change.after ?? change.before }}</span>
              </ng-template>
            </article>
          </div>
        </section>

        <footer class="confirm-actions">
          <app-ui-button variant="outline-secondary" (click)="close.emit()">
            {{ cancelLabel() }}
          </app-ui-button>

          <app-ui-button [variant]="confirmVariant()" (click)="confirm.emit()">
            {{ confirmLabel() }}
          </app-ui-button>
        </footer>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .confirm-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1190;
      display: grid;
      place-items: center;
      padding: 20px;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      background: rgba(18, 28, 38, 0.2);
      backdrop-filter: blur(18px) saturate(1.14);
      animation: confirmBackdropIn 200ms ease both;
    }

    .confirm-modal {
      width: min(100%, 560px);
      max-height: calc(100dvh - 40px);
      display: grid;
      gap: 18px;
      padding: 24px;
      overflow: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.34);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 248, 242, 0.5) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.28), transparent 42%);
      backdrop-filter: blur(28px) saturate(1.18);
      box-shadow:
        0 30px 60px rgba(20, 33, 45, 0.16),
        0 16px 30px rgba(49, 119, 165, 0.08);
      animation: confirmModalIn 240ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .confirm-header {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 16px;
      align-items: start;
    }

    .confirm-icon {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: linear-gradient(180deg, rgba(228, 173, 76, 0.22), rgba(191, 125, 16, 0.14));
      border: 1px solid rgba(255, 255, 255, 0.32);
      color: #9a620c;
      font-weight: 800;
      font-size: 1.1rem;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }

    .confirm-copy {
      display: grid;
      gap: 6px;
    }

    .confirm-kicker,
    .confirm-changes-label {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .confirm-title {
      margin: 0;
      color: var(--text-strong);
      font-size: clamp(1.18rem, 1.8vw, 1.46rem);
      line-height: 1.1;
    }

    .confirm-description {
      margin: 0;
      color: var(--muted);
      font-size: 0.94rem;
      line-height: 1.55;
    }

    .confirm-changes {
      display: grid;
      gap: 10px;
      min-width: 0;
    }

    .confirm-change-list {
      display: grid;
      gap: 10px;
      max-height: min(40vh, 280px);
      padding-right: 4px;
      overflow: auto;
    }

    .confirm-change-item {
      display: grid;
      gap: 6px;
      padding: 12px 14px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.42);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22);
    }

    .confirm-change-item strong {
      color: var(--text-strong);
      font-size: 0.92rem;
      line-height: 1.25;
    }

    .confirm-change-values {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
      gap: 8px;
      align-items: center;
    }

    .confirm-change-before,
    .confirm-change-after {
      min-width: 0;
      padding: 8px 10px;
      border-radius: 12px;
      font-size: 0.88rem;
      line-height: 1.45;
      word-break: break-word;
    }

    .confirm-change-before {
      color: #6e645a;
      background: rgba(255, 255, 255, 0.5);
    }

    .confirm-change-after {
      color: #255c80;
      background: rgba(210, 233, 248, 0.34);
      border: 1px solid rgba(255, 255, 255, 0.22);
    }

    .confirm-change-arrow {
      color: var(--text-soft);
      font-weight: 700;
    }

    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 12px;
    }

    @keyframes confirmBackdropIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes confirmModalIn {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 560px) {
      .confirm-backdrop {
        place-items: start center;
        padding: 12px;
      }

      .confirm-modal {
        max-height: calc(100dvh - 24px);
        padding: 20px 16px;
        border-radius: 24px;
      }

      .confirm-header {
        grid-template-columns: 1fr;
      }

      .confirm-icon {
        width: 40px;
        height: 40px;
      }

      .confirm-change-values {
        grid-template-columns: 1fr;
      }

      .confirm-change-arrow {
        display: none;
      }

      .confirm-actions {
        justify-content: stretch;
      }
    }
  `],
})
export class ConfirmActionModalComponent {
  readonly open = input(false);
  readonly title = input('');
  readonly description = input('');
  readonly changes = input<ConfirmActionChangeItem[]>([]);
  readonly cancelLabel = input('Seguir editando');
  readonly confirmLabel = input('Confirmar');
  readonly confirmVariant = input<UiButtonVariant>('warning');

  readonly close = output<void>();
  readonly confirm = output<void>();

  protected readonly modalTitleId = 'confirm-action-modal-title';
  protected readonly modalDescriptionId = 'confirm-action-modal-description';

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  protected trackChange = (_index: number, change: ConfirmActionChangeItem): string =>
    `${change.label}-${change.before ?? ''}-${change.after ?? ''}`;

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close.emit();
    }
  }
}
