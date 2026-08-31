function initTurningPoint() {
  const historyBtn = document.querySelector("[data-choose-history]");
  const altBtn = document.querySelector("[data-choose-alternative]");
  const note = document.querySelector("[data-choice-note]");
  if (!historyBtn || !altBtn) return;

  function choose(reality) {
    App.setReality(reality);
    localStorage.setItem(App.STORAGE_KEYS.scenario, reality);
    if (note) {
      note.hidden = false;
      note.textContent =
        reality === "alternative" ? I18N.t("turning.alt") : I18N.t("turning.hist");
    }
    setTimeout(() => {
      window.location.href = "timeline.html";
    }, 900);
  }

  historyBtn.addEventListener("click", () => choose("historical"));
  altBtn.addEventListener("click", () => choose("alternative"));
}

document.addEventListener("DOMContentLoaded", initTurningPoint);
