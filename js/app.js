const STORAGE_KEYS = {
  reality: "selectedReality",
  scenario: "selectedScenario",
  year: "currentYear",
  simulation: "simulationProgress"
};

const AppState = {
  reality: localStorage.getItem(STORAGE_KEYS.reality) || "historical",
  year: Number(localStorage.getItem(STORAGE_KEYS.year)) || 1941
};

const CACHE_VER = "1";

function saveState() {
  localStorage.setItem(STORAGE_KEYS.reality, AppState.reality);
  localStorage.setItem(STORAGE_KEYS.year, String(AppState.year));
}

function setReality(reality) {
  AppState.reality = reality;
  saveState();
  document.documentElement.dataset.reality = reality;
  updateRealityUI();
}

function setYear(year) {
  AppState.year = Number(year);
  saveState();
  updateYearUI();
}

function updateRealityUI() {
  document.querySelectorAll("[data-reality]").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.reality === AppState.reality);
  });
}

function updateYearUI() {
  document.querySelectorAll("[data-year-display]").forEach((el) => {
    el.textContent = AppState.year;
  });
}

function langPath(path) {
  const lang = window.I18N ? I18N.getLang() : "ru";
  if (path.startsWith("data/") && !path.startsWith("data/be/") && !path.startsWith("data/ru/")) {
    return path.replace(/^data\//, `data/${lang}/`);
  }
  return path;
}

async function loadJSON(path) {
  const localized = langPath(path);
  const url = localized.includes("?")
    ? `${localized}&v=${CACHE_VER}`
    : `${localized}?v=${CACHE_VER}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${I18N.t("load.error")} ${localized}`);
  }
  return response.json();
}

function statusTag(status) {
  const map = {
    FACT: "tag--fact",
    ANALYSIS: "tag--analysis",
    HYPOTHESIS: "tag--hypothesis"
  };
  const label = I18N.t(`tag.${status}`) || status;
  return `<span class="tag ${map[status] || ""}">${label}</span>`;
}

function sourceCite(text, options = {}) {
  if (!text) return "";
  const href = options.href || "sources.html";
  const label = options.label || I18N.t("cite.label");
  return `<p class="source-cite"><span class="source-cite__label">${label}:</span> ${text} · <a href="${href}">${I18N.t("cite.all")}</a></p>`;
}

function getPageId() {
  const file = location.pathname.split("/").pop() || "index.html";
  if (file === "" || file === "/") return "index";
  return file.replace(".html", "");
}

const JOURNEY = [
  "index",
  "history",
  "turning-point",
  "timeline",
  "people",
  "future",
  "simulation",
  "sources"
];

function updateJourneyProgress() {
  const bar = document.querySelector("[data-journey-bar]");
  if (!bar) return;
  const index = JOURNEY.indexOf(getPageId());
  const progress = index < 0 ? 0 : ((index + 1) / JOURNEY.length) * 100;
  bar.style.transform = `scaleX(${progress / 100})`;
}

function navLinks() {
  return [
    { href: "history.html", id: "history", key: "nav.history" },
    { href: "turning-point.html", id: "turning-point", key: "nav.turning" },
    { href: "timeline.html", id: "timeline", key: "nav.timeline" },
    { href: "people.html", id: "people", key: "nav.people" },
    { href: "future.html", id: "future", key: "nav.future" },
    { href: "simulation.html", id: "simulation", key: "nav.simulation" },
    { href: "sources.html", id: "sources", key: "nav.sources" }
  ];
}

function mountChrome() {
  const mount = document.querySelector("[data-app-chrome]");
  if (!mount) return;

  const pageId = getPageId();
  const lang = I18N.getLang();
  const links = navLinks()
    .map(
      (link) =>
        `<a class="nav__link" data-nav href="${link.href}">${I18N.t(link.key)}</a>`
    )
    .join("");
  const drawerLinks = navLinks()
    .map((link) => `<a data-nav href="${link.href}">${I18N.t(link.key)}</a>`)
    .join("");

  mount.innerHTML = `
    <a class="skip-link" href="#main">${I18N.t("nav.skip")}</a>
    <header class="site-header">
      <div class="site-header__inner">
        <a class="logo" href="index.html">${I18N.t("logo.brand")} <span>${I18N.t("logo.sub")}</span></a>
        <nav class="nav" aria-label="${I18N.t("nav.aria")}">
          <div class="nav__links">${links}</div>
          <div class="nav__actions">
            <div class="lang-switch" role="group" aria-label="Language">
              <button class="lang-switch__btn ${lang === "be" ? "is-active" : ""}" type="button" data-set-lang="be">БЕЛ</button>
              <button class="lang-switch__btn ${lang === "ru" ? "is-active" : ""}" type="button" data-set-lang="ru">РУС</button>
            </div>
            <button class="menu-btn" type="button" data-menu-toggle aria-expanded="false" aria-label="${I18N.t("nav.menu")}">
              <span class="menu-btn__lines" aria-hidden="true"><span></span><span></span><span></span></span>
            </button>
          </div>
        </nav>
      </div>
    </header>
    <div class="nav-drawer" data-nav-drawer>${drawerLinks}</div>
    <div class="grain" aria-hidden="true"></div>
    <div class="journey-progress" aria-hidden="true"><div class="journey-progress__bar" data-journey-bar></div></div>
    <div class="modal" data-modal aria-hidden="true" role="dialog" aria-modal="true">
      <div class="modal__dialog">
        <button class="modal__close" type="button" data-modal-close aria-label="${I18N.t("nav.close")}">×</button>
        <div data-modal-body></div>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const id = href.replace(".html", "");
    if (id === pageId) link.classList.add("is-active");
  });

  mount.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.setLang;
      if (next === I18N.getLang()) return;
      I18N.setLang(next);
      location.reload();
    });
  });
}

function bindLangSwitch(root = document) {
  root.querySelectorAll("[data-set-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.dataset.setLang;
      if (next === I18N.getLang()) return;
      I18N.setLang(next);
      location.reload();
    });
  });
}

function initNavigation() {
  mountChrome();
  bindLangSwitch(document);

  const menuBtn = document.querySelector("[data-menu-toggle]");
  const drawer = document.querySelector("[data-nav-drawer]");
  if (menuBtn && drawer) {
    menuBtn.addEventListener("click", () => {
      const open = drawer.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });
  }

  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => {
        header.classList.toggle("is-scrolled", window.scrollY > 20);
      },
      { passive: true }
    );
  }
}

function initRealitySwitch() {
  document.querySelectorAll("[data-reality]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setReality(btn.dataset.reality);
      window.dispatchEvent(new CustomEvent("realitychange", { detail: AppState.reality }));
    });
  });
  updateRealityUI();
}

function openModal(contentHtml) {
  const modal = document.querySelector("[data-modal]");
  const body = document.querySelector("[data-modal-body]");
  if (!modal || !body) return;
  body.innerHTML = contentHtml;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function initModal() {
  const modal = document.querySelector("[data-modal]");
  if (!modal) return;
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-modal-close]")) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

document.addEventListener("DOMContentLoaded", () => {
  I18N.initI18n();
  document.documentElement.dataset.reality = AppState.reality;
  initNavigation();
  initRealitySwitch();
  initModal();
  updateYearUI();
  updateJourneyProgress();
});

window.App = {
  AppState,
  STORAGE_KEYS,
  loadJSON,
  statusTag,
  sourceCite,
  setReality,
  setYear,
  openModal,
  closeModal,
  clamp,
  getPageId,
  saveState
};
