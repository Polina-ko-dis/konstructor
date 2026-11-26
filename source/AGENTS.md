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

- Section unsaved-changes dialog: title «Сохранить изменения?», message «В разделе есть несохраненные данные», buttons «Сохранить» (validate, then save and close), «Не сохранять» (discard and close), and «Продолжить редактирование» (return to the form). «Сохранить» stays enabled even for invalid data. On validation failure, close only the confirmation, preserve all form data, show field errors without a summary alert, and focus/scroll to the first invalid control. Closing the confirmation via its cross or Escape also returns to editing. Applies to creation and editing.

- Main page provides «Ссылка на витрину» for viewing/copying the whole guest storefront URL. Keep it separate from the designer URL. Configure via VITE_STOREFRONT_URL; keep the example address until a real guest URL is supplied; per user request, do not display the prototype/address-not-connected caption. Section-specific links are future scope.

- Obtaining a guest storefront link is a rare task: show a quiet text link «Получить ссылку на витрину» below the page description and above both tables, accessible without scrolling through a long service list. Do not use a prominent button by the title.

- Compact header uses Reactor PageTop (16px title-to-description spacing), 8px description-to-link spacing, and Reactor Link without button padding. No extra bottom margin on the header.

- Storefront link dialog footer has only secondary «Закрыть». Keep copying beside the URL field.

- When no sections exist, omit the sections table/header and show a centered Reactor folder icon and «Ещё не создано ни одного раздела». Keep the tile header and create action. A selector above the prototype switches «Полный вариант» / «Пустое состояние» with separate section data.

- Empty sections variant follows the Figma module examples: small neutral icon, «Разделов пока нет», explanation «Объедините услуги в разделы, чтобы гостям было проще найти нужное на витрине.», and one centered secondary «Создать раздел» button. Hide the duplicate header action while empty.

- Explain that at least 2 sections are needed to appear on the storefront. When exactly 1 section exists, show a Reactor WarningAlert requesting at least one more; hide it at 0 or 2+ sections. Count created sections, not visibility switches.

- With 2 or more sections, keep the original section subtitle «Кнопки быстрого перехода к предложениям на витрине» without the minimum-count reminder.

- Disable the main section create/save action while any field validation error is active. Show validation messages beside their fields only; do not render a general red save-validation alert above the form.

- Added section services can be reordered using drag handles or arrow keys on the «Добавленные» tab. Persist the order in section.ids; filtered reorder changes visible slots only. Reordering is an unsaved change and must survive saving/reopening.

- Prototype variant «Не прогрузились услуги» applies to section creation and editing: disable name/icon/save controls, replace services content with an error and «Обновить страницу», and omit unavailable service counts.

- Opening section editing selects «Добавленные» services by default; creating a section selects «Все услуги».

- «Не прогрузилась страница» replaces main-page data, description and actions with a borderless loading error and reload action; preserve navigation and page title.

- Rename guest sharing link/dialog to «Поделиться витриной». Include a QR preview and «Скачать QR-код» PNG action for the same configured guest URL; generate locally, without third-party QR services.

- «Нет ни одной услуги» replaces main-page tables/actions with a centered neutral service icon, «Нет подключённых услуг» and an explanation that services appear after connection. Based on Figma 1441:10988; distinct from empty sections.

- Share dialog (storefront and section): Reactor ModalWindow at dialog width (600 px), no status icon. Two blocks with subtitle headings — «Ссылка на витрину»/«Ссылка на раздел» above the description and copy row, «QR-код витрины»/«QR-код раздела» left-aligned above its description, then the QR with a link-type «Скачать QR-код» button beside it, aligned to the QR bottom edge. No file format/size caption — there is only one file to download. The QR preview has no quiet zone so it aligns with the heading; the downloaded PNG keeps it.

- Section ↔ icon link in the section sidebar: whichever field the guest sets first leads, and the other follows every change of it (section → its icon; icon → its section). The link breaks only when the guest picks, in the following field, a value unrelated to the leading one; after that both fields change independently. Editing an existing section starts linked (section leads) if its icon matches its section, otherwise unlinked. Choosing «Свое название» clears the icon only if the link filled it; an icon picked by hand is never cleared.
- Copy success in the share dialog: no inline text under the field; show a Reactor SnackbarWindow status="success" «Ссылка скопирована» (top right, above the modal layer). The copy link text always stays «Скопировать». A copy failure stays inline under the field in danger color.

- Section presets, icon ids and section↔icon pairs follow Figma «Для конструктора» (18587:88986): icon file/id = Figma layer name (e.g. Food_Icon_dark), section preset = white caption under the icon; «Без названия» means the icon has no paired section.

- Default modal width is always 600 px. Use this width for all modal dialogs unless the user explicitly requests another width.
- Custom «Название раздела» has a 20-character limit. Show the Reactor danger state and the standard Reactor text «Введите не более 20 символов» while typing above the limit, clear the length error immediately on correction, and reject overlong names through both save actions.

- After a successful drag-and-drop reorder in «Разделы» or «Лента всех услуг», show the green success SnackbarWindow «Порядок сортировки изменен». No banner when the drop leaves the order unchanged. Reactor Table has no drop callback, so MainPage detects the row move with a MutationObserver (useReorderNotice).

- When all section icons are occupied (including hidden sections), disable «Создать раздел» and show the Reactor disabledHint «Достигнут лимит разделов. Удалите лишний или измените текущий». Preset section names must not reuse occupied icons through automatic pairing. Editing keeps the current icon available. The «Все иконки заняты» prototype variant provides this state for review.

- Website widget settings: on «Настройки показа», replace «Виджет для сайта» with a full-content-width Reactor Tile below «Поделиться витриной» and above the sections table. Omit a visible heading. Use one row with a filled Reactor Badge («Не активирован», neutral gray; «Активирован», success green) followed by «Виджет витрины на сайте» on the left. On the right, show a secondary outlined «Активировать» / «Деактивировать» button and two secondary outlined Reactor Buttons with icons only and no visible text: eye («Посмотреть виджет на сайте», always available, opens the variant preview URL in a new tab) and settings («Настройки виджета», opens the existing 600 px sidebar). Use the same accessible names and hover tooltips: «Посмотреть виджет на сайте» for the eye and «Настройки виджета» for settings. Omit the display switch. The sidebar begins with «Вид виджета». Keep the four position choices. Saving applies the appearance/position draft; cancel/close discard it independently of activation status.
- «Поделиться витриной» keeps the default secondary style. The widget card uses the existing Reactor theme, typography and border, without a heading or divider.
- Prototype selector includes «Одиночный виджет» (the former «С виджетом») and «Группа виджетов», each with its own section data. Both show the widget display card. The group repeats the single-widget settings except that size is hidden and position is controlled through TL CHAT. Other variants retain the interface without the widget card.
- In both widget variants, show the color Reactor InfoAlert only in the icon picker: «Цвет виджета будет соответствовать цвету кнопок с вашего Модуля бронирования Travelline. Отображение виджета на сайте можно проверить после сохранения настроек.». Omit this alert from the main widget settings sidebar.
- Both widget settings include «Вид виджета» before «Расположение на экране». Inside, use the same form row as section settings: Reactor «Иконка» label on the left, icon preview and choose/change action on the right. Reuse the picker interaction with a separate widget catalog: the 24 top-level SVGs (exclude passport-M.svg) supplied in «C:/Users/Polina/Documents/Витрина/иконки виджетов», copied to public/assets/widget-icons and recolored from #1743EF to Reactor neutral #8095B3. Use these assets in the widget picker and selected preview. Set the widget-only gap between its radio and image to 0 px; section picker spacing stays unchanged. Section assets, catalog and picker defaults remain unchanged. Put other-2-M («Другие услуги — вариант 2») first and select it by default, so its preview and «Изменить» are visible on the first opening of the widget settings and its radio is selected in the picker. Applying a picker selection updates the widget draft; saving the settings commits it, while cancel/close discards changes.
- Keep the current widget iterations local until the user explicitly requests publication.
- Widget icon picker uses the same 600 px width as its settings sidebar, so the parent stays visible as an undimmed 16 px strip to the left, matching the section sidebar layering. Closing the picker returns to the settings with the draft intact; keep the section picker at 753 px.
- Under the single-widget icon row, add «Размер» with Reactor radio options «S», «M», and «L» (without pixel values); default to M. Keep these options compact in a wrapping row, without preview pictures. Size is part of the settings draft and follows the same save/cancel behavior.
- Align the visible left edge of the selected widget icon with the size radios below; compensate for the SVG's inner padding only in the widget settings preview.
- Default the widget position to «Справа по центру» (middle-right) on first opening.
- Widget position choices follow their spatial arrangement: top row «Слева по центру» / «Справа по центру» (middle-left / middle-right), bottom row «Слева внизу» / «Справа внизу» (bottom-left / bottom-right). All four previews have the same dimensions, 145×119 px, in both widget variants; only the circle position differs. In the single-widget settings, the entire option area (radio, label, preview and the space between them) selects the position and focuses its Reactor radio; show a pointer cursor and preserve keyboard navigation. Group position controls remain disabled and their previews keep the default cursor.
- All four widget position previews, in both variants, use the approved website skeleton: one wide pill header, a tall banner and three cards partly cropped at the bottom. Keep the existing gray Reactor background, draw the skeleton with a subtle neutral tint, and use an 18 px neutral circle above it to show the selected location. Scale skeleton heights proportionally within the existing preview dimensions.
- In group settings, hide the entire «Размер» row. Disable only the four position radios and their keyboard navigation; leave previews and position text at their normal opacity/color. Render each position caption as a separate Reactor Text beside the disabled Radio in a Reactor Row, so the label does not inherit disabled styling or the forbidden cursor; retain accessible aria-labels. Show the captions above the previews, and align the left edge of each preview with its radio. Directly under «Расположение на экране», show an active Reactor InfoAlert «Виджет витрины размещается вместе с виджетом ИИ-помощника. Настроить общее положение на сайте можно в разделе Помощник». Make «в разделе Помощник» an underlined inline link opening https://www.qatl.ru/app/AiChatExtranet/#/opportunity/AiChatManagement/ in a new tab; omit the separate link/button below the text. Keep the alert/link active.
- Widget sidebar footer order: primary save action, secondary «Посмотреть на сайте», secondary «Отмена». The primary action text is «Сохранить и опубликовать» while the widget is activated, otherwise «Сохранить». Both actions commit the draft directly without an additional publication modal, keep the sidebar open and enable preview for the saved values. Preview is disabled until the first successful settings save, and again whenever icon, size or position differs from the saved settings. Use Reactor disabledHint «Сохраните изменения перед просмотром» and omit the link URL while disabled. Reverting all changes or reopening saved settings restores preview availability. Single-widget preview opens https://polina-ko-dis.github.io/widget-test/d-solo/; the group keeps https://polina-ko-dis.github.io/widget-test/c/. Preview opens in a new browser tab and keeps the sidebar open.
- Clicking the main-page secondary «Активировать» button opens a 600 px Reactor info DialogWindow «Активация виджета» / «Активировать виджет?». Recommend checking how the widget looks on the website and making sure other website widgets do not cover it. Footer order: primary «Активировать и опубликовать», secondary «Проверить», secondary «Закрыть». Confirming immediately enables the saved display state. «Проверить» is always enabled in this activation dialog, including before the first settings save; it opens the variant's existing preview URL in a new tab and closes only the activation dialog, leaving the widget deactivated. The save-before-preview restriction applies only to «Посмотреть на сайте» in the settings sidebar. «Закрыть», the cross and Escape leave the widget deactivated. Appearance/position remain separate from display state. Keep focus inside the active dialog and return it to its triggering control on dismissal.
- Clicking the main-page secondary «Деактивировать» button opens a 600 px Reactor DialogWindow type="warning" with its standard warning icon. Header «Деактивация виджета», title «Деактивировать виджет?», message «После деактивации виджет витрины пропадёт с сайта.». Footer: primary «Деактивировать» and secondary «Закрыть». Keep the widget activated until confirmation; closing via the button, cross or Escape leaves it activated. Return focus to the secondary activation/deactivation button after dismissal. Applies to both widget variants.
- Sidebar close crosses have no tooltip. Use Reactor IconButton with the same cancel-filled icon and an accessible «Закрыть» label, avoiding CloseIcon's built-in hint.
- Public prototype: https://polina-ko-dis.github.io/konstructor/. GitHub Pages serves the repository root, not source/dist. For an approved publication, build from source with VITE_BASE_PATH=/konstructor/, copy dist/client/index.html and dist/client/assets into the repository root (replace generated assets), and commit/push those files together with the source changes. Follow source/README.md; pushing source alone does not update the public site.
