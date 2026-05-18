/*!
 * babytracker-card — bundled Lovelace card for the babytracker HA integration.
 *
 * Source-of-truth: frontend-src/src/babytracker-card.ts.
 * This vanilla-JS artefact is what HA loads. release.yml fails the
 * release if a fresh `npm run build` produces a different file.
 */
(() => {
    if (customElements.get("babytracker-card")) return;

    const DEFAULT_SECTIONS = [
        "status",
        "quick_log",
        "active_session",
        "vaccines",
        "growth",
        "recent",
        "export"
    ];
    const DEFAULT_ACTIVITIES = [
        "feeding",
        "sleep",
        "tummy_time",
        "diaper",
        "growth",
        "medication",
        "vaccine"
    ];
    const DEFAULT_METHODS = ["bottle", "breast_left", "breast_right", "solids"];

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function timeSince(iso) {
        if (!iso || iso === "unknown" || iso === "unavailable") return "—";
        const then = Date.parse(iso);
        if (Number.isNaN(then)) return "—";
        const mins = Math.floor((Date.now() - then) / 60000);
        if (mins < 1) return "now";
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        return hrs < 24 ? `${hrs}h ${mins % 60}m` : `${Math.floor(hrs / 24)}d`;
    }

    function state(hass, slug, suffix, domain = "sensor") {
        return hass?.states?.[`${domain}.${slug}_${suffix}`];
    }

    class BabytrackerCard extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this._config = null;
            this._hass = null;
            this._babyConfig = null;
            this._options = null;
            this._unsubBaby = null;
            this._unsubOptions = null;
            this._renderRaf = null;
        }

        setConfig(config) {
            if (!config?.baby) throw new Error("babytracker-card: 'baby' is required");
            this._config = config;
            this._maybeRender();
        }

        getCardSize() {
            return 6;
        }

        set hass(hass) {
            this._hass = hass;
            this._maybeSubscribe();
            this._maybeRender();
        }

        get hass() {
            return this._hass;
        }

        connectedCallback() {
            this._maybeSubscribe();
            this._maybeRender();
        }

        disconnectedCallback() {
            this._unsubBaby?.();
            this._unsubOptions?.();
            this._unsubBaby = null;
            this._unsubOptions = null;
        }

        _maybeSubscribe() {
            if (!this._hass || !this._config) return;
            if (!this._unsubBaby) {
                this._unsubBaby = this._subscribeWS(
                    {
                        type: "babytracker/get_baby_config",
                        baby: this._config.baby,
                        subscribe: true
                    },
                    (data) => {
                        this._babyConfig = data;
                        this._maybeRender();
                    }
                );
            }
            if (!this._unsubOptions) {
                this._unsubOptions = this._subscribeWS(
                    {
                        type: "babytracker/get_integration_options",
                        subscribe: true
                    },
                    (data) => {
                        this._options = data;
                        this._maybeRender();
                    }
                );
            }
        }

        _subscribeWS(msg, cb) {
            const holder = { unsub: null };
            (async () => {
                try {
                    holder.unsub = await this._hass.connection.subscribeMessage(
                        cb,
                        msg
                    );
                } catch (err) {
                    console.warn("babytracker: subscribe failed", err);
                }
            })();
            return () => holder.unsub?.();
        }

        _maybeRender() {
            if (this._renderRaf) cancelAnimationFrame(this._renderRaf);
            this._renderRaf = requestAnimationFrame(() => {
                this._renderRaf = null;
                this._render();
            });
        }

        _callService(service, data) {
            if (!this._hass) return Promise.resolve();
            return this._hass.callService("babytracker", service, data);
        }

        async _exportReport() {
            const end = new Date();
            const start = new Date(end.getTime() - 90 * 86_400_000);
            const fmt = (d) => d.toISOString().slice(0, 10);
            try {
                const response = await this._hass.callService(
                    "babytracker",
                    "export_report",
                    {
                        baby: this._config.baby,
                        format: "html",
                        start: fmt(start),
                        end: fmt(end)
                    },
                    undefined,
                    false,
                    true
                );
                const url = response?.response?.url;
                if (url) window.open(url, "_blank", "noopener");
            } catch (err) {
                console.warn("babytracker: export failed", err);
            }
        }

        _sections() {
            return this._config?.sections ?? DEFAULT_SECTIONS;
        }

        _renderStatus() {
            const slug = this._config.baby;
            const lastFeeding = state(this._hass, slug, "last_feeding")?.state;
            const lastDiaper = state(this._hass, slug, "last_diaper")?.state;
            const sleeping =
                state(this._hass, slug, "sleeping", "binary_sensor")?.state === "on";
            const atDaycare =
                state(this._hass, slug, "at_daycare", "binary_sensor")?.state === "on";
            return `
                <div class="chips" role="list" aria-label="Status chips">
                    <div class="chip" role="listitem">Last feeding: ${escapeHtml(timeSince(lastFeeding))}</div>
                    <div class="chip" role="listitem">Last diaper: ${escapeHtml(timeSince(lastDiaper))}</div>
                    ${sleeping ? `<div class="chip warning" role="listitem">Sleeping</div>` : ""}
                    ${atDaycare ? `<div class="chip warning" role="listitem">At daycare</div>` : ""}
                </div>
            `;
        }

        _renderSession() {
            const slug = this._config.baby;
            const sleeping =
                state(this._hass, slug, "sleeping", "binary_sensor")?.state === "on";
            const feeding =
                state(this._hass, slug, "feeding", "binary_sensor")?.state === "on";
            const tummy =
                state(this._hass, slug, "tummy_time", "binary_sensor")?.state === "on";
            if (!sleeping && !feeding && !tummy) return "";
            const banners = [];
            if (sleeping)
                banners.push(
                    `<div class="chip warning" role="status">Sleeping <button data-action="end_sleep" aria-label="End sleep">End</button></div>`
                );
            if (feeding)
                banners.push(
                    `<div class="chip warning" role="status">Feeding <button data-action="end_feeding" aria-label="End feeding">End</button></div>`
                );
            if (tummy)
                banners.push(
                    `<div class="chip warning" role="status">Tummy time <button data-action="end_tummy_time" aria-label="End tummy time">End</button></div>`
                );
            return `<div class="section">${banners.join("")}</div>`;
        }

        _renderQuickLog() {
            const activities = this._babyConfig?.enabled_activities ?? DEFAULT_ACTIVITIES;
            const methods = this._babyConfig?.enabled_feeding_methods ?? DEFAULT_METHODS;
            const buttons = [];
            if (activities.includes("diaper")) {
                for (const kind of ["wet", "dirty", "both"]) {
                    buttons.push(
                        `<button class="quick" data-service="log_diaper" data-arg-kind="${kind}" aria-label="Log ${kind} diaper">${escapeHtml(
                            kind
                        )} diaper</button>`
                    );
                }
            }
            if (activities.includes("feeding")) {
                for (const method of methods) {
                    buttons.push(
                        `<button class="quick" data-service="start_feeding" data-arg-method="${method}" aria-label="Start ${method.replace(
                            "_",
                            " "
                        )} feeding">${escapeHtml(method.replace("_", " "))}</button>`
                    );
                }
            }
            if (activities.includes("sleep")) {
                buttons.push(
                    `<button class="quick" data-service="start_sleep" aria-label="Start sleep">Start sleep</button>`
                );
            }
            if (activities.includes("tummy_time")) {
                buttons.push(
                    `<button class="quick" data-service="start_tummy_time" aria-label="Start tummy time">Tummy time</button>`
                );
            }
            return `<div class="section grid" role="group" aria-label="Quick log">${buttons.join(
                ""
            )}</div>`;
        }

        _renderVaccines() {
            const slug = this._config.baby;
            const due = state(this._hass, slug, "vaccines_due");
            if (!due || due.state === "unknown") return "";
            const overdue =
                state(this._hass, slug, "vaccines_overdue", "binary_sensor")?.state ===
                "on";
            const dueOn = due.attributes?.due_on;
            return `
                <div class="section chip ${overdue ? "warning" : ""}" role="status" aria-label="Vaccines due">
                    <span>Vaccines due:</span>
                    <strong>${escapeHtml(due.state)}</strong>
                    ${dueOn ? `<span>(${escapeHtml(dueOn)})</span>` : ""}
                    ${overdue ? `<span aria-label="Overdue">⚠️ overdue</span>` : ""}
                </div>
            `;
        }

        _renderGrowth() {
            const slug = this._config.baby;
            const units = this._config.units ?? {};
            const weightUnit = units.weight ?? this._options?.weight_unit ?? "kg";
            const lengthUnit = units.length ?? this._options?.length_unit ?? "cm";
            const weight = state(this._hass, slug, "weight")?.state ?? "—";
            const height = state(this._hass, slug, "height")?.state ?? "—";
            const head = state(this._hass, slug, "head_circumference")?.state ?? "—";
            const weightP = state(this._hass, slug, "weight_percentile")?.state ?? "—";
            const heightP = state(this._hass, slug, "height_percentile")?.state ?? "—";
            const bands = [3, 15, 50, 85, 97]
                .map(
                    (b, i) => `
                        <line x1="0" x2="300" y1="${20 + i * 20}" y2="${
                        20 + i * 20
                    }" stroke="var(--divider-color)" stroke-dasharray="4 4"/>
                        <text x="290" y="${
                            20 + i * 20 - 4
                        }" font-size="9" fill="var(--secondary-text-color)" text-anchor="end">p${b}</text>
                    `
                )
                .join("");
            return `
                <div class="section" role="region" aria-label="Growth">
                    <h2>Growth</h2>
                    <div class="growth-grid">
                        <div><div class="label">Weight</div><div>${escapeHtml(
                            weight
                        )} ${escapeHtml(weightUnit)} · ${escapeHtml(weightP)}p</div></div>
                        <div><div class="label">Height</div><div>${escapeHtml(
                            height
                        )} ${escapeHtml(lengthUnit)} · ${escapeHtml(heightP)}p</div></div>
                        <div><div class="label">Head</div><div>${escapeHtml(
                            head
                        )} ${escapeHtml(lengthUnit)}</div></div>
                    </div>
                    <svg viewBox="0 0 300 120" role="img" aria-label="Growth chart placeholder">${bands}</svg>
                </div>
            `;
        }

        _renderRecent() {
            const slug = this._config.baby;
            const sensor = state(this._hass, slug, "recent_entries");
            const limit = Math.min(this._config.recent_limit ?? 10, 50);
            const entries = (sensor?.attributes?.entries ?? []).slice(0, limit);
            if (entries.length === 0) {
                return `<div class="section" role="region" aria-label="Recent entries"><h2>Recent</h2><p>No entries yet.</p></div>`;
            }
            const rows = entries
                .map(
                    (entry) => `
                        <li>
                            <span>${escapeHtml(entry.type)}</span>
                            <span class="muted">${escapeHtml(entry.timestamp ?? "")}</span>
                            ${entry.photo_path ? `<span aria-label="Has photo">📷</span>` : ""}
                            ${
                                entry.staff
                                    ? `<span class="muted" aria-label="Logged by Procare staff">via ${escapeHtml(
                                          entry.staff
                                      )}</span>`
                                    : ""
                            }
                            <span class="spacer"></span>
                            <button data-service="delete_entry" data-arg-entry_id="${escapeHtml(
                                entry.id
                            )}" aria-label="Delete entry">Delete</button>
                        </li>
                    `
                )
                .join("");
            return `
                <div class="section" role="region" aria-label="Recent entries">
                    <h2>Recent</h2>
                    <ul class="entries">${rows}</ul>
                </div>
            `;
        }

        _renderExport() {
            return `
                <div class="section">
                    <button class="primary" data-action="export" aria-label="Export for pediatrician">
                        Export for pediatrician
                    </button>
                </div>
            `;
        }

        _render() {
            if (!this._hass || !this._config) return;
            const slug = escapeHtml(this._babyConfig?.name ?? this._config.baby);
            const sections = this._sections();
            const parts = [];
            if (sections.includes("status")) parts.push(this._renderStatus());
            if (sections.includes("active_session")) parts.push(this._renderSession());
            if (sections.includes("quick_log")) parts.push(this._renderQuickLog());
            if (sections.includes("vaccines")) parts.push(this._renderVaccines());
            if (sections.includes("growth")) parts.push(this._renderGrowth());
            if (sections.includes("recent")) parts.push(this._renderRecent());
            if (sections.includes("export")) parts.push(this._renderExport());

            this.shadowRoot.innerHTML = `
                <style>
                    :host { display: block; font-family: var(--primary-font-family, system-ui); }
                    ha-card, .card { background: var(--ha-card-background, var(--card-background-color, #fff)); border-radius: var(--ha-card-border-radius, 12px); box-shadow: var(--ha-card-box-shadow); padding: 16px; }
                    h2 { font-size: 1.15rem; margin: 0 0 8px; color: var(--primary-text-color); }
                    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
                    .chip { padding: 6px 10px; border-radius: 16px; background: var(--secondary-background-color); color: var(--primary-text-color); font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px; }
                    .chip.warning { background: var(--warning-color); color: var(--text-primary-color, #fff); }
                    .section { margin-top: 12px; }
                    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
                    button { background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
                    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: transparent; }
                    button.quick { padding: 14px 12px; font-weight: 600; }
                    .growth-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
                    .label { font-size: 0.85rem; color: var(--secondary-text-color); }
                    svg { width: 100%; height: 120px; margin-top: 8px; }
                    ul.entries { list-style: none; padding: 0; margin: 0; }
                    ul.entries li { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--divider-color); }
                    .muted { color: var(--secondary-text-color); font-size: 0.85rem; }
                    .spacer { flex: 1; }
                </style>
                <div class="card">
                    <h2>${slug}</h2>
                    ${parts.join("")}
                </div>
            `;

            this.shadowRoot.querySelectorAll("button[data-service]").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const service = btn.getAttribute("data-service");
                    const data = { baby: this._config.baby };
                    for (const { name, value } of btn.attributes) {
                        if (name.startsWith("data-arg-")) {
                            data[name.slice("data-arg-".length)] = value;
                        }
                    }
                    if (service === "delete_entry") {
                        delete data.baby;
                    }
                    this._callService(service, data);
                });
            });
            this.shadowRoot.querySelectorAll("button[data-action]").forEach((btn) => {
                btn.addEventListener("click", () => {
                    const action = btn.getAttribute("data-action");
                    if (action === "export") return this._exportReport();
                    if (
                        action === "end_sleep" ||
                        action === "end_feeding" ||
                        action === "end_tummy_time"
                    )
                        this._callService(action, { baby: this._config.baby });
                });
            });
        }

        static getConfigElement() {
            return document.createElement("babytracker-card-editor");
        }

        static getStubConfig() {
            return { type: "custom:babytracker-card", baby: "ava" };
        }
    }

    class BabytrackerCardEditor extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: "open" });
            this._config = { baby: "" };
        }

        setConfig(config) {
            this._config = { ...config };
            this._render();
        }

        _emit() {
            this.dispatchEvent(
                new CustomEvent("config-changed", {
                    detail: { config: this._config },
                    bubbles: true,
                    composed: true
                })
            );
        }

        _render() {
            this.shadowRoot.innerHTML = `
                <style>
                    :host { display: block; padding: 12px; font-family: var(--primary-font-family, system-ui); }
                    label { display: block; font-size: 0.9rem; margin: 8px 0 4px; color: var(--primary-text-color); }
                    input { width: 100%; padding: 6px 8px; background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; }
                </style>
                <label for="baby">Baby slug</label>
                <input id="baby" value="${escapeHtml(this._config.baby ?? "")}" aria-label="Baby slug"/>
                <label for="limit">Recent entries to show</label>
                <input id="limit" type="number" min="1" max="50" value="${escapeHtml(
                    String(this._config.recent_limit ?? 10)
                )}" aria-label="Recent entries to show"/>
            `;
            const baby = this.shadowRoot.getElementById("baby");
            const limit = this.shadowRoot.getElementById("limit");
            baby.addEventListener("change", () => {
                this._config.baby = baby.value.trim();
                this._emit();
            });
            limit.addEventListener("change", () => {
                this._config.recent_limit = Number(limit.value);
                this._emit();
            });
        }
    }

    customElements.define("babytracker-card", BabytrackerCard);
    customElements.define("babytracker-card-editor", BabytrackerCardEditor);

    window.customCards = window.customCards || [];
    window.customCards.push({
        type: "babytracker-card",
        name: "babytracker",
        description: "Track feedings, sleep, diapers, growth, and vaccines."
    });
})();
//# sourceMappingURL=babytracker-card.js.map
