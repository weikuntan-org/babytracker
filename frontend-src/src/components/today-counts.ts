// Last-24-hours summary chips — computed from the recent_entries sensor
// attribute so the totals match the 24h activity list directly underneath.
import { html, type TemplateResult } from "lit";

import { babyEntityId } from "../lib/ha-helpers";

export function todayCountsTemplate(
    hass: any,
    baby: string,
    _babyConfig: any | undefined
): TemplateResult {
    const sensor = hass.states?.[babyEntityId(baby, "recent_entries")];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    const entries: any[] = (sensor?.attributes?.entries ?? []).filter(
        (e: any) => _parseMs(e.timestamp) >= cutoff
    );

    let feedings = 0;
    let wet = 0;
    let dirty = 0;
    let totalMl = 0;
    let sleepMinutes = 0;

    const now = Date.now();
    for (const e of entries) {
        if (e.type === "feeding") {
            feedings += 1;
            const amount = Number(e?.data?.amount ?? 0);
            const unit = String(e?.data?.unit ?? "");
            if (amount > 0) {
                totalMl += unit === "oz" ? amount * 29.5735 : amount;
            }
        } else if (e.type === "diaper") {
            const kind = String(e?.data?.kind ?? "");
            if (kind === "wet") wet += 1;
            else if (kind === "dirty") dirty += 1;
            else if (kind === "both") {
                wet += 1;
                dirty += 1;
            }
        } else if (e.type === "sleep") {
            const start = _parseMs(e.timestamp);
            const end =
                e.ended_at != null && e.ended_at !== ""
                    ? _parseMs(e.ended_at)
                    : now;
            if (start > 0 && end > start) {
                const overlapStart = Math.max(start, cutoff);
                sleepMinutes += (end - overlapStart) / 60000;
            }
        }
    }

    return html`
        <div class="chips" role="list" aria-label="Last 24 hours summary">
            <div class="chip" role="listitem">${feedings} feedings</div>
            <div class="chip" role="listitem">
                ${_formatVolume(totalMl)} consumed
            </div>
            <div class="chip" role="listitem">${wet} wet</div>
            <div class="chip" role="listitem">${dirty} dirty</div>
            <div class="chip" role="listitem">
                ${_formatMinutes(sleepMinutes)} sleep
            </div>
        </div>
    `;
}

function _parseMs(iso?: string): number {
    if (!iso) return 0;
    const t = Date.parse(iso);
    return Number.isNaN(t) ? 0 : t;
}

function _formatMinutes(mins: number): string {
    if (!Number.isFinite(mins) || mins <= 0) return "0m";
    if (mins < 60) return `${Math.round(mins)}m`;
    const h = Math.floor(mins / 60);
    const m = Math.round(mins % 60);
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function _formatVolume(ml: number): string {
    if (!Number.isFinite(ml) || ml <= 0) return "0 oz";
    const oz = ml / 29.5735;
    if (oz >= 1) return `${oz.toFixed(1)} oz`;
    return `${Math.round(ml)} ml`;
}
