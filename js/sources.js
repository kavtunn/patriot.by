async function initSourcesPage() {
  const legend = document.querySelector("[data-sources-legend]");
  const filters = document.querySelector("[data-sources-filters]");
  const grid = document.querySelector("[data-sources-grid]");
  const about = document.querySelector("[data-sources-about]");
  if (!grid) return;

  const data = await App.loadJSON("data/sources.json");
  let activeFilter = "ALL";

  if (about && data.about) {
    about.innerHTML = `
      <h2 class="display display--md" style="margin:0 0 1rem;">${data.about.title}</h2>
      ${data.about.paragraphs.map((p) => `<p class="body-text" style="margin-bottom:1rem;">${p}</p>`).join("")}
    `;
  }

  if (legend) {
    legend.innerHTML = data.legend
      .map(
        (item) => `
        <div class="panel reveal is-visible">
          ${App.statusTag(item.id)}
          <h3 class="panel__title" style="margin-top:0.75rem;">${item.label}</h3>
          <p class="panel__text">${item.description}</p>
        </div>
      `
      )
      .join("");
  }

  function renderFilters() {
    if (!filters) return;
    const options = [
      { id: "ALL", label: I18N.t("filter.ALL") },
      { id: "FACT", label: I18N.t("filter.FACT") },
      { id: "ANALYSIS", label: I18N.t("filter.ANALYSIS") },
      { id: "HYPOTHESIS", label: I18N.t("filter.HYPOTHESIS") }
    ];
    filters.innerHTML = options
      .map(
        (opt) => `
        <button class="filter-btn ${activeFilter === opt.id ? "is-active" : ""}" type="button" data-filter="${opt.id}">
          ${opt.label}
        </button>
      `
      )
      .join("");
  }

  if (filters) {
    filters.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      renderFilters();
      renderGrid();
    });
  }

  function renderGrid() {
    const list =
      activeFilter === "ALL"
        ? data.sources
        : data.sources.filter((s) => s.status === activeFilter);

    grid.innerHTML = list
      .map(
        (source) => `
        <article class="source-card" id="${source.id}">
          ${App.statusTag(source.status)}
          <h3 class="source-card__title">${source.title}</h3>
          <p class="source-card__meta">
            ${source.author}<br>
            ${source.year} · ${source.type}
          </p>
          <p class="source-card__used"><strong>${I18N.t("sources.used")}</strong> ${source.usedFor}</p>
          ${
            source.link
              ? `<p class="source-card__link"><a href="${source.link}" target="_blank" rel="noopener noreferrer">${I18N.t("sources.open")}</a></p>`
              : `<p class="source-card__link muted">${I18N.t("sources.internal")}</p>`
          }
        </article>
      `
      )
      .join("");
  }

  renderFilters();
  renderGrid();

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) {
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }
}

document.addEventListener("DOMContentLoaded", initSourcesPage);
