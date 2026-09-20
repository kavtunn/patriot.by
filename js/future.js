async function initFuturePage() {
  const cardsRoot = document.querySelector("[data-future-cards]");
  const statsRoot = document.querySelector("[data-future-stats]");
  const cityTabs = document.querySelector("[data-city-tabs]");
  const skyline = document.querySelector("[data-skyline]");
  const caption = document.querySelector("[data-city-caption]");
  const slider = document.querySelector("[data-city-year-slider]");
  const indicators = document.querySelector("[data-indicators]");
  if (!cardsRoot) return;

  const stats = await App.loadJSON("data/statistics.json");
  const citiesData = await App.loadJSON("data/cities.json");
  const focusCities = citiesData.cities.filter((c) =>
    ["minsk", "brest", "grodno", "vitebsk"].includes(c.id)
  );
  const yearKeys = ["1960", "1980", "2000", "2026"];
  let activeCityId = "minsk";
  let yearIndex = 3;

  cardsRoot.innerHTML = stats.future2026
    .map(
      (card) => `
      <article class="future-card reveal">
        <h3 class="future-card__title">${card.title}</h3>
        <p class="panel__text">${card.text}</p>
        <div style="margin-top:1rem;">${App.statusTag("HYPOTHESIS")}</div>
        ${App.sourceCite(card.source || stats.source)}
      </article>
    `
    )
    .join("");

  if (statsRoot) {
    statsRoot.innerHTML = stats.counters
      .map(
        (item) => `
        <div class="stat-block reveal">
          <div class="stat-block__value" data-count="${item.value}" data-suffix="${item.suffix}">0</div>
          <div class="stat-block__label">${item.label}</div>
        </div>
      `
      )
      .join("");
  }

  if (indicators) {
    indicators.innerHTML = stats.indicators
      .map(
        (item) => `
        <div class="compare reveal" style="margin-bottom:1rem;">
          <div class="compare__side compare__side--history">
            <div class="compare__label">${item.label} · ${I18N.t("future.hist")}</div>
            <p class="compare__text">${item.historical.value}</p>
            <div style="margin-top:0.75rem;">${App.statusTag(item.historical.note)}</div>
            ${App.sourceCite(item.historicalSource || stats.source)}
          </div>
          <div class="compare__side compare__side--alternative">
            <div class="compare__label">${item.label} · ${I18N.t("future.alt")}</div>
            <p class="compare__text">${item.alternative.value}</p>
            <div style="margin-top:0.75rem;">${App.statusTag(item.alternative.note)}</div>
            ${App.sourceCite(item.alternativeSource || stats.source)}
          </div>
        </div>
      `
      )
      .join("");
  }

  function renderYearLabels() {
    const labelsRoot = document.querySelector("[data-city-year-labels]");
    if (!labelsRoot) return;

    labelsRoot.innerHTML = yearKeys
      .map((year, index) => {
        const percent = (index / (yearKeys.length - 1)) * 100;
        const edgeClass =
          index === 0 ? "is-start" : index === yearKeys.length - 1 ? "is-end" : "";
        return `<span class="${edgeClass}" style="left:${percent}%">${year}</span>`;
      })
      .join("");
  }

  function renderTabs() {
    if (!cityTabs) return;
    cityTabs.innerHTML = focusCities
      .map(
        (city) => `
        <button class="city-tab ${city.id === activeCityId ? "is-active" : ""}" type="button" data-future-city="${city.id}">
          ${city.name}
        </button>
      `
      )
      .join("");
  }

  if (cityTabs) {
    cityTabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-future-city]");
      if (!btn) return;
      activeCityId = btn.dataset.futureCity;
      renderTabs();
      renderSkyline();
    });
  }

  function renderSkyline() {
    if (!skyline) return;
    const city = focusCities.find((c) => c.id === activeCityId);
    if (!city) return;
    const year = yearKeys[yearIndex];
    const heights = city.skyline[year] || [];

    skyline.innerHTML = heights
      .map(
        (h, i) => `
        <div class="building" style="height:${h}px; transition-delay:${i * 40}ms;"></div>
      `
      )
      .join("");

    if (caption) {
      const slice = city.timeline[year] || {};
      const text = slice.alternative || I18N.t("future.cityFallback");
      caption.innerHTML = `
        <div class="city-stage__caption-row">
          <span><strong style="color:var(--accent);">${city.name}</strong> · ${year}</span>
          <span>${App.statusTag("HYPOTHESIS")}</span>
        </div>
        <span>${text}</span>
        ${App.sourceCite(slice.alternativeSource || I18N.t("alt.hypothesis"))}
        ${slice.historical ? `<p class="muted" style="margin-top:0.5rem;font-size:0.8rem;"><strong>${I18N.t("future.histBg")}</strong> ${slice.historical}</p>${App.sourceCite(slice.historicalSource || "", { label: I18N.t("cite.bg") })}` : ""}
      `;
    }
  }

  if (slider) {
    slider.min = 0;
    slider.max = yearKeys.length - 1;
    slider.value = yearIndex;
    slider.addEventListener("input", () => {
      yearIndex = Number(slider.value);
      document.querySelectorAll("[data-city-year-label]").forEach((el) => {
        el.textContent = yearKeys[yearIndex];
      });
      renderSkyline();
    });
  }

  document.querySelectorAll("[data-city-year-label]").forEach((el) => {
    el.textContent = yearKeys[yearIndex];
  });

  renderYearLabels();
  renderTabs();
  renderSkyline();

  /* reveal newly injected nodes */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  if (typeof animateCounters === "function") {
    animateCounters();
  }
}

document.addEventListener("DOMContentLoaded", initFuturePage);
