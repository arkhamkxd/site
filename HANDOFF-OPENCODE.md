# Portfolio rebuild — handoff

Paste this whole file as your opening prompt.

---

## Who you're working for

Arqum "Arkham" Khan — 22, Karachi, Product & Growth Manager at WonderTree.
Job-hunting. This site is a hiring asset, not an art project: a recruiter has to
find the facts fast, and the design has to make him look like someone worth
interviewing.

**How he wants you to work:**

- **Ask before you act.** When he says "discuss", discuss — don't write code.
  Never change a file he didn't ask you to change.
- **Push back when he's wrong.** He's asked for this explicitly. Don't flatter him.
- **Verify before you claim.** Don't say something works until you've seen it work.
  He has caught multiple "fixed" claims that weren't.
- **Be concise.** Short, plain answers. No preamble, no essays.

---

## What exists

`E:\Work\Job stuff\site\` — static site, deployed to Vercel from the
`arkhamkxd/site` repo (push to `master`, live in ~20s at
`https://arkhamkhan.vercel.app`).

| File | What it is |
|---|---|
| `index.html` | **The rebuild, and what is deployed.** ~990 lines, single file, no build step, no dependencies. This is the only file you edit. |
| `v1.html` | The OLD site. Dark, scrolling, 660 lines — but **complete**: all 8 projects written up. Kept as a fallback and linked from the live page's work-in-progress note. Don't edit it. |
| `img/` | 508KB. App screenshots (`mydiary-*`, `f5-*`), `tabeeb-1`, logos, and 5 character portraits `me-{neutral,grin,brow,point,deadpan}.webp` |
| `sidelinereel/` | A separate interactive prototype from a job assessment. Leave it alone. |
| `Arqum Khan CV.pdf` | Served at `/Arqum%20Khan%20CV.pdf`. Don't regenerate. |
| `cat.js` | Pixel-cat easter egg from the old site. Not used by `index.html`. |

Run it: `python -m http.server 8787` from `site/`, open `http://localhost:8787/`.
`?intro=1` replays the intro (it otherwise runs once per tab, and Ctrl+Shift+R
will not reset it).

---

## The concept

**A scrapbook you turn the pages of.** Cream paper, riso-print inks, collage
objects. It replaced a dark scrolling site that "read like a resume".

### Design system — in `:root`, don't invent new values

```
--paper   #efe9dd     page
--paper-2 #f7f3ea     objects sitting on the page
--ink     #16130f     text
--red     #e0432a     riso red
--blue    #2f4bd8     riso blue
```

Plus exactly two extra inks used **only** on the postage stamps, because a
one-colour stamp set looks wrong: green `#3f8f6f`, ochre `#c4851f`.

Type: `--display` Archivo Black · `--serif` Instrument Serif · `--body`
Newsreader · `--mono` JetBrains Mono · `--hand` Caveat. Plus Abril Fatface and
Bebas Neue, used **only** for the cut-out letters.

**The rule that keeps it from looking junior: the collage sits on a strict grid.**
Rotations are capped at ~4°. Everything still aligns. Don't loosen this.

### Components already built (reuse, don't reinvent)

- **Cut-out letters** (`.ct` + `.blk/.ser/.serit/.mono/.body/.bebas/.abril`,
  stocks `.red/.blue/.ink/.pap`, sizes `.sm/.md/.lg`) — ransom-note lettering.
  Used on the name and on `CONTENTS`. Use sparingly, one word per page max.
- **Rubber stamp** (`.rub` + `.r/.b` + `.ink1/.ink2/.ink3`) — hand-inked
  impression. The `ink*` classes are SVG turbulence masks with three different
  seeds so no two impressions match.
- **Postage stamp** (`.pw` > `.ps` > `.pan`) — real perforations via a
  four-layer CSS mask with `mask-composite: intersect`. Shadow lives on `.pw`
  because filter runs *before* mask on the same element.
- **Stapled photo pile** (`.pile` > `.pic`) — overlapping prints, each with its
  own staple at a different angle, handwritten captions.
- **Thumbtack** (`.tack`), **tape** (`--tape`), **binder holes** (`.binder`),
  **scissor rule** (`.cut`), **stickers** (`.sticker`), **drop cap**
  (`.p-body .first::first-letter`), **hand-drawn SVG arrows** (`.arrow`).
- **Custom cursor** — drawn SVG arrow, black default, **red over anything
  clickable**.

### Mechanics

**The book.** Pages are `.leaf` elements stacked absolutely; the document does
not scroll (`body{overflow:hidden}`). A leaf hinges on its left edge (the spine,
where the binder holes are) and rotates in 3D. 1.05s.

- Turned leaves get a low `z-index` so they pile under already-turned pages.
- **Drag anywhere to turn** — the leaf tracks your pointer; past 20% of the
  viewport width it completes, short of that it springs back.
- Dragging *right* un-turns the **previous** leaf while the current page stays
  still. Single-sided book: the previous sheet comes back over the top.
- Corner affordances bottom-left (back) and bottom-right (next) — folded
  triangles that grow on hover. Real `<button>`s.
- Also: `←` `→`, PageUp/PageDown, mouse wheel, touch.
- A leaf taller than the window scrolls **inside itself**; the wheel only turns
  the page once that inner scroll hits its end.
- Contents links turn to the page instead of jumping to an anchor.

**The guide character.** Arqum as a flat cartoon (thick brush outline, dot eyes,
red shirt, glasses, skin left as bare paper). Five expressions.

- On load: a **visual-novel intro**. Page dims, box appears bottom-centre,
  text types out. Click mid-type completes the line; click a finished line
  advances; last click closes it and un-dims.
- A **blinking red triangle** appears only when a line has finished typing.
  This matters — without it the two-stage click feels broken, which is a bug
  that was already reported once and fixed by adding the indicator, not by
  changing the logic.
- Runs **once per tab** (`sessionStorage`). `?intro=1` wipes the flags and
  replays. Note `Ctrl+Shift+R` does NOT clear sessionStorage.
- After the intro, the same box carries one line per page, fired on page turn.
  `data-face` + `data-say` on the `.leaf`.

---

## Where it's up to

**Deployed** at `https://arkhamkhan.vercel.app`, with a work-in-progress note in
the bottom margin linking to `v1.html`. Three URLs were submitted in a live job
application and must keep resolving: `/`, `/sidelinereel/`,
`/Arqum%20Khan%20CV.pdf`.

**3 of ~11 pages built:**

1. **Cover** — cut-out name, ARKHAM taped tag, handwritten lede, rubber-stamp
   discipline row, four postage-stamp links.
2. **Contents** — three columns: Work / Community / Contract+Venture+Freelance.
   Company is the chapter (name, dates, role); its spreads nest under it with
   numbers and leader dots. Fits exactly one screen.
3. **MyDiary AI** — the template for every project spread.

**The spread template** — eight slots, fill them per project:
rule header (`№ / company / category`) → title + icon + stamp → one-line punch →
artifact zone (the stapled pile) → body, 2 short paragraphs with a drop cap →
three stickers → links → a guide beat.

### What's left

**Seven spreads are listed in the contents but don't exist.** Only
`#p-mydiary` resolves. Needed: `p-platform`, `p-assistant`, `p-focus5`,
`p-alrahim`, `p-passed`, `p-fof`, `p-gdsc`, `p-gdgoc`, `p-tabeeb`.

**Ask him for imagery before building a spread.** He has material and will
supply it — do not design around its absence, and do not quietly downgrade a
project because you don't have a screenshot. Most wanted: Friends of Figma and
GDGoC photos, Al Rahim certificate/demo photos, Passed Recordings release
artwork, WonderTree Arabic-layout screens.

### Open decisions — his call, don't decide alone

1. **Two-page spread?** Currently one full-width page hinged at the far left.
   A real book is two half-width pages hinged at a centre spine. It would read
   much more strongly as a book but means relaying out every spread.
2. **The guide box covers bottom-centre content** on the contents and project
   pages for its 10 seconds. Options: shrink it for page beats, move it, or
   reserve space.
3. **Spread order is chronological**, so MyDiary (the acquisition) is `03`,
   not first.
4. Three categorisations he hasn't confirmed: Passed Recordings under Work,
   Lappy.pk under its own "Venture" heading, Anjuman marked as an internship.

---

## Content rules — these are not negotiable

- **Never name his Friends of Figma co-leads on the site.** He co-leads at peer
  level and naming them reads badly.
- **The GDGoC UIT chapter lead is his fiancée. Never mention this. Never imply it.**
- **Never mention the ongoing IP dispute / legal proceedings.** Not anywhere, ever.
- **Keep Lappy.pk (hardware import/wholesale) low-profile.**
- Contact email is `arkham.workmail@gmail.com`. **Never** `arkham@wondertree.co` —
  his current employer reads that inbox.
- Don't claim numbers that aren't already in `master-profile.md` or
  `cv-general.md` in the parent folder. If a figure isn't there, ask.
- He does **not** want to look like a goody-two-shoes or a moralist. Lead with
  what was built and what it earned.

### Weighting — he has corrected this once already

Do not treat the two shipped apps as the only real work. **Friends of Figma
Karachi is a professional, Figma-backed community he co-founded** — it carries
equal weight to a product. GDSC DUET and GDGoC UIT are student-era and marked as
such. Communities, contracts, employment and freelance are **separate
categories**, not a hierarchy with "everything else" at the bottom.

---

## Known traps

- **Mask alpha maths.** An SVG turbulence mask whose `feColorMatrix` alpha row
  never reaches 0 does *nothing*. `1.26 − 0.6·noise` bottoms out at 0.66 and
  clamps. That shipped once and was invisible. Current values reach 0.
- **`mix-blend-mode: overlay` at low opacity over saturated flat colour is a
  near no-op.** Use straight alpha.
- **`filter` runs before `mask`** on the same element — a drop-shadow gets cut
  away by the mask. Put the shadow on a wrapper.
- **CSS specificity:** `.name span` (0,1,1) beats `.nick` (0,1,0). Cost an hour.
- **Sub-pixel borders vanish.** `.16em` of a 6.8px font is 0.57px. Use px for
  anything thin.
- **Bash heredocs break** on content containing `'` inside embedded SVG. Write a
  script file instead of piping a heredoc.
- Verify visually. Render it and look before saying it's done.

---

## First thing to do

Read `index.html` end to end before changing anything — it's one file and the
components are all in it. Then ask him which of the four open decisions above he
wants settled first, and what imagery he can send.
