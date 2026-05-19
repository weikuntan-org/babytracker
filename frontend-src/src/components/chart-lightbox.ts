// Click-to-expand wrapper around an SVG chart. The chart is passed as a
// `renderChart` callable so the same TemplateResult can be rendered once
// in-place and again inside the fullscreen overlay without sharing
// state. Mirrors the entry-thumbnail lightbox UX (ESC + backdrop click
// close, focusable surface) so users get one consistent expand affordance
// across photos and charts.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("bt-chart-lightbox")
export class ChartLightbox extends LitElement {
    /** Accessible label for the expand button and the lightbox title. */
    @property() label = "";

    /** Render the chart contents. Called once for the inline view and a
     *  second time when the lightbox opens — must be pure (no side
     *  effects, no stateful refs). */
    @property({ attribute: false }) renderChart: (() => unknown) | null =
        null;

    @state() private _open = false;

    public disconnectedCallback(): void {
        // If the chart re-renders mid-view (e.g. a fresh growth entry
        // streams in), the host can be torn down while the lightbox is
        // open. Drop the global keydown listener so it doesn't leak.
        this._detachKeyHandler();
        super.disconnectedCallback();
    }

    private _onKeydown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
            e.preventDefault();
            this._close();
        }
    };

    private _attachKeyHandler(): void {
        window.addEventListener("keydown", this._onKeydown);
    }

    private _detachKeyHandler(): void {
        window.removeEventListener("keydown", this._onKeydown);
    }

    private _openLb = (e: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        if (this._open || !this.renderChart) return;
        this._open = true;
        this._attachKeyHandler();
    };

    private _close = (e?: Event): void => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!this._open) return;
        this._open = false;
        this._detachKeyHandler();
    };

    private _onKeydownActivate = (e: KeyboardEvent): void => {
        if (e.key === "Enter" || e.key === " ") {
            this._openLb(e);
        }
    };

    render(): TemplateResult {
        const chart = this.renderChart?.();
        return html`
            <div
                class="surface"
                role="button"
                tabindex="0"
                aria-label=${`Expand ${this.label}`}
                @click=${this._openLb}
                @keydown=${this._onKeydownActivate}
            >
                ${chart}
                <span class="hint" aria-hidden="true">⛶</span>
            </div>
            ${this._open
                ? html`
                      <div
                          class="lightbox"
                          role="dialog"
                          aria-modal="true"
                          aria-label=${this.label}
                          @click=${this._close}
                      >
                          <div
                              class="lightbox-card"
                              @click=${(ev: Event) => ev.stopPropagation()}
                          >
                              <div class="lightbox-head">
                                  <div class="lightbox-title">
                                      ${this.label}
                                  </div>
                                  <button
                                      type="button"
                                      class="close"
                                      aria-label="Close"
                                      @click=${this._close}
                                  >
                                      ✕
                                  </button>
                              </div>
                              <div class="lightbox-body">
                                  ${this.renderChart?.()}
                              </div>
                          </div>
                      </div>
                  `
                : ""}
        `;
    }

    static styles = css`
        :host {
            display: block;
        }
        .surface {
            position: relative;
            cursor: zoom-in;
            border-radius: 4px;
        }
        .surface:hover .hint,
        .surface:focus-visible .hint {
            opacity: 1;
        }
        .surface:focus-visible {
            outline: 2px solid var(--primary-color);
            outline-offset: 2px;
        }
        .hint {
            position: absolute;
            top: 2px;
            right: 4px;
            font-size: 0.85rem;
            color: var(--secondary-text-color);
            opacity: 0;
            transition: opacity 120ms ease-in-out;
            pointer-events: none;
        }
        .lightbox {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.88);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: zoom-out;
            padding: 16px;
        }
        .lightbox-card {
            background: var(--card-background-color, #fff);
            color: var(--primary-text-color);
            padding: 16px;
            border-radius: 12px;
            max-width: 96vw;
            max-height: 92vh;
            overflow: auto;
            cursor: default;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: min(900px, 96vw);
        }
        .lightbox-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }
        .lightbox-title {
            font-weight: 600;
            font-size: 1rem;
        }
        .close {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 0.95rem;
            cursor: pointer;
        }
        .lightbox-body {
            /* Charts already render at width:100% inside their wrappers;
             * giving the body a generous min-height lets a 90 px chart
             * grow proportionally so it's not lost in the dialog. */
            min-height: min(60vh, 480px);
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .lightbox-body :is(svg) {
            height: auto;
            max-height: 70vh;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "bt-chart-lightbox": ChartLightbox;
    }
}
