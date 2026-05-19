// Photo-attach button that uploads a single image to
// `/config/media/babytracker/<uuid>.<ext>` and exposes the resulting
// `media-source://` path on the element's `.value` property. Form submit
// handlers read it via `form.querySelector("bt-photo-button")?.value`.
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { uploadPhoto, PhotoUploadError } from "../lib/photo-upload";

@customElement("bt-photo-button")
export class PhotoButton extends LitElement {
    @property({ attribute: false }) hass?: any;

    /** Current photo path. Read by form submit handlers. */
    @property() value = "";

    @state() private _busy = false;
    @state() private _error = "";

    @query("input[type=file]") private _fileInput?: HTMLInputElement;

    private get _supported(): boolean {
        return Boolean(this.hass?.connection);
    }

    private _setValue(v: string): void {
        this.value = v;
        this.dispatchEvent(
            new CustomEvent("photo-changed", {
                detail: { value: v },
                bubbles: true,
                composed: true
            })
        );
    }

    private async _onPick(e: Event): Promise<void> {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];
        // Reset so picking the same file twice re-fires the change event.
        input.value = "";
        if (!file) return;
        this._busy = true;
        this._error = "";
        try {
            const { photo_path } = await uploadPhoto(this.hass, file);
            this._setValue(photo_path);
        } catch (err) {
            const msg =
                err instanceof PhotoUploadError
                    ? err.message
                    : "Photo upload failed";
            this._error = msg;
            console.warn("babytracker: photo upload failed", err);
        } finally {
            this._busy = false;
        }
    }

    private _onClickAdd = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        this._error = "";
        this._fileInput?.click();
    };

    private _onClickRemove = (e: MouseEvent): void => {
        e.preventDefault();
        e.stopPropagation();
        this._setValue("");
    };

    render(): TemplateResult {
        if (!this._supported) return html``;
        return html`
            <div class="row">
                ${this.value
                    ? html`
                          <span class="thumb" aria-label="Photo attached"
                              >📷</span
                          >
                          <span class="path muted" title=${this.value}
                              >Photo attached</span
                          >
                          <button
                              type="button"
                              class="remove"
                              aria-label="Remove photo"
                              title="Remove photo"
                              @click=${this._onClickRemove}
                          >
                              ✕
                          </button>
                      `
                    : html`
                          <button
                              type="button"
                              class="add"
                              aria-label="Add photo"
                              title="Add photo"
                              ?disabled=${this._busy}
                              @click=${this._onClickAdd}
                          >
                              ${this._busy ? "…" : "📷"}
                          </button>
                      `}
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    @change=${this._onPick}
                    hidden
                />
            </div>
            ${this._error
                ? html`<div class="error" role="alert">${this._error}</div>`
                : ""}
        `;
    }

    static styles = css`
        :host {
            display: inline-block;
        }
        .row {
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        button {
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 6px;
            padding: 6px 10px;
            font-size: 1rem;
            cursor: pointer;
            min-width: 36px;
        }
        button.remove {
            padding: 2px 8px;
            min-width: 0;
        }
        button[disabled] {
            opacity: 0.7;
            cursor: progress;
        }
        .thumb {
            font-size: 1.1rem;
        }
        .path {
            font-size: 0.85rem;
        }
        .muted {
            color: var(--secondary-text-color);
        }
        .error {
            color: var(--error-color, #d33);
            font-size: 0.8rem;
            margin-top: 4px;
        }
    `;
}

declare global {
    interface HTMLElementTagNameMap {
        "bt-photo-button": PhotoButton;
    }
}
