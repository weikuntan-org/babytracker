// Inline photo thumbnail for entry rows and the photo-attach button.
// Resolves the entry's `media-source://` URL via HA's
// `media_source/resolve_media` WS command (the underlying file is
// served by HA's media_source integration with a short-lived signed
// token), renders a thumbnail at `size` px, and pops a click-to-close
// lightbox on tap.
//
// Falls back to the existing 📷 emoji indicator when resolution
// fails or the image itself fails to load, so a temporarily missing
// CDN photo never leaves the row blank. Failures are logged via
// `console.warn("babytracker: …")` so users hitting the fallback can
// diagnose from devtools.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("bt-entry-thumbnail")
export class EntryThumbnail extends LitElement {
    @property({ attribute: false }) hass?: any;

    @property() photoPath = "";

    /** Edge length in pixels for the inline thumbnail. Defaults to 128
     * — large enough to actually see the photo in entry rows and the
     * edit modal. Override per-instance for tighter layouts. The
     * lightbox is unaffected. */
    @property({ type: Number }) size = 128;

    @state() private _url = "";
    @state() private _failed = false;
    @state() private _open = false;

    private _lastResolved = "";
    // Bumped on every `_maybeResolve` call. The async callback drops its
    // result if the token has moved on, so a slow resolve for an
    // already-replaced `photoPath` can't overwrite the newer `_url`.
    private _resolveToken = 0;

    public updated(changed: Map<string, unknown>): void {
        if (changed.has("hass") || changed.has("photoPath")) {
            this._maybeResolve();
        }
    }

    public disconnectedCallback(): void {
        // The keydown listener is only attached while the lightbox is
        // open, but tearing down on disconnect avoids a stale listener
        // if the row is removed mid-view (e.g. an entries refresh).
        this._detachKeyHandler();
        super.disconnectedCallback();
    }

    private async _maybeResolve(): Promise<void> {
        if (!this.hass?.connection || !this.photoPath) return;
        if (this._lastResolved === this.photoPath && this._url) return;
        this._lastResolved = this.photoPath;
        const token = ++this._resolveToken;
        try {
            const result = await this.hass.callWS({
                type: "media_source/resolve_media",
                media_content_id: this.photoPath
            });
            if (token !== this._resolveToken) return;
            const url = (result as any)?.url;
            if (typeof url === "string" && url.length > 0) {
                this._url = url;
                this._failed = false;
            } else {
                console.warn(
                    "babytracker: resolve photo returned no url",
                    this.photoPath,
                    result
                );
                this._failed = true;
            }
        } catch (err) {
            if (token !== this._resolveToken) return;
            console.warn(
                "babytracker: resolve photo failed",
                this.photoPath,
                err
            );
            this._failed = true;
        }
    }

    private _onKeydown = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
            e.preventDefault();
            this._close_lightbox();
        }
    };

    private _attachKeyHandler(): void {
        window.addEventListener("keydown", this._onKeydown);
    }

    private _detachKeyHandler(): void {
        window.removeEventListener("keydown", this._onKeydown);
    }

    private _open_lightbox = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        if (!this._url || this._open) return;
        this._open = true;
        this._attachKeyHandler();
    };

    private _close_lightbox = (e?: Event): void => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!this._open) return;
        this._open = false;
        this._detachKeyHandler();
    };

    private _onImgError = (): void => {
        console.warn(
            "babytracker: thumbnail img failed to load",
            this.photoPath,
            this._url
        );
        this._failed = true;
    };

    render(): TemplateResult {
        if (!this.photoPath) return html``;
        if (this._failed || !this._url) {
            // The card already used 📷 as the indicator pre-thumbnail;
            // keep it as the failure mode so a slow resolve doesn't
            // produce a row that visually loses its "has photo" cue.
            return html`<span aria-label="Has photo">📷</span>`;
        }
        const sizePx = `${this.size}px`;
        return html`
            <button
                class="thumb-btn"
                type="button"
                aria-label="View photo"
                title="View photo"
                @click=${this._open_lightbox}
            >
                <img
                    class="thumb"
                    src=${this._url}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style="width:${sizePx};height:${sizePx}"
                    @error=${this._onImgError}
                />
            </button>
            ${this._open
                ? html`
                      <div
                          class="lightbox"
                          role="dialog"
                          aria-modal="true"
                          aria-label="Entry photo"
                          @click=${this._close_lightbox}
                      >
                          <button
                              type="button"
                              class="close"
                              aria-label="Close photo viewer"
                              @click=${this._close_lightbox}
                          >
                              ✕
                          </button>
                          <img
                              class="full"
                              src=${this._url}
                              alt="Entry photo"
                              @click=${(e: Event) => e.stopPropagation()}
                          />
                      </div>
                  `
                : ""}
        `;
    }

    static styles = css`
        :host {
            display: inline-flex;
            align-items: center;
        }
        .thumb-btn {
            padding: 0;
            border: 0;
            background: none;
            cursor: zoom-in;
            line-height: 0;
        }
        .thumb {
            /* Width/height come from an inline style attribute so each
             * instance can pick its own size without a CSS variable. */
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid var(--divider-color);
            vertical-align: middle;
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
        }
        .full {
            max-width: 92vw;
            max-height: 90vh;
            cursor: default;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.55);
        }
        .close {
            position: fixed;
            top: 16px;
            right: 16px;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            border: 1px solid rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            width: 36px;
            height: 36px;
            font-size: 1.1rem;
            cursor: pointer;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "bt-entry-thumbnail": EntryThumbnail;
    }
}
