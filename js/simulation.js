async function initSimulationPage() {
  const scene = document.querySelector("[data-sim-scene]");
  const result = document.querySelector("[data-sim-result]");
  const restartBtn = document.querySelector("[data-sim-restart]");
  if (!scene) return;

  const data = await App.loadJSON("data/scenarios.json");
  const saved = localStorage.getItem(App.STORAGE_KEYS.simulation);
  let stepIndex = 0;
  let choicesMade = [];
  let scores = {
    peace: 55,
    economy: 50,
    stability: 52,
    science: 48,
    people: 50
  };

  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      stepIndex = parsed.stepIndex || 0;
      choicesMade = parsed.choicesMade || [];
      scores = parsed.scores || scores;
    } catch (e) {
      /* ignore broken storage */
    }
  }

  function persist() {
    localStorage.setItem(
      App.STORAGE_KEYS.simulation,
      JSON.stringify({ stepIndex, choicesMade, scores })
    );
  }

  function meterLabels() {
    return {
      peace: I18N.t("sim.peace"),
      economy: I18N.t("sim.economy"),
      stability: I18N.t("sim.stability"),
      science: I18N.t("sim.science"),
      people: I18N.t("sim.people")
    };
  }

  function applyEffects(effects) {
    Object.keys(effects).forEach((key) => {
      scores[key] = App.clamp(scores[key] + effects[key], 0, 100);
    });
  }

  function pickEnding() {
    if (scores.peace <= 45) {
      return data.endings.find((e) => e.id === "conflict");
    }
    if (scores.peace >= 70) {
      return data.endings.find((e) => e.id === "diplomacy");
    }
    if (scores.science >= 70) {
      return data.endings.find((e) => e.id === "knowledge");
    }
    return data.endings.find((e) => e.id === "balanced") || data.endings[0];
  }

  function renderResult() {
    const ending = pickEnding();
    if (!ending) return;
    scene.hidden = true;
    if (result) {
      result.classList.add("is-visible");
      result.innerHTML = `
        <p class="eyebrow">${I18N.t("sim.yourWorld")}</p>
        <h2 class="display display--md" style="margin:1rem 0;">${ending.title}</h2>
        <p class="lead" style="margin:0 auto 2rem;">${ending.text}</p>
        <div style="max-width:420px;margin:0 auto;text-align:left;">
          ${Object.entries(scores)
            .map(([key, value]) => {
              const labels = meterLabels();
              return `
                <div class="meter">
                  <div class="meter__label"><span>${labels[key]}</span><span>${Math.round(value)}%</span></div>
                  <div class="meter__track"><div class="meter__fill" style="width:${value}%"></div></div>
                </div>
              `;
            })
            .join("")}
        </div>
        <p class="disclaimer" style="max-width:520px;margin:2rem auto 0;text-align:left;">
          ${I18N.t("sim.disclaimer")}
        </p>
        ${App.sourceCite(data.sourceNote || I18N.t("alt.hypothesis"))}
        <div style="margin-top:2rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <a class="btn btn--primary" href="future.html">${I18N.t("sim.toFuture")}</a>
          <a class="btn btn--ghost" href="sources.html">${I18N.t("sim.toSources")}</a>
        </div>
      `;
    }
  }

  function renderStep() {
    if (stepIndex >= data.steps.length) {
      persist();
      renderResult();
      return;
    }

    scene.hidden = false;
    if (result) result.classList.remove("is-visible");

    const step = data.steps[stepIndex];
    scene.innerHTML = `
      <p class="eyebrow">${step.year} · ${I18N.t("sim.step")} ${stepIndex + 1} ${I18N.t("sim.of")} ${data.steps.length}</p>
      <h2 class="display display--md" style="margin:0.75rem 0 1rem;">${step.title}</h2>
      <p class="body-text">${step.text}</p>
      ${App.sourceCite(data.sourceNote || I18N.t("sim.note"))}
      <div class="sim-choices">
        ${step.choices
          .map(
            (choice) => `
            <button class="choice" type="button" data-choice="${choice.id}">
              <span class="choice__key">${I18N.t("sim.variant")} ${choice.key}</span>
              <div class="choice__title">${choice.title}</div>
              <div class="choice__text">${choice.text}</div>
            </button>
          `
          )
          .join("")}
      </div>
    `;

    scene.querySelectorAll("[data-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = step.choices.find((c) => c.id === btn.dataset.choice);
        if (!choice) return;
        applyEffects(choice.effects);
        choicesMade.push({ step: step.id, choice: choice.id });
        stepIndex += 1;
        persist();
        renderStep();
      });
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      stepIndex = 0;
      choicesMade = [];
      scores = { peace: 55, economy: 50, stability: 52, science: 48, people: 50 };
      persist();
      renderStep();
    });
  }

  renderStep();
}

document.addEventListener("DOMContentLoaded", initSimulationPage);
