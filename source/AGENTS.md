# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Project-specific requirements
- Use real components from @reactor/reactor and @reactor/table for this prototype, per the user's request. Apply tl-reactor-local-npm.
- Use ReactorTheme, Reactor typography, palette tokens and Icon. Do not reintroduce custom fonts or external icon packages.
- Keep the established create-section workflow and existing catalog data when migrating components.
- The installed Reactor version is source-only; use Sass NodePackageImporter and the @REACTOR_ICONS alias. Keep React versions aligned and deduped.
- Keep project .npmrc and .npm-cache private and excluded from version control.

- Group filters: omit reset-filter buttons and the helper texts about selection retention and all results being shown. Keep the group popup above sticky sidebar content.

- Main page visual reference: Figma 409:28512. Preserve the approved create/edit sidebar and its behavior when changing the main page.

- Section illustrations are required. Keep the main form save action disabled until an illustration is selected; the unsaved-changes confirmation save action must remain enabled.

- Do not offer «Без картинки» or display «Не выбрано». Show «Выбрать» before selection and «Изменить» beside the selected illustration; no separate delete button. The picker contains 20 illustrations without visible captions.

- Section unsaved-changes dialog: title «Сохранить изменения?», message «В разделе есть несохраненные данные», buttons «Сохранить» (validate, then save and close), «Не сохранять» (discard and close), and «Продолжить редактирование» (return to the form). «Сохранить» stays enabled even for invalid data. On validation failure, close only the confirmation, preserve all form data, show field errors and a summary, and focus/scroll to the first invalid control. Closing the confirmation via its cross or Escape also returns to editing. Applies to creation and editing.

- Main page provides «Ссылка на витрину» for viewing/copying the whole guest storefront URL. Keep it separate from the designer URL. Configure via VITE_STOREFRONT_URL; keep the example address until a real guest URL is supplied; per user request, do not display the prototype/address-not-connected caption. Section-specific links are future scope.

- Obtaining a guest storefront link is a rare task: show a quiet text link «Получить ссылку на витрину» below the page description and above both tables, accessible without scrolling through a long service list. Do not use a prominent button by the title.

- Compact header uses Reactor PageTop (16px title-to-description spacing), 8px description-to-link spacing, and Reactor Link without button padding. No extra bottom margin on the header.

- Storefront link dialog footer has only secondary «Закрыть». Keep copying beside the URL field.

- When no sections exist, omit the sections table/header and show a centered Reactor folder icon and «Ещё не создано ни одного раздела». Keep the tile header and create action. A selector above the prototype switches «Полный вариант» / «Пустое состояние» with separate section data.

- Empty sections variant follows the Figma module examples: small neutral icon, «Разделов пока нет», explanation «Объедините услуги в разделы, чтобы гостям было проще найти нужное на витрине.», and one centered secondary «Создать раздел» button. Hide the duplicate header action while empty.

- Explain that at least 2 sections are needed to appear on the storefront. When exactly 1 section exists, show a Reactor WarningAlert requesting at least one more; hide it at 0 or 2+ sections. Count created sections, not visibility switches.

- With 2 or more sections, keep the original section subtitle «Кнопки быстрого перехода к предложениям на витрине» without the minimum-count reminder.

- Show the section save-validation summary («Не удалось создать раздел. Исправьте ошибки в форме») in a Reactor DangerAlert above the fields.

- Added section services can be reordered using drag handles or arrow keys on the «Добавленные» tab. Persist the order in section.ids; filtered reorder changes visible slots only. Reordering is an unsaved change and must survive saving/reopening.

- Prototype variant «Не прогрузились услуги» applies to section creation and editing: disable name/icon/save controls, replace services content with an error and «Обновить страницу», and omit unavailable service counts.

- Opening section editing selects «Добавленные» services by default; creating a section selects «Все услуги».

- «Не прогрузилась страница» replaces main-page data, description and actions with a borderless loading error and reload action; preserve navigation and page title.

- Rename guest sharing link/dialog to «Поделиться витриной». Include a QR preview and «Скачать QR-код» PNG action for the same configured guest URL; generate locally, without third-party QR services.

- «Нет ни одной услуги» replaces main-page tables/actions with a centered neutral service icon, «Нет подключённых услуг» and an explanation that services appear after connection. Based on Figma 1441:10988; distinct from empty sections.
