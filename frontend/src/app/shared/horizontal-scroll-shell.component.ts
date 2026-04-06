import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input } from '@angular/core';

@Component({
  selector: 'app-horizontal-scroll-shell',
  standalone: true,
  template: `
    <div
      class="scroll-shell"
      [class.has-overflow]="hasHorizontalOverflow"
      [class.is-overscrolling-left]="overscrollSide === 'left'"
      [class.is-overscrolling-right]="overscrollSide === 'right'"
      [style.--overscroll-distance.px]="overscrollDistance"
      [style.--overscroll-glow]="overscrollGlow"
    >
      <div class="scroll-hint" [class.is-visible]="hasHorizontalOverflow">
        <span class="small text-muted d-md-none">{{ mobileHint() }}</span>
        <span class="small text-muted d-none d-md-inline">{{ desktopHint() }}</span>
      </div>

      <div class="scrollbar-shell" [class.is-hidden]="!hasHorizontalOverflow">
        <div class="scrollbar-rail" #topTrack (pointerdown)="jumpToPosition($event)">
          <button
            #topThumb
            type="button"
            class="scrollbar-thumb"
            [style.width.px]="thumbWidth"
            [style.transform]="'translateX(' + thumbOffset + 'px)'"
            aria-label="Desplazar horizontalmente el contenido"
            (pointerdown)="startDrag($event)"
          ></button>
        </div>
      </div>

      <div
        class="scroll-viewport"
        #viewport
        (scroll)="onViewportScroll()"
        (wheel)="onViewportWheel($event)"
        (touchstart)="onViewportTouchStart($event)"
        (touchmove)="onViewportTouchMove($event)"
        (touchend)="onViewportTouchEnd()"
        (touchcancel)="onViewportTouchEnd()"
      >
        <ng-content></ng-content>
      </div>

      <div class="scrollbar-shell" [class.is-hidden]="!hasHorizontalOverflow">
        <div class="scrollbar-rail" #bottomTrack (pointerdown)="jumpToPosition($event)">
          <button
            #bottomThumb
            type="button"
            class="scrollbar-thumb"
            [style.width.px]="thumbWidth"
            [style.transform]="'translateX(' + thumbOffset + 'px)'"
            aria-label="Desplazar horizontalmente el contenido"
            (pointerdown)="startDrag($event)"
          ></button>
        </div>
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

    .scrollbar-shell {
      padding: 10px 12px 0;
      background: rgba(255, 255, 255, 0.24);
      transition:
        opacity 160ms ease,
        max-height 160ms ease,
        padding 160ms ease;
    }

    .scrollbar-shell.is-hidden {
      opacity: 0;
      max-height: 0;
      padding-top: 0;
      padding-bottom: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .scrollbar-rail {
      position: relative;
      height: 14px;
      width: 100%;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.42);
      box-shadow:
        inset 0 0 0 1px rgba(180, 155, 129, 0.28),
        inset 0 1px 0 rgba(255, 255, 255, 0.45);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      cursor: pointer;
      overflow: hidden;
    }

    .scroll-shell.is-overscrolling-left .scrollbar-rail,
    .scroll-shell.is-overscrolling-right .scrollbar-rail {
      animation: railPulse 280ms ease;
    }

    .scrollbar-thumb {
      position: absolute;
      inset: 2px auto 2px 0;
      min-width: 72px;
      border: 0;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(91, 164, 214, 0.88) 0%, rgba(49, 119, 165, 0.88) 100%);
      box-shadow:
        0 2px 8px rgba(33, 70, 96, 0.16),
        inset 0 0 0 1px rgba(255, 255, 255, 0.28);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      cursor: grab;
      touch-action: none;
      transition:
        background 140ms ease,
        box-shadow 140ms ease,
        opacity 140ms ease;
    }

    .scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(96, 170, 220, 0.94) 0%, rgba(54, 126, 171, 0.94) 100%);
      box-shadow:
        0 3px 10px rgba(33, 70, 96, 0.2),
        inset 0 0 0 1px rgba(255, 255, 255, 0.32);
    }

    .scrollbar-thumb:active {
      cursor: grabbing;
      background: linear-gradient(180deg, rgba(46, 113, 155, 0.96) 0%, rgba(35, 88, 120, 0.96) 100%);
      box-shadow:
        0 1px 5px rgba(33, 70, 96, 0.18),
        inset 0 0 0 1px rgba(255, 255, 255, 0.2);
    }

    .scroll-viewport {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      scrollbar-width: none;
      -ms-overflow-style: none;
      transition: box-shadow 180ms ease, transform 180ms ease;
    }

    .scroll-viewport::-webkit-scrollbar {
      display: none;
    }

    .scroll-shell.is-overscrolling-left .scroll-viewport {
      box-shadow: inset 22px 0 22px -20px rgba(49, 119, 165, var(--overscroll-glow, 0.38));
      animation: overscrollLeft 300ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    .scroll-shell.is-overscrolling-right .scroll-viewport {
      box-shadow: inset -22px 0 22px -20px rgba(49, 119, 165, var(--overscroll-glow, 0.38));
      animation: overscrollRight 300ms cubic-bezier(0.22, 1, 0.36, 1);
    }

    @media (min-width: 1500px) {
      .scroll-hint.is-visible {
        display: none;
      }
    }

    @keyframes overscrollLeft {
      0% { transform: translateX(0); }
      38% { transform: translateX(var(--overscroll-distance, 6px)); }
      100% { transform: translateX(0); }
    }

    @keyframes overscrollRight {
      0% { transform: translateX(0); }
      38% { transform: translateX(calc(var(--overscroll-distance, 6px) * -1)); }
      100% { transform: translateX(0); }
    }

    @keyframes railPulse {
      0% { box-shadow: inset 0 0 0 1px rgba(180, 155, 129, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.45); }
      50% { box-shadow: inset 0 0 0 1px rgba(49, 119, 165, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 0 0 1px rgba(49, 119, 165, 0.08), 0 0 18px rgba(49, 119, 165, 0.06); }
      100% { box-shadow: inset 0 0 0 1px rgba(180, 155, 129, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.45); }
    }
  `],
})
export class HorizontalScrollShellComponent implements AfterViewInit, OnDestroy {
  readonly mobileHint = input('Desliza para ver mas contenido →');
  readonly desktopHint = input('Desplaza horizontalmente para ver mas contenido →');

  @ViewChild('viewport') private readonly viewportRef?: ElementRef<HTMLDivElement>;
  @ViewChild('topTrack') private readonly topTrackRef?: ElementRef<HTMLDivElement>;
  @ViewChild('bottomTrack') private readonly bottomTrackRef?: ElementRef<HTMLDivElement>;

  protected hasHorizontalOverflow = false;
  protected thumbWidth = 120;
  protected thumbOffset = 0;
  protected overscrollSide: 'left' | 'right' | null = null;
  protected overscrollDistance = 6;
  protected overscrollGlow = 0.38;

  private readonly overflowThreshold = 24;
  private resizeObserver?: ResizeObserver;
  private isSyncingScroll = false;
  private dragState: { startX: number; startOffset: number } | null = null;
  private metricsFrameId: number | null = null;
  private overscrollTimer: ReturnType<typeof setTimeout> | null = null;
  private touchStartX: number | null = null;
  private touchStartScrollLeft = 0;

  ngAfterViewInit(): void {
    const viewport = this.viewportRef?.nativeElement;
    const topTrack = this.topTrackRef?.nativeElement;
    const bottomTrack = this.bottomTrackRef?.nativeElement;

    if (!viewport || !topTrack || !bottomTrack) {
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateScrollMetrics();
    });

    this.resizeObserver.observe(viewport);
    this.resizeObserver.observe(topTrack);
    this.resizeObserver.observe(bottomTrack);

    const content = this.getScrollableContent();
    if (content) {
      this.resizeObserver.observe(content);
    }

    window.addEventListener('resize', this.handleWindowResize);
    this.scheduleMetricsUpdate();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.detachDragListeners();
    window.removeEventListener('resize', this.handleWindowResize);

    if (this.metricsFrameId !== null) {
      cancelAnimationFrame(this.metricsFrameId);
    }

    if (this.overscrollTimer !== null) {
      clearTimeout(this.overscrollTimer);
    }
  }

  protected onViewportScroll(): void {
    if (this.isSyncingScroll) {
      return;
    }

    this.updateThumbFromViewport();
  }

  protected onViewportWheel(event: WheelEvent): void {
    const viewport = this.viewportRef?.nativeElement;
    if (!viewport || !this.hasHorizontalOverflow) {
      return;
    }

    const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : (event.shiftKey ? event.deltaY : 0);

    if (!dominantDelta) {
      return;
    }

    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const intensity = Math.min(Math.abs(dominantDelta), 120);

    if (dominantDelta < 0 && viewport.scrollLeft <= 0) {
      this.triggerOverscroll('left', intensity);
    } else if (dominantDelta > 0 && viewport.scrollLeft >= maxScrollLeft - 1) {
      this.triggerOverscroll('right', intensity);
    }
  }

  protected onViewportTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];
    const viewport = this.viewportRef?.nativeElement;

    if (!touch || !viewport) {
      return;
    }

    this.touchStartX = touch.clientX;
    this.touchStartScrollLeft = viewport.scrollLeft;
  }

  protected onViewportTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    const viewport = this.viewportRef?.nativeElement;

    if (!touch || !viewport || this.touchStartX === null || !this.hasHorizontalOverflow) {
      return;
    }

    const deltaX = touch.clientX - this.touchStartX;
    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const intensity = Math.min(Math.abs(deltaX), 80);

    if (deltaX > 18 && viewport.scrollLeft <= 0 && this.touchStartScrollLeft <= 0) {
      this.triggerOverscroll('left', intensity);
    } else if (deltaX < -18 && viewport.scrollLeft >= maxScrollLeft - 1 && this.touchStartScrollLeft >= maxScrollLeft - 1) {
      this.triggerOverscroll('right', intensity);
    }
  }

  protected onViewportTouchEnd(): void {
    this.touchStartX = null;
  }

  protected jumpToPosition(event: PointerEvent): void {
    if ((event.target as HTMLElement).classList.contains('scrollbar-thumb')) {
      return;
    }

    const track = event.currentTarget as HTMLDivElement | null;
    const viewport = this.viewportRef?.nativeElement;

    if (!track || !viewport) {
      return;
    }

    const rect = track.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const maxOffset = Math.max(track.clientWidth - this.thumbWidth, 0);
    const nextOffset = this.clamp(clickX - this.thumbWidth / 2, 0, maxOffset);

    this.scrollViewportByOffset(nextOffset, maxOffset);
  }

  protected startDrag(event: PointerEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.dragState = {
      startX: event.clientX,
      startOffset: this.thumbOffset,
    };

    window.addEventListener('pointermove', this.handlePointerMove);
    window.addEventListener('pointerup', this.handlePointerUp);
  }

  private readonly handlePointerMove = (event: PointerEvent): void => {
    const viewport = this.viewportRef?.nativeElement;
    const topTrack = this.topTrackRef?.nativeElement;

    if (!this.dragState || !viewport || !topTrack) {
      return;
    }

    const maxOffset = Math.max(topTrack.clientWidth - this.thumbWidth, 0);
    const delta = event.clientX - this.dragState.startX;
    const rawOffset = this.dragState.startOffset + delta;
    const nextOffset = this.clamp(this.dragState.startOffset + delta, 0, maxOffset);

    if (rawOffset < 0) {
      this.triggerOverscroll('left', Math.abs(rawOffset - nextOffset));
    } else if (rawOffset > maxOffset) {
      this.triggerOverscroll('right', Math.abs(rawOffset - nextOffset));
    }

    this.scrollViewportByOffset(nextOffset, maxOffset);

    // Rebase the drag on each move so overshooting an edge doesn't create
    // a large dead zone before the thumb starts responding in the opposite direction.
    this.dragState = {
      startX: event.clientX,
      startOffset: nextOffset,
    };
  };

  private readonly handlePointerUp = (): void => {
    this.detachDragListeners();
    this.dragState = null;
  };

  private readonly handleWindowResize = (): void => {
    this.scheduleMetricsUpdate();
  };

  private detachDragListeners(): void {
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
  }

  private scrollViewportByOffset(offset: number, maxOffset: number): void {
    const viewport = this.viewportRef?.nativeElement;
    if (!viewport) {
      return;
    }

    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const ratio = maxOffset === 0 ? 0 : offset / maxOffset;

    this.isSyncingScroll = true;
    viewport.scrollLeft = ratio * maxScrollLeft;
    this.thumbOffset = offset;

    requestAnimationFrame(() => {
      this.isSyncingScroll = false;
    });
  }

  private updateScrollMetrics(): void {
    const viewport = this.viewportRef?.nativeElement;
    const topTrack = this.topTrackRef?.nativeElement;

    if (!viewport || !topTrack) {
      return;
    }

    const viewportWidth = viewport.clientWidth;
    const contentWidth = viewport.scrollWidth;
    const trackWidth = topTrack.clientWidth;
    const maxScrollLeft = Math.max(contentWidth - viewportWidth, 0);
    const hasOverflow = maxScrollLeft > this.overflowThreshold;
    this.hasHorizontalOverflow = hasOverflow;

    if (!hasOverflow || trackWidth <= 0) {
      this.thumbWidth = Math.max(trackWidth, 0);
      this.thumbOffset = 0;
      viewport.scrollLeft = 0;
      return;
    }

    const proportionalWidth = (viewportWidth / contentWidth) * trackWidth;
    this.thumbWidth = Math.max(88, Math.min(trackWidth, proportionalWidth));
    this.updateThumbFromViewport();
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

  private updateThumbFromViewport(): void {
    const viewport = this.viewportRef?.nativeElement;
    const topTrack = this.topTrackRef?.nativeElement;

    if (!viewport || !topTrack) {
      return;
    }

    const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
    const maxOffset = Math.max(topTrack.clientWidth - this.thumbWidth, 0);
    const ratio = maxScrollLeft === 0 ? 0 : viewport.scrollLeft / maxScrollLeft;

    this.thumbOffset = ratio * maxOffset;
  }

  private getScrollableContent(): HTMLElement | null {
    const viewport = this.viewportRef?.nativeElement;
    return viewport?.firstElementChild instanceof HTMLElement ? viewport.firstElementChild : null;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private triggerOverscroll(side: 'left' | 'right', intensity = 40): void {
    if (this.overscrollTimer !== null) {
      clearTimeout(this.overscrollTimer);
      this.overscrollTimer = null;
    }

    const normalized = Math.max(0, Math.min(intensity, 120)) / 120;
    this.overscrollDistance = 5 + normalized * 6;
    this.overscrollGlow = 0.28 + normalized * 0.24;

    if (this.overscrollSide === side) {
      this.overscrollSide = null;
      requestAnimationFrame(() => {
        this.overscrollSide = side;
        this.scheduleOverscrollReset();
      });
      return;
    }

    this.overscrollSide = side;
    this.scheduleOverscrollReset();
  }

  private scheduleOverscrollReset(): void {
    this.overscrollTimer = setTimeout(() => {
      this.overscrollSide = null;
      this.overscrollTimer = null;
    }, 300);
  }
}
