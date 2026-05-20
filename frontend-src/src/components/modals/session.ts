import { html, type TemplateResult } from "lit";

import {
    dateTimeRow,
    localInputToIso,
    notesInputRow,
    nowLocalForInput,
    photoRow,
    readPhotoPath,
    type Close,
    type Submit
} from "./_helpers";

export type SessionActivity = "sleep" | "tummy_time" | "walk" | "feeding";

export function sessionForm(
    hass: any,
    baby: string,
    activity: SessionActivity,
    method: "breast_left" | "breast_right" | undefined,
    submit: Submit,
    close: Close
): TemplateResult {
    const titleMap: Record<SessionActivity, string> = {
        sleep: "Log sleep",
        tummy_time: "Log tummy time",
        walk: "Log walk",
        feeding: method
            ? `Log ${method.replace("_", " ")} feeding`
            : "Log feeding"
    };
    const onSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const data = new FormData(form);
        const startedAt = localInputToIso(String(data.get("started") ?? ""));
        const endedAt = localInputToIso(String(data.get("ended") ?? ""));
        const notes = String(data.get("notes") ?? "") || undefined;
        const photoPath = readPhotoPath(form);

        // No end → open a live session at started_at (start_*).
        // Both ends supplied → retroactive completed entry (log_*).
        if (!endedAt) {
            const payload: Record<string, unknown> = {
                baby,
                started_at: startedAt,
                photo_path: photoPath
            };
            let service: string;
            switch (activity) {
                case "sleep":
                    service = "start_sleep";
                    break;
                case "tummy_time":
                    service = "start_tummy_time";
                    break;
                case "walk":
                    service = "start_walk";
                    break;
                case "feeding":
                    service = "start_feeding";
                    payload.method = method!;
                    break;
            }
            submit(service, payload);
            return;
        }

        const payload: Record<string, unknown> = {
            baby,
            started_at: startedAt,
            ended_at: endedAt,
            notes,
            photo_path: photoPath
        };
        let service: string;
        switch (activity) {
            case "sleep":
                service = "log_sleep";
                break;
            case "tummy_time":
                service = "log_tummy_time";
                break;
            case "walk":
                service = "log_walk";
                break;
            case "feeding":
                service = "log_feeding";
                payload.method = method!;
                break;
        }
        submit(service, payload);
    };

    return html`
        <form @submit=${onSubmit}>
            <h2>${titleMap[activity]}</h2>
            <label for="started">Started</label>
            ${dateTimeRow({
                id: "started",
                value: nowLocalForInput(),
                required: true
            })}
            <label for="ended">Ended <span class="muted">(optional)</span></label>
            ${dateTimeRow({
                id: "ended",
                placeholder: "leave blank for an open session"
            })}
            <label for="notes">Notes</label>
            ${notesInputRow(hass)}
            ${photoRow(hass)}
            <div class="actions">
                <button type="button" @click=${close}>Cancel</button>
                <button type="submit" class="primary">Log</button>
            </div>
        </form>
    `;
}
