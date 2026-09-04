async function initHistoryPage() {
  const root = document.querySelector("[data-history-chain]");
  if (!root) return;

  const data = await App.loadJSON("data/history.json");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function mediaBlock(media) {
    if (!media) return "";
    const hasSrc = Boolean(media.src);
    return `
      <figure class="media-slot ${hasSrc ? "" : "media-slot--empty"}">
        ${
          hasSrc
            ? `<img class="media-slot__img" src="${media.src}" alt="${media.caption || ""}" loading="lazy"
                 onerror="this.closest('.media-slot').classList.add('media-slot--empty'); this.remove();">`
            : ""
        }
        <figcaption class="media-slot__caption">
          <span class="media-slot__label">${media.caption || I18N.t("media.image")}</span>
          <span class="media-slot__credit">${media.credit || ""}</span>
        </figcaption>
      </figure>
    `;
  }

  root.innerHTML = data.items
    .map(
      (item) => `
      <article class="chain__item" data-chain-item>
        <span class="chain__dot" aria-hidden="true"></span>
        <button class="chain__btn" type="button" aria-expanded="false" data-chain-btn="${item.id}">
          <span class="chain__year">${item.year}</span>
          <span class="chain__title">${item.title}</span>
        </button>
        <div class="chain__panel" id="panel-${item.id}">
          <div class="chain__panel-inner">
            <div class="chain__panel-body">
              <div class="panel__meta">${App.statusTag(item.status)}</div>
              <p class="panel__text">${item.description}</p>
              <ul class="chain__stats">
                ${item.stats.map((s) => `<li class="muted">— ${s}</li>`).join("")}
              </ul>
              ${mediaBlock(item.media)}
              ${App.sourceCite(item.source)}
            </div>
          </div>
        </div>
      </article>
    `
    )
    .join("");

  root.querySelectorAll("[data-chain-btn]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.chainBtn;
      const panel = document.getElementById(`panel-${id}`);
      const open = btn.getAttribute("aria-expanded") === "true";

      root.querySelectorAll("[data-chain-btn]").forEach((b) => b.setAttribute("aria-expanded", "false"));
      root.querySelectorAll(".chain__panel").forEach((p) => p.classList.remove("is-open"));

      if (!open && panel) {
        btn.setAttribute("aria-expanded", "true");
        panel.classList.add("is-open");
      }
    });
  });

  function playChainIntro() {
    root.classList.add("is-drawn");

    const items = root.querySelectorAll("[data-chain-item]");
    items.forEach((item, index) => {
      const delay = reduceMotion ? 0 : 80 + index * 70;
      setTimeout(() => {
        item.classList.add("is-visible");
      }, delay);
    });
  }

  if (reduceMotion) {
    playChainIntro();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        playChainIntro();
        observer.disconnect();
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(root);
}

document.addEventListener("DOMContentLoaded", initHistoryPage);
