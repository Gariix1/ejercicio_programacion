import { NgFor, NgIf } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

type PagerToken =
  | { kind: 'page'; value: number }
  | { kind: 'ellipsis'; key: string };

@Component({
  selector: 'app-pagination-controls',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <section class="pager">
      <div class="pager-navigation" *ngIf="lastPage() > 1">
        <button
          type="button"
          class="pager-arrow"
          [disabled]="disablePrevious()"
          [attr.aria-label]="previousLabel()"
          (click)="onPrevious()"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div class="pager-pages">
          <ng-container *ngFor="let token of visibleTokens(); trackBy: trackToken">
            <button
              *ngIf="token.kind === 'page'; else pagerEllipsis"
              type="button"
              class="pager-page"
              [class.is-active]="token.value === currentPage()"
              [attr.aria-current]="token.value === currentPage() ? 'page' : null"
              (click)="onPageSelect(token.value)"
            >
              {{ token.value }}
            </button>

            <ng-template #pagerEllipsis>
              <span class="pager-ellipsis" aria-hidden="true">…</span>
            </ng-template>
          </ng-container>
        </div>

        <button
          type="button"
          class="pager-arrow"
          [disabled]="disableNext()"
          [attr.aria-label]="nextLabel()"
          (click)="onNext()"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <span class="pager-status" *ngIf="showStatus() && lastPage() > 1">
        {{ statusText() }}
      </span>

      <label class="pager-jump" *ngIf="showJump() && lastPage() > 1">
        <span class="pager-jump-label">Ir</span>
        <input
          type="number"
          inputmode="numeric"
          class="form-control pager-input"
          [value]="currentPage()"
          min="1"
          [max]="lastPage()"
          aria-label="Ir a una pagina especifica"
          (keydown.enter)="onJumpSubmit($event)"
          (blur)="onJumpSubmit($event)"
        />
        <span class="pager-total">de {{ lastPage() }}</span>
      </label>
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

    .pager-navigation {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .pager-status {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 0 12px;
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

    .pager-pages {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
    }

    .pager-arrow,
    .pager-page,
    .pager-ellipsis {
      min-width: 38px;
      min-height: 38px;
      border-radius: 999px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .pager-arrow,
    .pager-page {
      border: 1px solid rgba(255, 255, 255, 0.34);
      background: rgba(255, 255, 255, 0.34);
      backdrop-filter: blur(14px) saturate(1.14);
      color: #255c80;
      font-weight: 600;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 8px 16px rgba(73, 44, 24, 0.04);
      transition:
        transform 160ms ease,
        background-color 160ms ease,
        border-color 160ms ease,
        box-shadow 160ms ease,
        color 160ms ease;
    }

    .pager-arrow {
      padding: 0;
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1;
    }

    .pager-arrow:hover,
    .pager-page:hover {
      transform: translateY(-1px);
      background: rgba(214, 235, 248, 0.42);
      border-color: rgba(255, 255, 255, 0.4);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.3),
        0 10px 18px rgba(49, 119, 165, 0.06);
    }

    .pager-arrow:disabled {
      opacity: 0.42;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .pager-page.is-active {
      background: rgba(210, 233, 248, 0.56);
      border-color: rgba(255, 255, 255, 0.42);
      color: #255c80;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.38),
        0 10px 18px rgba(49, 119, 165, 0.08);
    }

    .pager-ellipsis {
      color: var(--text-soft);
    }

    .pager-jump {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin: 0;
      color: var(--muted);
      font-size: 0.88rem;
      font-weight: 600;
    }

    .pager-jump-label,
    .pager-total {
      white-space: nowrap;
    }

    .pager-input {
      width: 64px;
      min-height: 38px;
      border-radius: 999px;
      border-color: rgba(255, 255, 255, 0.34);
      background: rgba(255, 255, 255, 0.38);
      backdrop-filter: blur(14px) saturate(1.14);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 8px 16px rgba(73, 44, 24, 0.04);
      color: var(--text-strong);
      font-size: 0.88rem;
      text-align: center;
      padding-inline: 10px;
    }

    .pager-input::-webkit-outer-spin-button,
    .pager-input::-webkit-inner-spin-button {
      margin: 0;
      -webkit-appearance: none;
    }

    .pager-input[type=number] {
      -moz-appearance: textfield;
    }

    .pager-input:focus {
      border-color: rgba(49, 119, 165, 0.34);
      box-shadow:
        0 0 0 0.18rem rgba(49, 119, 165, 0.1),
        0 12px 22px rgba(49, 119, 165, 0.08);
      background: rgba(255, 255, 255, 0.54);
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
  readonly currentPage = input(1);
  readonly lastPage = input(1);
  readonly disablePrevious = input(false);
  readonly disableNext = input(false);
  readonly previousLabel = input('Pagina anterior');
  readonly nextLabel = input('Pagina siguiente');
  readonly statusText = input('');
  readonly showStatus = input(true);
  readonly showJump = input(true);

  readonly previous = output<void>();
  readonly next = output<void>();
  readonly pageChange = output<number>();

  protected readonly visibleTokens = computed<PagerToken[]>(() => {
    const current = Math.max(this.currentPage(), 1);
    const last = Math.max(this.lastPage(), 1);

    if (last <= 7) {
      return Array.from({ length: last }, (_, index) => ({ kind: 'page', value: index + 1 }));
    }

    const pages = new Set<number>([1, last, current - 1, current, current + 1]);
    const normalizedPages = Array.from(pages)
      .filter((page) => page >= 1 && page <= last)
      .sort((a, b) => a - b);

    const tokens: PagerToken[] = [];

    normalizedPages.forEach((page, index) => {
      const previousPage = normalizedPages[index - 1];

      if (previousPage !== undefined && page - previousPage > 1) {
        tokens.push({ kind: 'ellipsis', key: `ellipsis-${previousPage}-${page}` });
      }

      tokens.push({ kind: 'page', value: page });
    });

    return tokens;
  });

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

  protected onPageSelect(page: number): void {
    if (page === this.currentPage()) {
      return;
    }

    this.pageChange.emit(page);
  }

  protected onJumpSubmit(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);

    if (!Number.isFinite(value) || value < 1 || value > this.lastPage() || value === this.currentPage()) {
      target.value = String(this.currentPage());
      return;
    }

    target.value = String(value);
    this.pageChange.emit(value);
  }

  protected trackToken = (_index: number, token: PagerToken): string =>
    token.kind === 'page' ? `page-${token.value}` : token.key;
}
