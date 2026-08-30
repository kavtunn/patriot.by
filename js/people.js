async function initPeoplePage() {
  const root = document.querySelector("[data-people-root]");
  const tabs = document.querySelector("[data-people-tabs]");
  if (!root) return;

  const data = await App.loadJSON("data/people.json");
  if (!data.people || !data.people.length) return;

  let activeId = data.people[0].id;

  function renderTabs() {
    if (!tabs) return;
    tabs.innerHTML = data.people
      .map(
        (person) => `
        <button class="city-tab ${person.id === activeId ? "is-active" : ""}" type="button" data-person-tab="${person.id}">
          ${person.name} · ${person.city}
        </button>
      `
      )
      .join("");
  }

  if (tabs) {
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-person-tab]");
      if (!btn) return;
      activeId = btn.dataset.personTab;
      renderTabs();
      renderPerson();
    });
  }

  function lifeEvents(list) {
    return list
      .map(
        (item) => `
        <div class="life-event">
          <div class="life-event__year">${item.year}</div>
          <div class="life-event__text">${item.text}</div>
        </div>
      `
      )
      .join("");
  }

  function renderPerson() {
    const person = data.people.find((p) => p.id === activeId);
    if (!person) return;

    root.innerHTML = `
      <div class="person-hero reveal is-visible">
        <div class="person-portrait">
          <div class="person-portrait__silhouette" aria-hidden="true"></div>
          <div>
            <p class="eyebrow">${person.portraitLabel}</p>
            <p style="margin-top:0.5rem;font-size:0.85rem;color:var(--text-muted);">${person.note}</p>
          </div>
        </div>
        <div>
          <p class="eyebrow">${I18N.t("people.one")}</p>
          <h1 class="display display--lg" style="margin:0.5rem 0 1rem;">${person.name}</h1>
          <p class="lead">${person.age} ${I18N.yearsWord(person.age)} · ${person.city} · ${person.year}</p>
          <p class="body-text" style="margin-top:1.25rem;">${person.intro}</p>
          <div style="margin-top:1.25rem;">${App.statusTag(person.status || "FACT")}</div>
          <p class="muted" style="margin-top:0.75rem;font-size:0.85rem;">${person.role}</p>
        </div>
      </div>

      <div class="person-dual reveal is-visible">
        <section class="life-path life-path--history" aria-label="${I18N.t("people.histAria")}">
          <p class="compare__label" style="color:var(--history);">${I18N.t("people.histLabel")}</p>
          <h2 class="panel__title">${I18N.t("people.histTitle")}</h2>
          <div style="margin-bottom:0.75rem;">${App.statusTag("FACT")}</div>
          ${lifeEvents(person.historical)}
          ${App.sourceCite(data.historicalSource || "Exeler (2022); Archives of Belarus; belarus.by")}
        </section>
        <section class="life-path life-path--alternative" aria-label="${I18N.t("people.altAria")}">
          <p class="compare__label" style="color:var(--alternative);">${I18N.t("people.altLabel")}</p>
          <h2 class="panel__title">${I18N.t("people.altTitle")}</h2>
          <div style="margin-bottom:0.75rem;">${App.statusTag("HYPOTHESIS")}</div>
          ${lifeEvents(person.alternative)}
          ${App.sourceCite(data.alternativeSource || I18N.t("alt.hypothesis"))}
        </section>
      </div>

      <p class="disclaimer" style="margin-top:2rem;">${data.disclaimer || person.note}</p>

      <p class="quote-block reveal is-visible" style="margin-top:2rem;text-align:center;">${person.closing}</p>
    `;
  }

  renderTabs();
  renderPerson();
}

document.addEventListener("DOMContentLoaded", initPeoplePage);
