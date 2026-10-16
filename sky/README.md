# Ariel HR, "Sky" look (Recruitment, Dashboard to Stages)

A lighter, quieter skin for the Recruitment pages. The original design in the parent folder is untouched.
Open `recruitment-dashboard.html` in a browser (double-click works). No build step.

Redesigned pages: Dashboard, Job Openings, Open Jobs, Candidates, Interview, Recruitment Pipeline, Recruitment Survey, Stages.
Skill Zone, Email Applications, Intake Mailbox and the candidate profile only pick up the new colours.

## The look

White surfaces on a pale sky background, sky-blue accent, small type. Nothing was removed; it was moved.

| Idea | How it shows up |
|---|---|
| **Quiet by default** | A row or card shows a name and one or two facts only. |
| **Reveal on hover** | Rating, source, dates, skills, managers and actions open when the pointer or keyboard focus is on the item. Cards float a small panel under themselves, so nothing around them moves. Touch screens have no hover, so everything is shown there. |
| **Segregate** | Busy pages are split into pill tabs: Dashboard (Overview, Trends, Vacancies, AI, Waiting), Interview (Week, Upcoming, Feedback due, History). Secondary filters sit behind one Filters button. |
| **Enlarge on hover** | Tiles, cards and rows grow slightly and lift. |

## Where to edit

| To change | Edit |
|---|---|
| Colours, type sizes, radius, shadows (light and dark) | top of `css/sky.css` |
| Pill tabs, `.peek`, `.rx`, `.lrow`, `.lift`, `.stat`, `.selbtn` patterns | `css/sky.css` |
| Stage colours | `DEMO.stages` in `js/data.js` |
| Stage chip, AI ring, avatar colours, `skyMenu()`, `pills()` | `js/ui.js` |
| One page | that page's `.html` file |

## Using the patterns on another page

```html
<div class="lrow hov">                      <!-- a row that reveals on hover -->
  <div class="main"><b>Name</b><small>Detail</small></div>
  <div class="rx">extra · facts <button class="btn sm">Open</button></div>
</div>

<article class="card lift hov">             <!-- a card that enlarges and floats a panel -->
  Title
  <div class="peek"><div class="in">More detail</div></div>
</article>
```
Use `class="peek flow"` when the detail should slide open in place instead of floating.
