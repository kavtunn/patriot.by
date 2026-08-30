function initReveal() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1200;
        const start = performance.now();

        function frame(now) {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(frame);
        }

        requestAnimationFrame(frame);
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

function initFinale() {
  const lines = document.querySelectorAll("[data-finale-line]");
  const headline = document.querySelector("[data-finale-headline]");
  const startBtn = document.querySelector("[data-finale-start]");
  const choices = document.querySelector("[data-finale-choices]");
  if (!lines.length) return;

  let i = 0;
  function showNext() {
    if (i < lines.length) {
      lines[i].classList.add("is-visible");
      i += 1;
      setTimeout(showNext, 1400);
      return;
    }
    if (headline) {
      setTimeout(() => headline.classList.add("is-visible"), 400);
    }
    if (startBtn) {
      setTimeout(() => {
        startBtn.hidden = false;
        startBtn.style.opacity = "1";
      }, 1200);
    }
  }

  setTimeout(showNext, 600);

  if (startBtn && choices) {
    startBtn.style.opacity = "0";
    startBtn.addEventListener("click", () => {
      startBtn.hidden = true;
      choices.classList.add("is-visible");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  animateCounters();
  initFinale();
});

window.animateCounters = animateCounters;
window.initReveal = initReveal;
