import { NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { UiButtonComponent } from './ui-button.component';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [NgIf, UiButtonComponent],
  template: `
    <section class="pager">
      <app-ui-button
        variant="outline-secondary"
        [disabled]="disablePrevious()"
        (click)="onPrevious()"
      >
        {{ previousLabel() }}
      </app-ui-button>

      <span class="pager-status" *ngIf="showStatus()">
        {{ statusText() }}
      </span>

      <app-ui-button
        variant="outline-primary"
        [disabled]="disableNext()"
        (click)="onNext()"
      >
        {{ nextLabel() }}
      </app-ui-button>
    </section>
  `,
  styles: [`
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      animation: pagerEnter 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .pager-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 0 14px;
      border-radius: 999px;
      color: var(--muted);
      font-size: 0.9rem;
      background: rgba(255, 255, 255, 0.72);
      border: 1px solid rgba(103, 86, 67, 0.14);
      box-shadow: 0 8px 16px rgba(73, 44, 24, 0.04);
      transition:
        transform 160ms ease,
        border-color 160ms ease,
        box-shadow 160ms ease;
    }

    .pager:hover .pager-status {
      transform: translateY(-1px);
      border-color: rgba(49, 119, 165, 0.16);
      box-shadow: 0 10px 18px rgba(49, 119, 165, 0.05);
    }

    @keyframes pagerEnter {
      from {
        opacity: 0;
        transform: translateY(6px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class PaginationControlsComponent {
  readonly disablePrevious = input(false);
  readonly disableNext = input(false);
  readonly previousLabel = input('Anterior');
  readonly nextLabel = input('Siguiente');
  readonly statusText = input('');
  readonly showStatus = input(true);

  readonly previous = output<void>();
  readonly next = output<void>();

  protected onPrevious(): void {
    if (this.disablePrevious()) {
      return;
    }

    this.previous.emit();
  }

  protected onNext(): void {
    if (this.disableNext()) {
      return;
    }

    this.next.emit();
  }
}
