import { NgIf } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [NgIf],
  template: `
    <section class="pager">
      <button
        class="btn btn-outline-secondary"
        type="button"
        [disabled]="disablePrevious()"
        (click)="previous.emit()"
      >
        {{ previousLabel() }}
      </button>

      <span class="pager-status" *ngIf="showStatus()">
        {{ statusText() }}
      </span>

      <button
        class="btn btn-outline-primary"
        type="button"
        [disabled]="disableNext()"
        (click)="next.emit()"
      >
        {{ nextLabel() }}
      </button>
    </section>
  `,
  styles: [`
    .pager {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    .pager-status {
      color: var(--muted);
      font-size: 0.9rem;
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
}
