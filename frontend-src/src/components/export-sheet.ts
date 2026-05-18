// Export footer — opens a date range and calls babytracker.export_report.
import { html, type TemplateResult } from "lit";

export function exportSheetTemplate(hass: any, baby: string): TemplateResult {
    const onClick = async () => {
        const end = new Date();
        const start = new Date(end.getTime() - 90 * 86_400_000);
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        const response = await hass.callService(
            "babytracker",
            "export_report",
            { baby, format: "html", start: fmt(start), end: fmt(end) },
            undefined,
            false,
            true // return_response
        );
        const url = response?.response?.url;
        if (url) window.open(url, "_blank", "noopener");
    };
    return html`
        <div class="section">
            <button
                class="primary"
                aria-label="Export for pediatrician"
                @click=${onClick}
            >
                Export for pediatrician
            </button>
        </div>
    `;
}
