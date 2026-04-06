import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { Component, HostListener, computed, input, output, signal } from '@angular/core';
import { UiButtonComponent } from './ui-button.component';

export interface ExportFormatOption {
  id: string;
  label: string;
  description: string;
  helper: string;
}

export interface ExportPreviewMetric {
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-export-modal',
  standalone: true,
  imports: [NgFor, NgIf, UpperCasePipe, UiButtonComponent],
  template: `
    <div class="export-modal-backdrop" *ngIf="open()" (click)="onBackdropClick($event)">
      <section
        class="export-modal"
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="modalTitleId"
        [attr.aria-describedby]="modalDescriptionId"
      >
        <header class="export-modal-header">
          <div class="export-modal-copy">
            <span class="export-modal-kicker">Exportacion</span>
            <h2 class="export-modal-title" [id]="modalTitleId">{{ title() }}</h2>
            <p class="export-modal-description" [id]="modalDescriptionId">{{ description() }}</p>
          </div>

          <button type="button" class="export-modal-close" aria-label="Cerrar" (click)="close.emit()">
            ×
          </button>
        </header>

        <div class="export-modal-body">
          <section class="export-format-list">
            <button
              type="button"
              class="export-format-card"
              *ngFor="let format of formats(); trackBy: trackFormat"
              [class.is-active]="selectedFormat() === format.id"
              [attr.aria-pressed]="selectedFormat() === format.id"
              (click)="selectFormat(format.id)"
            >
              <div class="export-format-topline">
                <span class="export-format-badge">{{ format.id | uppercase }}</span>
                <span class="export-format-check" *ngIf="selectedFormat() === format.id" aria-hidden="true">
                  ✓
                </span>
              </div>
              <strong>{{ format.label }}</strong>
              <span>{{ format.description }}</span>
              <small>{{ format.helper }}</small>
            </button>
          </section>

          <aside class="export-preview-card">
            <div class="export-preview-head">
              <span class="export-preview-kicker">Preview</span>
              <strong>{{ fileName() }}</strong>
            </div>

            <section class="export-selected-format" *ngIf="selectedFormatOption() as selected">
              <span class="export-preview-label">Formato seleccionado</span>
              <div class="export-selected-card">
                <span class="export-selected-badge">{{ selected.id | uppercase }}</span>
                <div class="export-selected-copy">
                  <strong>{{ selected.label }}</strong>
                  <span>{{ selected.description }}</span>
                </div>
              </div>
            </section>

            <section class="export-preview-metrics" *ngIf="previewMetrics().length > 0">
              <article class="export-preview-metric" *ngFor="let metric of previewMetrics(); trackBy: trackMetric">
                <span>{{ metric.label }}</span>
                <strong>{{ metric.value }}</strong>
              </article>
            </section>

            <section class="export-preview-columns" *ngIf="previewColumns().length > 0">
              <span class="export-preview-label">Columnas incluidas</span>
              <div class="export-preview-chip-list">
                <span class="export-preview-chip" *ngFor="let column of previewColumns(); trackBy: trackValue">
                  {{ column }}
                </span>
              </div>
            </section>

            <section class="export-preview-columns" *ngIf="activeFilters().length > 0">
              <span class="export-preview-label">Filtros actuales</span>
              <div class="export-preview-chip-list">
                <span class="export-preview-chip export-preview-chip--muted" *ngFor="let filter of activeFilters(); trackBy: trackValue">
                  {{ filter }}
                </span>
              </div>
            </section>

            <p class="export-preview-note">
              {{ selectedFormatMessage() }}
            </p>
          </aside>
        </div>

        <footer class="export-modal-actions">
          <app-ui-button variant="outline-secondary" (click)="close.emit()">
            Cancelar
          </app-ui-button>

          <app-ui-button variant="primary" [disabled]="busy()" (click)="confirm.emit(selectedFormat())">
            {{ confirmButtonLabel() }}
          </app-ui-button>
        </footer>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .export-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 1100;
      display: grid;
      place-items: center;
      padding: 20px;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      background: rgba(19, 30, 41, 0.28);
      backdrop-filter: blur(18px) saturate(1.1);
      animation: modalBackdropIn 220ms ease both;
    }

    .export-modal {
      width: min(100%, 920px);
      max-height: calc(100dvh - 40px);
      display: grid;
      gap: 18px;
      padding: 22px;
      overflow: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      border-radius: 28px;
      border: 1px solid rgba(255, 255, 255, 0.34);
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 248, 242, 0.46) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.26), transparent 42%);
      backdrop-filter: blur(26px) saturate(1.18);
      box-shadow:
        0 30px 60px rgba(20, 33, 45, 0.18),
        0 18px 34px rgba(49, 119, 165, 0.08);
      animation: modalCardIn 260ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .export-modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
    }

    .export-modal-copy {
      display: grid;
      gap: 6px;
      min-width: 0;
    }

    .export-modal-kicker,
    .export-preview-kicker,
    .export-preview-label {
      color: var(--text-soft);
      font-size: var(--font-size-kicker);
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .export-modal-title {
      margin: 0;
      color: var(--text-strong);
      font-size: clamp(1.3rem, 1.8vw, 1.6rem);
      line-height: 1.1;
    }

    .export-modal-description {
      margin: 0;
      color: var(--muted);
      font-size: 0.92rem;
      line-height: 1.45;
    }

    .export-modal-close {
      width: 40px;
      height: 40px;
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.36);
      color: #4f6272;
      font-size: 1.5rem;
      line-height: 1;
      backdrop-filter: blur(12px) saturate(1.16);
      transition: transform 160ms ease, background-color 160ms ease, border-color 160ms ease;
    }

    .export-modal-close:hover {
      transform: translateY(-1px);
      background: rgba(214, 235, 248, 0.36);
      border-color: rgba(255, 255, 255, 0.42);
    }

    .export-modal-body {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(280px, 0.9fr);
      gap: 18px;
      align-items: start;
    }

    .export-format-list {
      display: grid;
      gap: 12px;
    }

    .export-format-card,
    .export-preview-card {
      border: 1px solid rgba(255, 255, 255, 0.34);
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.54) 0%, rgba(255, 248, 242, 0.36) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.24), transparent 42%);
      backdrop-filter: blur(20px) saturate(1.18);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 16px 28px rgba(49, 119, 165, 0.06);
    }

    .export-format-card {
      display: grid;
      gap: 6px;
      width: 100%;
      padding: 18px;
      text-align: left;
      color: var(--text-strong);
      transition:
        transform 160ms ease,
        border-color 160ms ease,
        background-color 160ms ease,
        box-shadow 180ms ease;
    }

    .export-format-topline {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .export-format-card:hover {
      transform: translateY(-1px);
      border-color: rgba(255, 255, 255, 0.42);
      background: rgba(255, 255, 255, 0.62);
    }

    .export-format-card.is-active {
      border-color: rgba(255, 255, 255, 0.46);
      background:
        linear-gradient(180deg, rgba(214, 235, 248, 0.46) 0%, rgba(255, 255, 255, 0.5) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.2), transparent 42%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.34),
        0 18px 30px rgba(49, 119, 165, 0.08);
    }

    .export-format-check {
      width: 24px;
      height: 24px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(67, 144, 195, 0.16);
      border: 1px solid rgba(255, 255, 255, 0.34);
      color: #255c80;
      font-size: 0.86rem;
      font-weight: 800;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.26);
    }

    .export-format-card strong {
      font-size: 1.02rem;
      line-height: 1.15;
    }

    .export-format-card span,
    .export-format-card small {
      color: var(--muted);
      line-height: 1.45;
    }

    .export-format-card small {
      font-size: 0.82rem;
    }

    .export-format-badge {
      display: inline-flex;
      align-items: center;
      width: fit-content;
      min-height: 28px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(210, 233, 248, 0.42);
      border: 1px solid rgba(255, 255, 255, 0.32);
      color: #255c80 !important;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .export-preview-card {
      display: grid;
      gap: 14px;
      padding: 18px;
      align-content: start;
      min-height: 100%;
    }

    .export-preview-head {
      display: grid;
      gap: 4px;
    }

    .export-preview-head strong {
      color: var(--text-strong);
      font-size: 1rem;
      line-height: 1.2;
      word-break: break-word;
    }

    .export-selected-format {
      display: grid;
      gap: 8px;
    }

    .export-selected-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 12px;
      align-items: start;
      padding: 12px;
      border-radius: 18px;
      border: 1px solid rgba(255, 255, 255, 0.32);
      background:
        linear-gradient(180deg, rgba(214, 235, 248, 0.32) 0%, rgba(255, 255, 255, 0.42) 100%),
        radial-gradient(circle at top left, rgba(255, 255, 255, 0.24), transparent 44%);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        0 10px 20px rgba(49, 119, 165, 0.06);
    }

    .export-selected-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 54px;
      min-height: 32px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.48);
      border: 1px solid rgba(255, 255, 255, 0.32);
      color: #255c80;
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .export-selected-copy {
      display: grid;
      gap: 3px;
      min-width: 0;
    }

    .export-selected-copy strong {
      color: var(--text-strong);
      font-size: 0.96rem;
      line-height: 1.2;
    }

    .export-selected-copy span {
      color: var(--muted);
      font-size: 0.84rem;
      line-height: 1.45;
    }

    .export-preview-metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .export-preview-metric {
      display: grid;
      gap: 4px;
      padding: 12px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.36);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.24);
    }

    .export-preview-metric span {
      color: var(--text-soft);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .export-preview-metric strong {
      color: var(--text-strong);
      font-size: 1rem;
      line-height: 1.15;
    }

    .export-preview-columns {
      display: grid;
      gap: 8px;
    }

    .export-preview-chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .export-preview-chip {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(214, 235, 248, 0.38);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #255c80;
      font-size: 0.8rem;
      line-height: 1.2;
    }

    .export-preview-chip--muted {
      background: rgba(255, 255, 255, 0.32);
      color: var(--muted);
    }

    .export-preview-note {
      margin: 0;
      color: var(--muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .export-modal-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px;
    }

    @media (max-width: 860px) {
      .export-modal-body {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .export-modal-backdrop {
        place-items: start center;
        padding: 12px;
      }

      .export-modal {
        max-height: calc(100dvh - 24px);
        padding: 18px;
        border-radius: 24px;
      }

      .export-preview-metrics {
        grid-template-columns: 1fr;
      }
    }

    @keyframes modalBackdropIn {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }

    @keyframes modalCardIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.98);
      }

      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `],
})
export class ExportModalComponent {
  readonly open = input(false);
  readonly title = input('Exportar reporte');
  readonly description = input('Selecciona un formato y exporta el reporte actual.');
  readonly fileName = input('reporte');
  readonly formats = input<ExportFormatOption[]>([]);
  readonly previewMetrics = input<ExportPreviewMetric[]>([]);
  readonly previewColumns = input<string[]>([]);
  readonly activeFilters = input<string[]>([]);
  readonly busy = input(false);

  readonly close = output<void>();
  readonly confirm = output<string>();

  protected readonly modalTitleId = 'export-modal-title';
  protected readonly modalDescriptionId = 'export-modal-description';
  protected readonly selectedFormat = signal('');
  protected readonly selectedFormatOption = computed(
    () => this.formats().find((format) => format.id === this.selectedFormat()) ?? null,
  );

  protected readonly selectedFormatMessage = computed(() => {
    const selected = this.selectedFormatOption();

    return selected?.helper ?? 'Selecciona un formato para continuar.';
  });

  protected readonly confirmButtonLabel = computed(() => {
    const selected = this.selectedFormatOption();

    if (this.busy()) {
      return selected ? `Preparando ${selected.label}...` : 'Preparando...';
    }

    return selected ? `Exportar ${selected.label}` : 'Exportar';
  });

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close.emit();
    }
  }

  protected selectFormat(formatId: string): void {
    this.selectedFormat.set(formatId);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  protected trackFormat = (_index: number, format: ExportFormatOption): string => format.id;
  protected trackMetric = (_index: number, metric: ExportPreviewMetric): string => metric.label;
  protected trackValue = (_index: number, value: string): string => value;

  ngOnChanges(): void {
    const currentFormats = this.formats();

    if (!currentFormats.length) {
      this.selectedFormat.set('');
      return;
    }

    if (!currentFormats.some((format) => format.id === this.selectedFormat())) {
      this.selectedFormat.set(currentFormats[0].id);
    }
  }
}
