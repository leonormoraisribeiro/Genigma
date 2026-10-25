# Genigma

**A daily genetics logic puzzle.** Three monster couples got their babies mixed up at the nursery. Use genetics and the clues to send every baby home to its parents.

▶ **Play:** https://leonormoraisribeiro.github.io/Genigma/

Genigma is a static web app (plain HTML, CSS and JavaScript, no build step and no server). It works in any modern browser, on phones and desktops, in light and dark mode.

---

## How to play

There are **3 couples (1, 2, 3)** and **6 baby monsters**. Every couple has **exactly 2 babies**.

- Each baby shows what it looks like (colour, head, body shape). That look tells you its two alleles.
- Some parents are **hidden** (shown as **?**). The clues tell you facts about them.
- Work out which couple each baby belongs to, then submit your answer with **Verdict**. You have **3 attempts**.

**Marking the babies.** Each baby has three buttons, one per couple. Tap a button once to rule that couple out (✕), twice to choose it (✓), and a third time to clear it. Each baby gets one ✓ and each couple ends up with exactly two. You can also tap a clue to cross it off.

### The clues

| Clue | Example |
|---|---|
| A fact about a hidden parent | "The mother of Couple 2 is homozygous YY for colour." |
| What a couple can or can never have | "Couple 3 can never have babies with horns HH." |
| How two babies relate | "Babies #4 and #6 are from different couples." |

Every puzzle has exactly **one** valid solution, and the clues alone are enough to find it.

---

## The genetics

Three independent traits, each with **incomplete dominance**: a monster with one of each letter gets a third, in-between look. So from the look alone you can read the genotype.

| Trait | Alleles | 0 | In between | 2 |
|---|---|---|---|---|
| Colour | B / Y | Blue **BB** | Green **BY** | Yellow **YY** |
| Head | H / A | Horns **HH** | Unicorn **HA** | Antennae **AA** |
| Body shape | S / T | Square **SS** | Circle **ST** | Triangle **TT** |

The rules are simple:

1. Each parent passes **one of its two alleles** to each baby, and the baby gets one from each parent.
2. A **homozygous** parent (BB, YY...) always passes the same allele, so all its babies are alike in that trait when the other parent is also homozygous.
3. A **heterozygous** parent (BY) passes either allele.
4. Faces are just decoration. They are not inherited.

Example: BB × YY can only have BY (green) babies. BY × BY can have blue, green or yellow babies.

---

## Daily and practice modes

- **Daily case:** a new puzzle every day, the same for everyone. Case **#1 was 12 October 2026**.
- **Difficulty by weekday:** Easy Monday and Tuesday, Normal Wednesday to Friday, Hard at weekends.
- **Practice:** unlimited cases in any difficulty, at your own pace.
- **Tutorial:** a guided case, about 2 minutes.
- **Genetics guide:** the nine looks with their genotypes, always one tap away (the **?** button).

| Level | Hidden parents (typical) | Reasoning |
|---|---|---|
| Easy | 2 to 3 | Short chains of logic |
| Normal | mostly 5 | The classic challenge |
| Hard | mostly 6 | Long chains, sometimes a "what if?" step |

The level is decided by how long the reasoning chain is for the human solver, not only by the number of hidden parents, so a few puzzles break the pattern (for example, a hard case with only 3 hidden parents).

The game ships **180 puzzles** (60 per level). The daily case is picked from the pool of the day's level, so the Normal pool lasts about 20 weeks before it starts repeating.

---

## Features

- Three languages: **English (British)**, **Portuguese (PT-PT)** and **Danish**.
- Light and dark theme, following the system setting. Respects `prefers-reduced-motion`.
- Installable as a web app (manifest and icons for Android and iOS).
- **Share result:** shares a short text with your result *and* the link, through the system share sheet or the clipboard.
- Progress, language and theme are kept in the browser (`localStorage`), per device.
- Screen-reader labels on the controls, keyboard friendly dialogs.
- Timer, attempts counter and a "next case in…" countdown.

**Privacy.** There are no accounts, no analytics and no requests to any server of ours. The only external request is to Google Fonts. Nothing leaves your device apart from what you choose to share.

---

## Project structure

```
index.html              the whole game: markup, styles and logic
i18n.js                 all text in English, Portuguese and Danish (same keys in each)
puzzles.js              the 180 puzzles (generated, do not edit by hand)
manifest.webmanifest    web app manifest
favicon.svg, icon-*.png, apple-touch-icon.png
generate_puzzles.py     puzzle generator
human_solver.py         solver that only uses human-style deductions (used to grade difficulty)
verify_puzzles.py       independent brute-force verifier
tests/smoke_test.py     end-to-end browser test
```

---

## Run it locally

Browsers block some features on `file://`, so serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

---

## Puzzles

### Generate

```bash
python generate_puzzles.py          # 60 per level, 180 in total
python generate_puzzles.py 30       # 30 per level
```

This writes `puzzles.js`. It needs `human_solver.py` in the same folder and can take a while. A puzzle is only accepted if:

1. the clues plus what is visible give **exactly one** valid assignment;
2. all 6 babies look different;
3. no clue is redundant, with at most one or two "logic" clues (same couple, different couples);
4. the human solver can solve it **without guessing**, and that decides its level.

### Verify

```bash
python verify_puzzles.py
```

Reads `puzzles.js` and brute-forces every puzzle from the clue codes, as an independent check that each has exactly one solution and that it is the stored one. Expected output: `180 puzzles checked; 0 with problems.`

### Format

Each puzzle is an object:

| Field | Meaning |
|---|---|
| `p` | the 6 parents (mother 1, father 1, mother 2, ...): genotypes, or `null` if hidden |
| `u` | the 6 babies' genotypes |
| `c` | the clues, as codes |
| `s` | the solution: couple (0, 1, 2) of each baby |
| `d` | level: `easy`, `normal` or `hard` |
| `g` | the real genotypes of all parents, shown at the end |

A genotype is a list of three numbers, one per trait: the count of the second allele (0, 1 or 2).

Clues are stored as **codes**, not sentences. The game writes the sentence from `i18n.js`, so you can rename things or translate the game without regenerating puzzles:

```
["p", parent, trait, rel]         rel: het | hom | hom0 | hom2 | has0 | has2
["c", couple, trait, look, can]   can: 1 = "can have", 0 = "can never have"
["l", i, j, same]                 same: 1 = same couple, 0 = different couples
```

---

## Tests

An end-to-end smoke test plays today's case to a win in a real browser and checks that there are no JavaScript errors and that **Share result** sends one text containing both the result and the link (and falls back to the clipboard when the share sheet is unavailable).

```bash
pip install playwright
playwright install chromium
python tests/smoke_test.py
```

---

## Customising

- **Names, looks and letters:** in `i18n.js` (`traits`, per language). The letters are the same in every language.
- **Which look sits in the middle, and how monsters are drawn:** `THEME` in `index.html`.
- **Add a language:** copy one language block in `i18n.js`, translate it and keep the same keys.
- **Launch date and weekly schedule:** the `LAUNCH` and `WEEK` constants in `index.html`.

---

## Deploy

The game is hosted on GitHub Pages. In **Settings → Pages**, choose "Deploy from a branch", branch `main`, folder `/ (root)`. `index.html` must be at the root of the repository. After a push it usually takes a minute or two to update; use a hard refresh if you still see the old version.

---

## Known limitations

- **Solutions are in the page.** `puzzles.js` contains every answer, and anyone can read them. That is the price of a fully static game.
- **No offline mode yet:** there is a manifest but no service worker.
- **No leaderboard:** there is nowhere to store shared scores. Adding one would need a small backend.
- The "day" follows each player's local date, so players in different time zones switch to the next case at different moments.

---

## License

No license has been chosen yet. Until one is added, all rights are reserved by the author.
