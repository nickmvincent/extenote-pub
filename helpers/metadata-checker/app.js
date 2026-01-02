const state = {
  entries: [],
  required: [],
  warnings: [],
};

const elements = {
  list: document.getElementById("entryList"),
  template: document.getElementById("entryTemplate"),
  search: document.getElementById("searchInput"),
  toggleMissing: document.getElementById("toggleMissing"),
  toggleWarnings: document.getElementById("toggleWarnings"),
  countTotal: document.getElementById("countTotal"),
  countMissing: document.getElementById("countMissing"),
  countWarnings: document.getElementById("countWarnings"),
};

function normalize(value) {
  return String(value || "").toLowerCase();
}

function formatAuthors(authors) {
  if (!authors) return "-";
  if (Array.isArray(authors)) return authors.join(", ");
  return authors;
}

function computeStatus(entry) {
  if (entry.missing.length) return "missing";
  if (entry.warnings.length) return "warning";
  return "ok";
}

function updateStats(entries) {
  elements.countTotal.textContent = entries.length;
  elements.countMissing.textContent = entries.filter((e) => e.missing.length).length;
  elements.countWarnings.textContent = entries.filter((e) => !e.missing.length && e.warnings.length).length;
}

function matchesSearch(entry, query) {
  if (!query) return true;
  const haystack = [
    entry.file,
    entry.frontmatter.citation_key,
    entry.frontmatter.title,
    entry.frontmatter.url,
    formatAuthors(entry.frontmatter.authors),
  ]
    .map(normalize)
    .join(" ");
  return haystack.includes(query);
}

function render(entries) {
  elements.list.innerHTML = "";
  const fragment = document.createDocumentFragment();

  entries.forEach((entry) => {
    const clone = elements.template.content.cloneNode(true);
    const frontmatter = entry.frontmatter;
    const title = frontmatter.title || frontmatter.citation_key || entry.file;
    const subtitle = frontmatter.citation_key ? `Citation key: ${frontmatter.citation_key}` : entry.file;

    clone.querySelector("[data-title]").textContent = title;
    clone.querySelector("[data-subtitle]").textContent = subtitle;
    clone.querySelector("[data-authors]").textContent = formatAuthors(frontmatter.authors);
    clone.querySelector("[data-year]").textContent = frontmatter.year || "-";
    clone.querySelector("[data-entry]").textContent = frontmatter.entry_type || "-";

    const urlEl = clone.querySelector("[data-url]");
    if (frontmatter.url) {
      const link = document.createElement("a");
      link.href = frontmatter.url;
      link.target = "_blank";
      link.rel = "noreferrer";
      link.textContent = frontmatter.url;
      urlEl.appendChild(link);
    } else {
      urlEl.textContent = "-";
    }

    clone.querySelector("[data-file]").textContent = entry.file;

    const statusEl = clone.querySelector("[data-status]");
    const status = computeStatus(entry);
    if (status === "missing") {
      statusEl.textContent = "Missing required";
      statusEl.classList.add("bad");
    } else if (status === "warning") {
      statusEl.textContent = "Missing optional";
      statusEl.classList.add("warn");
    } else {
      statusEl.textContent = "Complete";
    }

    const issuesEl = clone.querySelector("[data-issues]");
    if (entry.missing.length || entry.warnings.length) {
      const missingList = entry.missing.length ? `Missing required: ${entry.missing.join(", ")}` : null;
      const warningList = entry.warnings.length ? `Missing optional: ${entry.warnings.join(", ")}` : null;
      issuesEl.textContent = [missingList, warningList].filter(Boolean).join(". ");
      issuesEl.classList.add("show");
    }

    const openEl = clone.querySelector("[data-open]");
    if (!frontmatter.url) {
      openEl.classList.add("disabled");
      openEl.setAttribute("aria-disabled", "true");
    } else {
      openEl.href = frontmatter.url;
    }

    fragment.appendChild(clone);
  });

  elements.list.appendChild(fragment);
}

function applyFilters() {
  const query = normalize(elements.search.value);
  const onlyMissing = elements.toggleMissing.checked;
  const onlyWarnings = elements.toggleWarnings.checked;

  const filtered = state.entries.filter((entry) => {
    if (!matchesSearch(entry, query)) return false;
    if (onlyMissing && !entry.missing.length) return false;
    if (onlyWarnings && !entry.warnings.length) return false;
    return true;
  });

  render(filtered);
}

async function init() {
  try {
    const response = await fetch("/api/entries");
    const payload = await response.json();
    state.entries = payload.entries || [];
    state.required = payload.required || [];
    state.warnings = payload.warnings || [];
    updateStats(state.entries);
    applyFilters();
  } catch (error) {
    elements.list.innerHTML = "<p>Failed to load entries. Make sure the server is running.</p>";
  }
}

[elements.search, elements.toggleMissing, elements.toggleWarnings].forEach((el) => {
  el.addEventListener("input", applyFilters);
  el.addEventListener("change", applyFilters);
});

init();
