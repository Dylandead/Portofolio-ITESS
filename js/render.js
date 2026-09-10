const TOTAL_YEARS = 4;

function statusLabel(status) {
  if (status === "completed") return "Completed";
  if (status === "progress") return "In progress";
  return "Planned";
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

/* ---------------- Shared header: banner + nav + breadcrumb ---------------- */
/* crumbs: array of { label, href } — href omitted/null for the current page */
function renderChrome(crumbs) {
  const mount = document.getElementById("site-chrome");
  if (!mount) return;

  const yearLinks = Array.from({ length: TOTAL_YEARS }, (_, i) => i + 1)
    .map((y) => `<a href="year.html?year=${y}" class="dropdown-item">Year ${y}</a>`)
    .join("");

  const breadcrumbHtml = (crumbs && crumbs.length)
    ? crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        const sep = i > 0 ? '<span class="crumb-sep">/</span>' : "";
        const content = (!isLast && c.href)
          ? `<a href="${c.href}">${escapeHtml(c.label)}</a>`
          : `<span class="crumb-current">${escapeHtml(c.label)}</span>`;
        return `${sep}${content}`;
      }).join("")
    : "";

  mount.innerHTML = `
    <div class="banner">
      <div class="wrap banner-inner">
        <img src="images/logo.png" alt="International Teacher Education logo" class="banner-logo">
        <div class="banner-text">
          <div class="banner-title">Dylan's Portfolio</div>
          <div class="banner-sub">International Teacher Education</div>
        </div>
      </div>
    </div>
    <nav class="site-nav-bar">
      <div class="wrap nav-inner">
        <a href="index.html" class="nav-link">Home</a>
        <div class="dropdown">
          <button type="button" class="nav-link dropdown-trigger" id="years-trigger">
            Years <span class="chev">&#9662;</span>
          </button>
          <div class="dropdown-menu" id="years-menu">
            ${yearLinks}
          </div>
        </div>
      </div>
    </nav>
    ${breadcrumbHtml ? `<div class="breadcrumb"><div class="wrap">${breadcrumbHtml}</div></div>` : ""}
  `;

  const trigger = document.getElementById("years-trigger");
  const menu = document.getElementById("years-menu");
  if (trigger && menu) {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", () => menu.classList.remove("open"));
  }
}

/* ---------------- Home page ---------------- */
function renderHomeYearLinks() {
  const mount = document.getElementById("year-links");
  if (!mount) return;

  mount.innerHTML = Array.from({ length: TOTAL_YEARS }, (_, i) => i + 1).map((y) => {
    const count = ASSESSMENTS.filter((a) => a.year === y).length;
    return `
      <a class="year-card" href="year.html?year=${y}">
        <div class="year-card-num">Year ${y}</div>
        <div class="year-card-count">${count} assessment${count === 1 ? "" : "s"}</div>
      </a>`;
  }).join("");
}

/* ---------------- Year overview page ---------------- */
function renderYear() {
  const params = new URLSearchParams(window.location.search);
  const year = parseInt(params.get("year"), 10) || 1;

  renderChrome([
    { label: "Home", href: "index.html" },
    { label: `Year ${year}` }
  ]);

  const titleEl = document.getElementById("year-title");
  if (titleEl) titleEl.textContent = `Year ${year}`;

  const grid = document.getElementById("year-grid");
  if (!grid) return;

  const entries = ASSESSMENTS.filter((a) => a.year === year);

  if (!entries.length) {
    grid.outerHTML = `
      <div class="empty-state">
        <h3>Nothing added for Year ${year} yet</h3>
        <p>Open <code>js/data.js</code> and copy the TEMPLATE block into the ASSESSMENTS list, with <code>year: ${year}</code>, to add the first assessment here.</p>
      </div>`;
    return;
  }

  grid.innerHTML = entries.map((a) => `
    <a class="assessment-card status-${a.status}" href="assessment.html?id=${encodeURIComponent(a.id)}">
      <div class="card-thumb">
        ${a.image
          ? `<img src="${escapeHtml(a.image)}" alt="">`
          : `<span class="thumb-placeholder">${escapeHtml((a.title || "?").charAt(0))}</span>`}
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3>${escapeHtml(a.title)}</h3>
          <span class="status-pill">${statusLabel(a.status)}</span>
        </div>
        <div class="entry-course">${escapeHtml(a.course)}</div>
        <p class="entry-summary">${escapeHtml(a.summary)}</p>
      </div>
    </a>
  `).join("");
}

/* ---------------- Assessment detail page ---------------- */
function renderDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const entry = ASSESSMENTS.find((a) => a.id === id);

  renderChrome(entry
    ? [
        { label: "Home", href: "index.html" },
        { label: `Year ${entry.year}`, href: `year.html?year=${entry.year}` },
        { label: entry.title }
      ]
    : [{ label: "Home", href: "index.html" }, { label: "Not found" }]
  );

  const container = document.getElementById("detail-container");
  if (!container) return;

  if (!entry) {
    container.innerHTML = `
      <div class="wrap not-found">
        <h1 style="font-family:var(--serif);color:var(--purple-deep);">Not found</h1>
        <p>This assessment doesn't exist yet, or the link is out of date.</p>
        <a class="back-link" href="index.html">&larr; Back to portfolio</a>
      </div>`;
    return;
  }

  document.title = entry.title + " — Portfolio";

  const filesHtml = entry.files && entry.files.length
    ? `<h2>Evidence</h2><ul class="file-list">${entry.files.map(f =>
        `<li><a href="${escapeHtml(f.url)}">${escapeHtml(f.name)}</a></li>`
      ).join("")}</ul>`
    : "";

  const reflectionHtml = entry.reflection
    ? `<h2>Reflection</h2><p>${escapeHtml(entry.reflection)}</p>`
    : "";

  const imageHtml = entry.image
    ? `<img class="detail-image" src="${escapeHtml(entry.image)}" alt="">`
    : "";

  container.innerHTML = `
    <div class="wrap detail-header">
      <a class="back-link" href="year.html?year=${entry.year}">&larr; Back to Year ${entry.year}</a>
      <h1>${escapeHtml(entry.title)}</h1>
      <div class="detail-meta">
        <span>${escapeHtml(entry.course)}</span>
        <span>${escapeHtml(entry.period)}</span>
        <span>${statusLabel(entry.status)}</span>
      </div>
    </div>
    <div class="wrap detail-body">
      ${imageHtml}
      <h2>Summary</h2>
      <p>${escapeHtml(entry.summary)}</p>
      <h2>Description</h2>
      <p>${escapeHtml(entry.description)}</p>
      ${reflectionHtml}
      ${filesHtml}
    </div>
  `;
}
