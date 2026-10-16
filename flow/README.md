# Recruitment Flow (prototype)

One page, four connected steps. Open `index.html` (double-click works; no build, no server).

    Openings  ->  New job  ->  Pipeline  ->  Interviews
       1            2           3             4

The thread at the top shows where you are and lets you jump to any step. The address changes
(`#/openings`, `#/create`, `#/pipeline/1`, `#/interviews/1`), so the browser Back button works.

## How the steps hand off
- **Openings:** click a job to open its pipeline. Hover a row for Edit and Interviews. **New job** starts step 2.
- **New job:** type the title; the rest of the form opens. A live preview shows the card. **Publish** lands you in the new job's pipeline.
- **Pipeline:** drag cards between stages, or hover a card for quick Schedule and Next buttons. Click a card for the candidate drawer (rating, stage track, facts, **Schedule interview**).
- **Schedule interview** (drawer): sends the invite, moves the candidate to Interview, then offers **See it in Interviews**.
- **Interviews:** upcoming, needs feedback, done. **Add feedback** (rating and decision). "Move forward" puts the candidate in Offer and offers **Open pipeline**. "Mark as hired" in the drawer updates the opening's filled count.

Data is the demo data in `js/data.js`, kept in memory only (a reload resets it).

## Where to edit
| To change | Edit |
|---|---|
| Colours, shadows, easing | `:root` at the top of `css/flow.css` |
| Stage names and colours | `LABEL` and `COLOR` in `js/app.js` |
| A step's layout | its `v...` function in `js/app.js` (`vOpenings`, `vCreate`, `vPipeline`, `vInterviews`) |
| Button behaviour | the `A` object in `js/app.js` (one function per `data-act`) |
