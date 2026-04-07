import { NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll-shell',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="scroll-shell" [class.has-overflow]="hasHorizontalOverflow">
      <div class="scroll-hint" [class.is-visible]="hasHorizontalOverflow">
        <span class="small text-muted d-md-none">{{ mobileHint() }}</span>
        <span class="small text-muted d-none d-md-inline">{{ desktopHint() }}</span>
      </div>

      <div
        *ngIf="hasHorizontalOverflow && showTopScrollbar"
        class="scrollbar-top"
        #topScrollbar
        (scroll)="onTopScrollbarScroll()"
      >
        <div class="scrollbar-top-spacer" [style.width.px]="scrollContentWidth"></div>
      </div>

      <div
        class="scroll-viewport"
        #viewport
        (scroll)="onViewportScroll()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-width: 0;
    }

    .scroll-shell {
      position: relative;
      display: block;
    }

    .scroll-hint {
      display: none;
      align-items: center;
      justify-content: center;
      padding: 10px 14px;
      border-bottom: 1px solid rgba(216, 195, 175, 0.55);
      background: rgba(244, 248, 252, 0.7);
      text-align: center;
    }

    .scroll-hint.is-visible {
      display: flex;
    }

    .scroll-viewport {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      overscroll-behavior-y: auto;
      touch-action: pan-x pan-y;
      padding-bottom: 2px;
    }

    .scrollbar-top {
      width: 100%;
      max-width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      overscroll-behavior-y: auto;
      touch-action: pan-x pan-y;
      padding-bottom: 2px;
      margin-bottom: 8px;
    }

    .scrollbar-top-spacer {
      height: 1px;
    }

    @media (min-width: 1500px) {
      .scroll-hint.is-visible {
        display: none;
      }
    }

    @media (hover: none) and (pointer: coarse) {
      .scroll-viewport {
        padding-bottom: 4px;
      }
    }

  `],
})
export class HorizontalScrollShellComponent implements AfterViewInit, OnDestroy {
  readonly mobileHint = input('Desliza para ver mas contenido ->');
  readonly desktopHint = input('Desplaza horizontalmente para ver mas contenido ->');

  @ViewChild('viewport') private readonly viewportRef?: ElementRef<HTMLDivElement>;
  @ViewChild('topScrollbar') private readonly topScrollbarRef?: ElementRef<HTMLDivElement>;

  protected hasHorizontalOverflow = false;
  protected scrollContentWidth = 0;
  protected showTopScrollbar = true;

  private readonly overflowThreshold = 24;
  private resizeObserver?: ResizeObserver;
  private metricsFrameId: number | null = null;
  private isSyncingScroll = false;
  private pointerMediaQuery?: MediaQueryList;
  private readonly pointerMediaQueryHandler = () => {
    this.showTopScrollbar = this.pointerMediaQuery?.matches ?? true;
    this.scheduleMetricsUpdate();
  };

  ngAfterViewInit(): void {
    const viewport = this.viewportRef?.nativeElement;

    if (!viewport) {
      return;
    }

    if (typeof window !== 'undefined') {
      this.pointerMediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
      this.pointerMediaQueryHandler();
      this.pointerMediaQuery.addEventListener?.('change', this.pointerMediaQueryHandler);
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateScrollMetrics();
    });

    this.resizeObserver.observe(viewport);

    const content = this.getScrollableContent();
    if (content) {
      this.resizeObserver.observe(content);
    }

    this.scheduleMetricsUpdate();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.pointerMediaQuery?.removeEventListener?.('change', this.pointerMediaQueryHandler);

    if (this.metricsFrameId !== null) {
      cancelAnimationFrame(this.metricsFrameId);
    }
  }

  private updateScrollMetrics(): void {
    const viewport = this.viewportRef?.nativeElement;

    if (!viewport) {
      return;
    }

    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const hasOverflow = maxScrollLeft > this.overflowThreshold;
    this.hasHorizontalOverflow = hasOverflow;
    this.scrollContentWidth = viewport.scrollWidth;

    const topScrollbar = this.topScrollbarRef?.nativeElement;
    if (topScrollbar) {
      topScrollbar.scrollLeft = viewport.scrollLeft;
    }
  }

  private scheduleMetricsUpdate(): void {
    if (this.metricsFrameId !== null) {
      cancelAnimationFrame(this.metricsFrameId);
    }

    this.metricsFrameId = requestAnimationFrame(() => {
      this.metricsFrameId = requestAnimationFrame(() => {
        this.metricsFrameId = null;
        this.updateScrollMetrics();
      });
    });
  }

  private getScrollableContent(): HTMLElement | null {
    const viewport = this.viewportRef?.nativeElement;
    return viewport?.firstElementChild instanceof HTMLElement ? viewport.firstElementChild : null;
  }

  protected onViewportScroll(): void {
    const viewport = this.viewportRef?.nativeElement;
    const topScrollbar = this.topScrollbarRef?.nativeElement;

    if (!viewport || !topScrollbar || this.isSyncingScroll || !this.showTopScrollbar) {
      return;
    }

    this.isSyncingScroll = true;
    topScrollbar.scrollLeft = viewport.scrollLeft;
    this.isSyncingScroll = false;
  }

  protected onTopScrollbarScroll(): void {
    const viewport = this.viewportRef?.nativeElement;
    const topScrollbar = this.topScrollbarRef?.nativeElement;

    if (!viewport || !topScrollbar || this.isSyncingScroll || !this.showTopScrollbar) {
      return;
    }

    this.isSyncingScroll = true;
    viewport.scrollLeft = topScrollbar.scrollLeft;
    this.isSyncingScroll = false;
  }
}
