# Site Widget Settings Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this small change inline. Steps use checkbox syntax for tracking.

**Goal:** Add the requested website widget configuration to the storefront constructor.

**Architecture:** A focused component owns the saved settings and an editable draft. The existing GuardedSidebar, composed from real Reactor sidebar primitives, contains a Switch and a Radio group, with decorative previews matching the supplied screenshot and the qatl.ru reference. Settings live in the prototype's React state, consistent with the existing constructor.

**Tech Stack:** React, Vite, existing @reactor/reactor components and palette.

**Spec:** User request in this chat, attached screenshot, and https://www.qatl.ru/app/AiChatExtranet/#/opportunity/AiChatManagement/.

## Global Constraints

- Work locally in konstructor/source; do not push before user approval.
- Read source/AGENTS.md and connected Reactor docs before choosing controls.
- Button «Виджет для сайта» beside «Поделиться витриной»; sidebar «Настройка виджета».
- Switch «Активация виджета на витрине» and block «Расположение виджета на сайте».
- Four positions in a 2×2 grid: bottom right/left, middle right/left.
- Preserve existing section and sharing workflows and private npm configuration.

## Review Focus

- Saving preserves activation and position when reopening; cancellation discards edits.
- Selecting any position leaves exactly one radio selected; clicking its preview also selects it.
- Radio choices work by keyboard, and focus returns to the opening action.
- The sidebar and action row fit narrow viewports without horizontal overflow.
- Existing sharing and section sidebars still open correctly.

### Task 1: Add the widget settings interface

**Files:** Create src/SiteWidgetSettings.jsx; modify src/MainPage.jsx, src/GuardedSidebar.jsx (optional card tag), src/styles.css, AGENTS.md.

**Interface:** SiteWidgetSettings({onSaved}) renders the opening button and owns {enabled, position}. Save invokes onSaved after copying the draft into saved state. Cancel, Escape and the close icon discard the draft on next opening.

- [x] Implement the component and integrate the button alongside sharing.
- [x] Match the inspected reference: 600 px sidebar, 173 px grid columns, 24 px gap, previews inset 28 px, width 145 px, height 97/119 px, 14 px markers inset 8 px, Reactor palette.
- [x] Check save/cancel, all four positions, keyboard controls, close/Escape, sharing and narrow viewport in the browser.
- [x] Run npm run build and node --test tests/sites-worker.test.mjs, inspect output and git diff.

## Execution Notes

- The user supplied a concrete layout and action request. Proceed locally without an additional design approval gate; final review remains local before any push.
- This is a reversible prototype UI change: use interactive browser verification and the existing packaging suite rather than adding implementation-mirroring unit tests.
- The specified checkout already has dependencies and a running preview on port 5173; reuse them.
- Final verification: npm build succeeded (invoked through pnpm dlx npm@11); all 4 packaging tests passed; git diff --check passed. Vite retains its bundle-size advisory.
- Browser checks passed for saved activation/position, discard/reopen, preview selection, arrow/Home/End navigation, forward/backward Tab wrapping, Escape, keyboard opening, return focus, sharing and section creation. Narrow layout uses one column without card overflow.
- Independent read-only review: no remaining findings. The native sidebar's unwanted overlay confirmation was avoided by using the existing GuardedSidebar; optional tag forwarding does not change existing callers.
- Existing Reactor console warnings about list keys and forwarded props were observed while checking the existing tables/section sidebar; no dependency changes were made.
