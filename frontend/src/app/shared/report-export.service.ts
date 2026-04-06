import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';

export interface ExportColumn<T> {
  key: string;
  label: string;
  value: (row: T) => string | number | boolean | null | undefined;
}

export interface ExportSummaryItem {
  label: string;
  value: string | number;
}

export interface ExportDocumentConfig<T> {
  fileName: string;
  title: string;
  subtitle?: string;
  rows: T[];
  columns: ExportColumn<T>[];
  summary?: ExportSummaryItem[];
  filters?: string[];
}

@Injectable({ providedIn: 'root' })
export class ReportExportService {
  private readonly document = inject(DOCUMENT);

  downloadCsv<T>(config: ExportDocumentConfig<T>): void {
    const header = config.columns.map((column) => this.escapeCsvCell(column.label)).join(',');
    const rows = config.rows.map((row) =>
      config.columns.map((column) => this.escapeCsvCell(column.value(row))).join(','),
    );

    const csvContent = [header, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');

    link.href = url;
    link.download = `${config.fileName}.csv`;
    link.style.display = 'none';

    this.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  downloadJson<T>(config: ExportDocumentConfig<T>): void {
    const payload = {
      title: config.title,
      subtitle: config.subtitle ?? null,
      generated_at: this.buildPrintedAt(),
      summary: config.summary ?? [],
      filters: config.filters ?? [],
      rows: config.rows.map((row) =>
        Object.fromEntries(
          config.columns.map((column) => [column.key, column.value(row) ?? null]),
        ),
      ),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement('a');

    link.href = url;
    link.download = `${config.fileName}.json`;
    link.style.display = 'none';

    this.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  openPreviewWindow(title: string, previewPath?: string): Window | null {
    const previewWindow = window.open('', '_blank');

    if (!previewWindow) {
      return null;
    }

    previewWindow.document.open();
    previewWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${this.escapeHtml(title)}</title>
          <style>
            body {
              margin: 0;
              padding: 32px;
              font-family: "Segoe UI", sans-serif;
              color: #1f1d1a;
              background: #f7fafc;
            }

            .print-loading {
              display: grid;
              place-items: center;
              min-height: 40vh;
              color: #5d6b78;
              font-size: 16px;
            }
          </style>
        </head>
        <body>
          <div class="print-loading">Preparando exportacion...</div>
        </body>
      </html>
    `);
    previewWindow.document.close();
    this.setPreviewWindowPath(previewWindow, previewPath);
    this.restoreHostFocus(previewWindow);

    return previewWindow;
  }

  renderPreviewDocument<T>(
    previewWindow: Window | null,
    config: ExportDocumentConfig<T>,
    previewPath?: string,
  ): void {
    if (!previewWindow) {
      return;
    }

    const summaryMarkup = config.summary?.length
      ? `
        <section class="summary-grid">
          ${config.summary
            .map((item) => `
              <article class="summary-card">
                <span>${this.escapeHtml(item.label)}</span>
                <strong>${this.escapeHtml(item.value)}</strong>
              </article>
            `)
            .join('')}
        </section>
      `
      : '';

    const filtersMarkup = config.filters?.length
      ? `
        <section class="filters">
          ${config.filters
            .map((filter) => `<span class="filter-chip">${this.escapeHtml(filter)}</span>`)
            .join('')}
        </section>
      `
      : '';

    const headers = config.columns
      .map((column) => `<th>${this.escapeHtml(column.label)}</th>`)
      .join('');

    const rows = config.rows
      .map((row) => `
        <tr>
          ${config.columns
            .map((column) => `<td>${this.escapeHtml(column.value(row))}</td>`)
            .join('')}
        </tr>
      `)
      .join('');

    previewWindow.document.open();
    previewWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <title>${this.escapeHtml(config.title)}</title>
          <style>
            body {
              margin: 0;
              padding: 28px;
              font-family: "Segoe UI", sans-serif;
              color: #1f1d1a;
              background: white;
            }

            .document {
              display: grid;
              gap: 18px;
            }

            .preview-note {
              margin: 0;
              padding: 10px 12px;
              border-radius: 14px;
              border: 1px solid #d9e7f2;
              background: #f5f9fc;
              color: #4f6272;
              font-size: 12px;
              line-height: 1.5;
            }

            .header {
              display: grid;
              gap: 6px;
            }

            .eyebrow {
              color: #7a7268;
              font-size: 11px;
              font-weight: 700;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }

            h1 {
              margin: 0;
              font-size: 28px;
              line-height: 1.08;
              color: #22303c;
            }

            .subtitle,
            .meta {
              margin: 0;
              color: #5d6b78;
              font-size: 13px;
              line-height: 1.5;
            }

            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
              gap: 12px;
            }

            .summary-card {
              display: grid;
              gap: 4px;
              padding: 12px 14px;
              border: 1px solid #d9e7f2;
              border-radius: 14px;
              background: #f5f9fc;
            }

            .summary-card span {
              color: #6d7882;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.06em;
            }

            .summary-card strong {
              color: #22303c;
              font-size: 18px;
            }

            .filters {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
            }

            .filter-chip {
              display: inline-flex;
              align-items: center;
              min-height: 28px;
              padding: 4px 10px;
              border-radius: 999px;
              background: #eef6fc;
              color: #255c80;
              font-size: 12px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 12px;
            }

            thead th {
              padding: 10px 12px;
              background: #eaf3fb;
              color: #255c80;
              border: 1px solid #d9e7f2;
              text-align: left;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 0.04em;
            }

            tbody td {
              padding: 10px 12px;
              border: 1px solid #e7edf2;
              color: #2c2925;
              vertical-align: top;
              word-break: break-word;
            }

            tbody tr:nth-child(even) td {
              background: #fafcfe;
            }

            @media print {
              body {
                padding: 18px;
              }
            }
          </style>
        </head>
        <body>
          <article class="document">
            <p class="preview-note">
              Esta vista se abrio en una nueva pestaña. Usa la impresion del navegador para guardarla como PDF o imprimirla cuando lo necesites.
            </p>
            <header class="header">
              <span class="eyebrow">Exportacion de reporte</span>
              <h1>${this.escapeHtml(config.title)}</h1>
              ${config.subtitle ? `<p class="subtitle">${this.escapeHtml(config.subtitle)}</p>` : ''}
              <p class="meta">Generado el ${this.escapeHtml(this.buildPrintedAt())}</p>
            </header>
            ${summaryMarkup}
            ${filtersMarkup}
            <table>
              <thead>
                <tr>${headers}</tr>
              </thead>
              <tbody>
                ${rows || `<tr><td colspan="${config.columns.length}">No hay datos para exportar.</td></tr>`}
              </tbody>
            </table>
          </article>
        </body>
      </html>
    `);
    previewWindow.document.close();
    this.setPreviewWindowPath(previewWindow, previewPath);
    this.restoreHostFocus(previewWindow);
  }

  private escapeCsvCell(value: unknown): string {
    const normalized = String(value ?? '').replace(/"/g, '""');
    return `"${normalized}"`;
  }

  private escapeHtml(value: unknown): string {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private setPreviewWindowPath(previewWindow: Window, previewPath?: string): void {
    const fallbackPath = this.document.defaultView?.location.pathname ?? '/';
    const nextPath = previewPath?.trim() || fallbackPath;

    try {
      previewWindow.history.replaceState({ printPreview: true }, '', nextPath);
    } catch {
      // Some browsers may restrict history updates in popup previews.
    }
  }

  private restoreHostFocus(previewWindow: Window): void {
    try {
      previewWindow.blur();
    } catch {
      // Ignore focus management restrictions.
    }

    try {
      this.document.defaultView?.focus();
    } catch {
      // Browsers may block returning focus to the opener.
    }
  }

  private buildPrintedAt(): string {
    return new Intl.DateTimeFormat('es-EC', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  }
}
