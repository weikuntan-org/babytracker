// Manual "Sync importers" button. Rendered only when the baby has an
// importer configured (otherwise the service-call would no-op and the
// button would be misleading).
import { html, type TemplateResult } from "lit";

type ServiceCaller = (
    service: string,
    data: Record<string, unknown>,
    sourceBtn?: EventTarget | null
) => Promise<unknown>;

export function importerSyncTemplate(
    babyConfig: any | undefined,
    baby: string,
    call: ServiceCaller
): TemplateResult | "" {
    if (!babyConfig?.importer?.source_entity_id) return "";
    return html`
        <div class="section">
            <button
                aria-label="Resync importers"
                title="Re-read the source sensor's current activities. Already-imported activities are skipped."
                @click=${(e: Event) =>
                    call("resync_importers", { baby }, e.currentTarget)}
            >
                Sync importers
            </button>
        </div>
    `;
}
