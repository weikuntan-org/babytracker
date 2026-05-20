import { css } from "lit";

/**
 * Dialog styles shared between cards that host a modal (currently the
 * summary card and the history card). Composed into each card's
 * `static styles` via `css\`${dialogStyles}\``. The main per-baby card
 * keeps its own copy because it predates this extraction and rendering
 * regressions there would be visible immediately.
 *
 * Includes the `.dt-row` + `.now-btn` rules introduced with the
 * one-click Now/Today affordance (PRs #66/#67) so the satellite cards
 * — which host the same modal forms — pick up the styling without
 * needing to repeat it.
 */
export const dialogStyles = css`
    dialog {
        border: none;
        border-radius: 12px;
        padding: 16px;
        min-width: min(360px, 92vw);
        background: var(--card-background-color);
        color: var(--primary-text-color);
    }
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.5);
    }
    dialog form {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    dialog .actions {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 8px;
    }
    dialog input,
    dialog select {
        padding: 8px;
        border-radius: 6px;
        border: 1px solid var(--divider-color);
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font: inherit;
    }
    dialog .dt-row {
        display: flex;
        gap: 6px;
        align-items: stretch;
    }
    dialog .dt-row input {
        flex: 1;
        min-width: 0;
    }
    dialog .dt-row .now-btn {
        padding: 4px 10px;
        font-size: 0.85rem;
        white-space: nowrap;
    }
`;
