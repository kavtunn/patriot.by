/**
 * Language switcher: be | ru
 *
 * In HTML write both variants:
 *   <span data-lang="be">Па-беларуску</span>
 *   <span data-lang="ru">По-русски</span>
 *
 * Or on one element:
 *   <a data-i18n-be="Пачаць" data-i18n-ru="Начать">Пачаць</a>
 *
 * Title / meta:
 *   <title data-i18n-be="..." data-i18n-ru="...">...</title>
 */
const LANG_KEY = "patriotLang";
const SUPPORTED = ["be", "ru"];
const DEFAULT_LANG = "ru";

const UI = {
  be: {
    "nav.history": "Гісторыя",
    "nav.turning": "Пералом",
    "nav.timeline": "Шкала",
    "nav.people": "Людзі",
    "nav.future": "Будучыня",
    "nav.simulation": "Сімуляцыя",
    "nav.sources": "Крыніцы",
    "nav.aria": "Асноўная навігацыя",
    "nav.menu": "Адкрыць меню",
    "nav.skip": "Перайсці да зместу",
    "nav.close": "Закрыць",
    "logo.brand": "Свет інакш",
    "logo.sub": "· Беларусь",
    "cite.label": "Крыніца",
    "cite.all": "усе крыніцы",
    "cite.bg": "Фон",
    "tag.FACT": "Факт",
    "tag.ANALYSIS": "Аналіз",
    "tag.HYPOTHESIS": "Гіпотэза",
    "filter.ALL": "Усе",
    "filter.FACT": "Факт",
    "filter.ANALYSIS": "Аналіз",
    "filter.HYPOTHESIS": "Гіпотэза",
    "sources.used": "Выкарыстана для:",
    "sources.open": "Адкрыць крыніцу",
    "sources.internal": "Унутраная гіпотэза праекта (без вонкавай спасылкі)",
    "timeline.pick": "Выберы год на шкале часу.",
    "timeline.alt": "Альтэрнатыва",
    "timeline.hist": "Наша гісторыя",
    "timeline.shared": "Агульная лінія",
    "timeline.event": "падзея",
    "timeline.compare.hist": "Наша гісторыя",
    "timeline.compare.fact": "факт / аналіз",
    "timeline.compare.analysis": "аналіз",
    "timeline.compare.alt": "Альтэрнатыва · гіпотэза",
    "timeline.seeSources": "гл. старонку «Крыніцы»",
    "alt.hypothesis": "Альтэрнатыўны сцэнарый праекта (гіпотэза)",
    "people.one": "Адзін чалавек",
    "people.year1": "год",
    "people.year2": "гады",
    "people.year5": "гадоў",
    "people.histLabel": "Наша гісторыя · дакументаваная біяграфія",
    "people.histTitle": "Як склалася насамрэч",
    "people.altLabel": "Альтэрнатыва · гіпотэза",
    "people.altTitle": "Калі вайну ўдалося прадухіліць",
    "people.histAria": "Гістарычная рэальнасць",
    "people.altAria": "Альтэрнатыўная гісторыя",
    "future.hist": "гісторыя",
    "future.alt": "альтэрнатыва",
    "future.cityFallback": "Візуалізацыя гіпатэтычнага аблічча горада.",
    "future.histBg": "Гістарычны фон:",
    "media.image": "Выява",
    "sim.peace": "Індэкс міру",
    "sim.economy": "Эканоміка",
    "sim.stability": "Стабільнасць",
    "sim.science": "Навука",
    "sim.people": "Людзі",
    "sim.yourWorld": "Твой свет",
    "sim.disclaimer": "Гэта гульнявая гіпотэза. Яна не апісвае рэальную гісторыю Беларусі і не з’яўляецца прагнозам.",
    "sim.toFuture": "Глядзець Беларусь-2026",
    "sim.toSources": "Да крыніц",
    "sim.step": "крок",
    "sim.of": "з",
    "sim.variant": "Варыянт",
    "sim.note": "Сімуляцыя — гіпотэза праекта",
    "turning.alt": "Ты адкрыў альтэрнатыўную галіну Беларусі. Далей — шкала часу, людзі і гэтая магчымасць.",
    "turning.hist": "Ты застаешся ў гістарычнай рэальнасці. Параўнай яе з альтэрнатывай на наступных экранах.",
    "load.error": "Не ўдалося загрузіць"
  },
  ru: {
    "nav.history": "История",
    "nav.turning": "Перелом",
    "nav.timeline": "Шкала",
    "nav.people": "Люди",
    "nav.future": "Будущее",
    "nav.simulation": "Симуляция",
    "nav.sources": "Источники",
    "nav.aria": "Основная навигация",
    "nav.menu": "Открыть меню",
    "nav.skip": "Перейти к содержимому",
    "nav.close": "Закрыть",
    "logo.brand": "Мир иначе",
    "logo.sub": "· Беларусь",
    "cite.label": "Источник",
    "cite.all": "все источники",
    "cite.bg": "Фон",
    "tag.FACT": "Факт",
    "tag.ANALYSIS": "Анализ",
    "tag.HYPOTHESIS": "Гипотеза",
    "filter.ALL": "Все",
    "filter.FACT": "Факт",
    "filter.ANALYSIS": "Анализ",
    "filter.HYPOTHESIS": "Гипотеза",
    "sources.used": "Использовано для:",
    "sources.open": "Открыть источник",
    "sources.internal": "Внутренняя гипотеза проекта (без внешней ссылки)",
    "timeline.pick": "Выбери год на шкале времени.",
    "timeline.alt": "Альтернатива",
    "timeline.hist": "Наша история",
    "timeline.shared": "Общая линия",
    "timeline.event": "событие",
    "timeline.compare.hist": "Наша история",
    "timeline.compare.fact": "факт / анализ",
    "timeline.compare.analysis": "анализ",
    "timeline.compare.alt": "Альтернатива · гипотеза",
    "timeline.seeSources": "см. страницу «Источники»",
    "alt.hypothesis": "Альтернативный сценарий проекта (гипотеза)",
    "people.one": "Один человек",
    "people.year1": "год",
    "people.year2": "года",
    "people.year5": "лет",
    "people.histLabel": "Наша история · документированная биография",
    "people.histTitle": "Как сложилось на самом деле",
    "people.altLabel": "Альтернатива · гипотеза",
    "people.altTitle": "Если войну удалось предотвратить",
    "people.histAria": "Историческая реальность",
    "people.altAria": "Альтернативная история",
    "future.hist": "история",
    "future.alt": "альтернатива",
    "future.cityFallback": "Визуализация гипотетического облика города.",
    "future.histBg": "Исторический фон:",
    "media.image": "Изображение",
    "sim.peace": "Индекс мира",
    "sim.economy": "Экономика",
    "sim.stability": "Стабильность",
    "sim.science": "Наука",
    "sim.people": "Люди",
    "sim.yourWorld": "Твой мир",
    "sim.disclaimer": "Это игровая гипотеза. Она не описывает реальную историю Беларуси и не является прогнозом.",
    "sim.toFuture": "Смотреть Беларусь-2026",
    "sim.toSources": "К источникам",
    "sim.step": "шаг",
    "sim.of": "из",
    "sim.variant": "Вариант",
    "sim.note": "Симуляция — гипотеза проекта",
    "turning.alt": "Ты открыл альтернативную ветку Беларуси. Дальше — шкала времени, люди и эта возможность.",
    "turning.hist": "Ты остаёшься в исторической реальности. Сравни её с альтернативой на следующих экранах.",
    "load.error": "Не удалось загрузить"
  }
};

function getLang() {
  const saved = localStorage.getItem(LANG_KEY);
  if (SUPPORTED.includes(saved)) return saved;
  return DEFAULT_LANG;
}

function t(key) {
  const lang = getLang();
  return (UI[lang] && UI[lang][key]) || (UI.be && UI.be[key]) || key;
}

function applyLangAttrs(root = document) {
  const lang = getLang();
  root.querySelectorAll("[data-i18n-be][data-i18n-ru]").forEach((el) => {
    const value = el.getAttribute(`data-i18n-${lang}`);
    if (value == null) return;
    if (el.dataset.i18nHtml === "true") {
      el.innerHTML = value;
    } else {
      el.textContent = value;
    }
  });

  root.querySelectorAll("title[data-i18n-be]").forEach((el) => {
    const value = el.getAttribute(`data-i18n-${lang}`);
    if (value) el.textContent = value;
  });

  root.querySelectorAll("meta[data-i18n-be]").forEach((el) => {
    const value = el.getAttribute(`data-i18n-${lang}`);
    if (value) el.setAttribute("content", value);
  });
}

function yearsWord(n) {
  const abs = Math.abs(Number(n)) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return t("people.year5");
  if (last === 1) return t("people.year1");
  if (last >= 2 && last <= 4) return t("people.year2");
  return t("people.year5");
}

function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  localStorage.setItem(LANG_KEY, lang);
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  applyLangAttrs(document);
  window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

function initI18n() {
  try {
    localStorage.removeItem("siteLang");
  } catch (e) {
    /* ignore */
  }
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  applyLangAttrs(document);
}

window.I18N = { getLang, setLang, t, yearsWord, applyLangAttrs, initI18n, UI, SUPPORTED, LANG_KEY };
