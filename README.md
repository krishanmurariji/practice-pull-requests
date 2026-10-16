# Ariel HR UI redesign (prototype)

A separate design project for a new look of the Ariel HR app. It covers:

- the **menu** (icon rail plus submenu panel, every module and submenu kept)
- the **top header** (company, search, check-in, create, notifications, settings, language, profile)
- **all Recruitment pages** and the **candidate profile**

It is plain HTML, CSS and JavaScript with demo data. There is no build step and no server.
Open `index.html` in a browser (double-click works) and use the menu.

## Where to edit

| To change | Edit |
|---|---|
| Colours, fonts, corner radius, spacing, dark mode | `css/tokens.css` |
| The menu, its order, icons, which items link to a page | `MODULES` in `js/data.js` |
| Names, jobs, candidates, interviews and every other sample record | `DEMO` in `js/data.js` |
| The sidebar, its menus and the command palette | `js/shell.js` and `css/shell.css` |
| Buttons, tables, cards, tabs, forms, kanban | `css/components.css` |
| Icons | `ICONS` in `js/icons.js`: one thin-line set (Phosphor Light, MIT) used in the sidebar and on every page |
| One page's layout and behaviour | that page's `.html` file (markup plus a small script at the bottom) |

## Pages

| Page | File |
|---|---|
| Redesign preview (start here) | `index.html` |
| Recruitment, Dashboard | `recruitment-dashboard.html` |
| Job Openings | `job-openings.html` |
| Open Jobs | `open-jobs.html` |
| Candidates | `candidates.html` |
| Candidate profile (11 tabs), open with `?id=1` | `candidate-profile.html` |
| Interview | `interviews.html` |
| Recruitment Pipeline | `pipeline.html` |
| Recruitment Survey | `survey.html` |
| Stages | `stages.html` |
| Skill Zone | `skill-zone.html` |
| Email Applications | `email-applications.html` |
| Candidate Intake Mailbox | `intake-mailbox.html` |

Other modules (Employee, Attendance, Leave and so on) keep their full menu and submenus, but their pages are not designed yet.

## How a page is built

```html
<body data-module="recruitment" data-page="candidates" data-title="Candidates">
  <main id="page"> ...content... </main>
  <script src="js/data.js"></script>
  <script src="js/icons.js"></script>
  <script src="js/ui.js"></script>
  <script> /* page script: renders into #page using DEMO */ </script>
  <script src="js/shell.js"></script>   <!-- last: wraps the page in the rail, panel and top bar -->
</body>
```

Buttons placed inside `<div data-actions>` are moved next to the page title.

## The sidebar

A slim icon strip (68px) that opens to the right when the pointer is on it. It opens over the page, so the page never moves.

- **Top:** the notifications bell, with a small badge for unread items. Click it for the list. When the strip is open, the Ariel logo appears in the middle of it.
- **Middle:** one thin-line icon per module. It scrolls, and fades at the top or bottom edge wherever more icons are hidden. When open, each icon shows its name, and the current module shows its submenu underneath (click another module to open its submenu).
- **Bottom:** your round photo (or initials). Click it for the menu: Clock in/out, My profile, Dark or Light mode, Company, Appearance (accent colour, density, language), Search, Change photo, Reset password, Clear cache and Sign out. A small green dot on the photo means you are clocked in.
- While a menu is open, the strip stays slim so the two do not overlap.
- On screens under 720px there is no strip: a small top bar opens the full sidebar over the page.

All icons, in the sidebar and on the pages, are one thin-line set (Phosphor "light"). They live in `js/icons.js`. For an even finer line, swap in Phosphor's "thin" weight.

The look is neutral on purpose (thin borders, no heavy shadows). The accent colour only shows on primary buttons, links and small highlights. Pick **Ink** in Appearance for a fully black and white look.

## Expanding icon buttons (heading row)

The Job Openings heading shows its tools as quiet icons on the right: search, filter, view, export and new. Each widens on hover to show its name; the search becomes a text box. There is one view button, and it always offers the view you are not in (Table view or Card view). The heading has a thin line under it, then the cards.

- `.xbtn` (with a `.xl` label inside) and `.xsearch` are in `css/components.css`. `fitX()` in `js/ui.js` measures each label so a button grows to exactly the width of its text.
- Put the buttons inside `<div data-actions>` and add `data-ruled="1"` to `<body>` for the thin line. Any page can use them the same way.

## Drawer (right-side panel)

`openDrawer({ title, body, foot })` in `js/ui.js` slides a panel in from the right, with a dimmed page behind it. Click outside, press Esc or use the close button to dismiss it. It is used on the Job Openings page for **New opening**, **Edit** and **View details**. Use `openModal(...)` for small centred dialogs and `openDrawer(...)` for create and edit forms. Footer buttons with `data-close` close it.

## Interface size

The whole prototype is sized in `rem` and the root size is set to **80%** in `css/base.css` (`html { font-size: 80% }`). That makes it look the way an 80% browser zoom would, but at normal zoom. Users can change it in Appearance, Interface size: Small (70%), Default (80%) or Large (100%).

- To change the default, edit that one `font-size` value (and the `"80"` default in `js/shell.js`). Do not use fixed `px` for new sizes; use `rem` so they scale too. Hairlines (1px, 2px) stay in `px` on purpose.
- Media query widths (for example 720px for the phone layout) are real screen pixels, already scaled for 80%.

## Handy details

- `Ctrl K` (or Search in the user menu) opens a command palette that searches every menu item, candidate and job.
- Clock in and out (in the user menu) is a working timer that survives moving between pages.
- The pipeline board supports drag and drop between stages.
- Choices such as theme and menu width are remembered in the browser only.
- Nothing is saved anywhere. Forms, buttons and toasts are for look and feel.

## Credits

Icons are [Phosphor Icons](https://phosphoricons.com) (light weight), MIT licence. The licence text is in `assets/LICENSE-phosphor`.
