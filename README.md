# Dylan's ITE Portfolio — how it works

## Pages
- `index.html` - Home: general info + a card for each year
- `year.html?year=1` (2, 3, 4) — one template, shows all assessments for that year
- `assessment.html?id=...` - one template, shows a single assessment in full
- Every page shares the same header (logo banner, Home / Years dropdown,
  breadcrumb) — that's generated automatically by `js/render.js`, you never
  need to copy or edit that part by hand.

## Adding a new assessment

1. Open `js/data.js`.
2. Copy the `TEMPLATE` block near the bottom.
3. Paste it inside the `ASSESSMENTS = [ ... ]` list, above the closing `]`.
4. Fill in the fields:
   - `title` - the assessment's name (this is what shows everywhere, and is
     the easiest thing to rename later — just edit this one line)
   - `year` - 1, 2, 3 or 4, decides which Year page it appears under
   - `summary` - one or two sentences, shown on the year overview card
   - `description` - the longer write-up, shown on the detail page
   - `image` - optional. Put a picture in `images/assessments/`, then set
     this to `"images/assessments/yourfile.jpg"`. Leave `""` for a plain
     placeholder instead.
   - `files` - optional evidence, e.g. a PDF placed in `/files`
5. Save the file.

No HTML editing needed — the year page and the assessment's own detail page
are both generated automatically from that one entry.

## Uploading to GitHub — keep the folders intact

Your site needs these folders to exist exactly as named: `css`, `js`,
`images`, `images/assessments`, `files`. If you upload files without their
folders, the page loads blank (no styling, missing logo) — this happened
once already, so here's the reliable way to avoid it:

1. On your computer, unzip the project so you have one folder containing
   `index.html`, `year.html`, `assessment.html`, `README.md`, and the four
   subfolders.
2. On the GitHub repo page, click "Add file" → "Upload files".
3. Open your file explorer, select the **folders themselves** (`css`, `js`,
   `images`, `files`) together with the three `.html` files, and **drag them
   all into the browser window at once**. Dragging folders (not using the
   "choose your files" button) is what preserves the folder structure.
4. Commit the upload.
5. Check the repo's Code tab afterwards — you should see `css/`, `js/`,
   `images/` etc. as folders you can click into, not loose files at the top
   level.

## Getting a working URL (GitHub Pages)

1. Repo → **Settings** → **Pages** (left sidebar).
2. Source: "Deploy from a branch" → branch `main` → folder `/ (root)`. Save.
3. Wait about a minute, refresh the Pages settings page — your live URL
   appears at the top, in the form:
   `https://<your-username>.github.io/<your-repo-name>/`
4. Any time you upload changed files to the repo, the live site updates
   within a minute or so.
