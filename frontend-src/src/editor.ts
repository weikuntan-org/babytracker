// GUI editor for the babytracker-card (§9.1 / §15 #34).
import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";

export interface CardEditorConfig {
    type: string;
    baby: string;
    sections?: string[];
    units?: { volume?: string; weight?: string; length?: string };
    recent_limit?: number;
}

@customElement("babytracker-card-editor")
export class BabytrackerCardEditor extends LitElement {
    @property({ attribute: false }) public hass?: any;
    @property({ attribute: false }) private _config!: CardEditorConfig;

    static styles = css`
        :host {
            display: block;
            padding: 12px;
        }
        label {
            display: block;
            font-size: 0.9rem;
            margin: 8px 0 4px;
            color: var(--primary-text-color);
        }
        input,
        select {
            width: 100%;
            padding: 6px 8px;
            background: var(--secondary-background-color);
            color: var(--primary-text-color);
            border: 1px solid var(--divider-color);
            border-radius: 6px;
        }
    `;

    public setConfig(config: CardEditorConfig): void {
        this._config = { ...config };
    }

    private _valueChanged(field: keyof CardEditorConfig, value: unknown): void {
        const next = { ...this._config, [field]: value };
        this.dispatchEvent(
            new CustomEvent("config-changed", {
                detail: { config: next },
                bubbles: true,
                composed: true
            })
        );
    }

    protected render(): TemplateResult {
        return html`
            <label for="baby">Baby slug</label>
            <input
                id="baby"
                aria-label="Baby slug"
                .value=${this._config.baby ?? ""}
                @change=${(e: Event) =>
                    this._valueChanged(
                        "baby",
                        (e.target as HTMLInputElement).value
                    )}
            />
            <label for="recent_limit">Recent entries to show</label>
            <input
                id="recent_limit"
                type="number"
                min="1"
                max="50"
                aria-label="Recent entries to show"
                .value=${String(this._config.recent_limit ?? 10)}
                @change=${(e: Event) =>
                    this._valueChanged(
                        "recent_limit",
                        Number((e.target as HTMLInputElement).value)
                    )}
            />
        `;
    }
}

// Make the editor discoverable from setConfig
(BabytrackerCardEditor as unknown as { getConfigElement?: () => HTMLElement }).getConfigElement =
    function getConfigElement() {
        return document.createElement("babytracker-card-editor");
    };
