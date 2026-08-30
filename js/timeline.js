async function initTimelinePage() {
  const rail = document.querySelector("[data-timeline-rail]");
  const detail = document.querySelector("[data-timeline-detail]");
  const slider = document.querySelector("[data-year-slider]");
  const labelsRoot = document.querySelector("[data-year-labels]");
  const compareRoot = document.querySelector("[data-compare-root]");
  if (!rail || !detail) return;

  const data = await App.loadJSON("data/timeline.json");
  const minYear = data.years[0];
  const maxYear = data.years[data.years.length - 1];
  let lastEventId = null;

  function visibleEvents() {
    return data.events.filter((event) => {
      if (event.reality === "shared") return true;
      return event.reality === App.AppState.reality;
    });
  }

  function eventForYear(year) {
    const events = visibleEvents();
    const exact = events.find((event) => event.year === year);
    if (exact) return exact;

    return events.reduce((best, event) => {
      if (!best) return event;
      return Math.abs(event.year - year) < Math.abs(best.year - year) ? event : best;
    }, null);
  }

  function renderLabels() {
    if (!labelsRoot) return;

    const labelYears = [1930, 1941, 1960, 1980, 2026].filter((year) =>
      data.years.includes(year)
    );

    labelsRoot.innerHTML = labelYears
      .map((year, index) => {
        const percent = ((year - minYear) / (maxYear - minYear)) * 100;
        const edgeClass =
          index === 0 ? "is-start" : index === labelYears.length - 1 ? "is-end" : "";
        return `<span class="${edgeClass}" style="left:${percent}%">${year}</span>`;
      })
      .join("");
  }

  function renderRail(activeEvent) {
    const events = visibleEvents();
    rail.classList.toggle("is-historical", App.AppState.reality === "historical");
    rail.classList.toggle("is-alternative", App.AppState.reality === "alternative");

    rail.innerHTML = events
      .map((event) => {
        const active = activeEvent && activeEvent.id === event.id;
        return `
          <button class="timeline-event ${active ? "is-active" : ""}" type="button" data-event-id="${event.id}">
            <div class="timeline-event__year">${event.year}</div>
            <div class="timeline-event__title">${event.title}</div>
          </button>
        `;
      })
      .join("");
  }

  rail.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-event-id]");
    if (!btn) return;
    const event = visibleEvents().find((item) => item.id === btn.dataset.eventId);
    if (!event) return;
    if (slider) slider.value = event.year;
    sync(event.year, true);
  });

  function renderDetail(event, currentYear) {
    if (!event) {
      detail.innerHTML = `<p class="muted">${I18N.t("timeline.pick")}</p>`;
      return;
    }

    const realityLabel =
      event.reality === "alternative"
        ? `<span class="tag tag--alternative">${I18N.t("timeline.alt")}</span>`
        : event.reality === "historical"
          ? `<span class="tag tag--history">${I18N.t("timeline.hist")}</span>`
          : `<span class="tag">${I18N.t("timeline.shared")}</span>`;

    const changed = lastEventId !== event.id;
    lastEventId = event.id;

    detail.innerHTML = `
      <div class="panel__meta">
        ${App.statusTag(event.status)}
        ${realityLabel}
      </div>
      <div class="timeline-detail__year">${currentYear}</div>
      <h2 class="display display--md" style="margin-bottom:0.75rem;">${event.title}</h2>
      <p class="eyebrow" style="margin-bottom:1rem;">${event.place} · ${I18N.t("timeline.event")} ${event.year}</p>
      <p class="body-text">${event.description}</p>
      ${App.sourceCite(event.source)}
    `;

    if (changed) {
      detail.classList.remove("is-fading");
      void detail.offsetWidth;
      detail.classList.add("is-fading");
    }
  }

  function renderCompare(year) {
    if (!compareRoot) return;
    const item =
      data.comparisons.find((c) => c.year === year) ||
      data.comparisons.reduce((best, c) => {
        if (!best) return c;
        return Math.abs(c.year - year) < Math.abs(best.year - year) ? c : best;
      }, null);

    if (!item) return;

    compareRoot.innerHTML = `
      <div class="compare reveal is-visible">
        <div class="compare__side compare__side--history">
          <div class="compare__label">${I18N.t("timeline.compare.hist")} · ${item.historicalNote === "FACT" ? I18N.t("timeline.compare.fact") : I18N.t("timeline.compare.analysis")}</div>
          <div class="compare__year">${item.year}</div>
          <p class="compare__text">${item.historical}</p>
          ${App.sourceCite(item.historicalSource || I18N.t("timeline.seeSources"))}
        </div>
        <div class="compare__side compare__side--alternative">
          <div class="compare__label">${I18N.t("timeline.compare.alt")}</div>
          <div class="compare__year">${item.year}</div>
          <p class="compare__text">${item.alternative}</p>
          ${App.sourceCite(item.alternativeSource || I18N.t("alt.hypothesis"))}
        </div>
      </div>
    `;
  }

  function sync(year, fromClick) {
    const currentYear = Math.round(Number(year));
    App.setYear(currentYear);

    if (fromClick && slider) {
      slider.value = currentYear;
    }

    const event = eventForYear(currentYear);
    renderRail(event);
    renderDetail(event, currentYear);
    renderCompare(event ? event.year : currentYear);
  }

  renderLabels();

  if (slider) {
    slider.min = minYear;
    slider.max = maxYear;
    slider.step = 1;
    slider.value = App.AppState.year;
    slider.addEventListener("input", () => {
      sync(Number(slider.value), false);
    });
  }

  window.addEventListener("realitychange", () => {
    sync(slider ? Number(slider.value) : App.AppState.year, false);
  });

  sync(App.AppState.year, true);
}

document.addEventListener("DOMContentLoaded", initTimelinePage);
