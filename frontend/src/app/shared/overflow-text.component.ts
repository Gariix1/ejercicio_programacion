import { Component, ElementRef, OnChanges, ViewChild, input } from '@angular/core';

@Component({
  selector: 'app-overflow-text',
  standalone: true,
  template: `
    <button
      #content
      type="button"
      class="overflow-text"
      [class.is-interactive]="hasOverflow"
      [class.is-expanded]="expanded"
      [attr.title]="displayValue"
      [attr.aria-expanded]="hasOverflow ? expanded : null"
      [attr.aria-label]="hasOverflow ? 'Ver texto completo' : null"
      (pointerenter)="measureOverflow()"
      (focus)="measureOverflow()"
      (touchstart)="measureOverflow()"
      (click)="toggleExpanded()"
    >
      {{ displayValue }}
    </button>
  `,
  styles: [`
    :host {
      display: block;
      min-width: 0;
    }

    .overflow-text {
      display: block;
      width: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: inherit;
      line-height: inherit;
      text-align: inherit;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      cursor: default;
    }

    .overflow-text.is-interactive {
      cursor: zoom-in;
    }

    .overflow-text.is-expanded {
      padding: 0.24rem 0.3rem;
      border-radius: 8px;
      background: rgba(116, 168, 213, 0.12);
      box-shadow: inset 0 0 0 1px rgba(116, 168, 213, 0.28);
      white-space: normal;
      overflow: visible;
      text-overflow: clip;
      overflow-wrap: anywhere;
      word-break: break-word;
      cursor: zoom-out;
    }

    .overflow-text:focus-visible {
      outline: 2px solid rgba(49, 119, 165, 0.38);
      outline-offset: 2px;
      border-radius: 6px;
    }
  `],
})
export class OverflowTextComponent implements OnChanges {
  readonly value = input<string | null | undefined>('');
  readonly placeholder = input('-');

  @ViewChild('content') private readonly contentRef?: ElementRef<HTMLButtonElement>;

  protected hasOverflow = false;
  protected expanded = false;

  protected get displayValue(): string {
    const value = this.value();
    if (value == null) {
      return this.placeholder();
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : this.placeholder();
  }

  ngOnChanges(): void {
    this.expanded = false;
    this.hasOverflow = false;
  }

  protected toggleExpanded(): void {
    this.measureOverflow();

    if (!this.hasOverflow) {
      return;
    }

    this.expanded = !this.expanded;
  }

  protected measureOverflow(): void {
    const content = this.contentRef?.nativeElement;
    if (!content) {
      return;
    }

    const wasExpanded = this.expanded;
    if (wasExpanded) {
      content.classList.remove('is-expanded');
    }

    this.hasOverflow = content.scrollWidth - content.clientWidth > 1;

    if (wasExpanded) {
      content.classList.add('is-expanded');
    }

    if (!this.hasOverflow) {
      this.expanded = false;
    }
  }
}
