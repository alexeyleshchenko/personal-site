(function () {
  const STORAGE_KEY = "l1979-lang";

  const strings = {
    ru: {
      documentTitle: "Алексей Лещенко — l1979.ru",
      brandHtml: 'Алексей<br><span>Лещенко</span>',
      tagline:
        "Редевест — инвестиции в недвижимость. Плюс продукты на стыке IT и AI.",
      contact: "Написать в Telegram",
      sectionRedevestKicker: "01",
      sectionRedevestTitle: "Редевест",
      sectionRedevestLead: "Бизнес и инвестиции в недвижимость.",
      sectionConsumerKicker: "02",
      sectionConsumerTitle: "Продукты",
      sectionConsumerLead: "Сервисы для людей: боты, прокси, платформы.",
      sectionItKicker: "03",
      sectionItTitle: "IT и AI",
      sectionItLead: "Инструменты и API для разработчиков и агентов.",
      openProject: "Открыть",
      footerBrand: "l1979.ru",
      footerNote: "Личный сайт · Алексей Лещенко",
      portraitAlt: "Алексей Лещенко",
      langRu: "RU",
      langEn: "EN",
    },
    en: {
      documentTitle: "Alexey Leshchenko — l1979.ru",
      brandHtml: 'Alexey<br><span>Leshchenko</span>',
      tagline:
        "Redevest real-estate investing, plus IT and AI products I build and run.",
      contact: "Message on Telegram",
      sectionRedevestKicker: "01",
      sectionRedevestTitle: "Redevest",
      sectionRedevestLead: "Business and real-estate investing.",
      sectionConsumerKicker: "02",
      sectionConsumerTitle: "Products",
      sectionConsumerLead: "Consumer-facing services: bots, proxies, platforms.",
      sectionItKicker: "03",
      sectionItTitle: "IT & AI",
      sectionItLead: "Developer tools and APIs for agents and automation.",
      openProject: "Open",
      footerBrand: "l1979.ru",
      footerNote: "Personal site · Alexey Leshchenko",
      portraitAlt: "Alexey Leshchenko",
      langRu: "RU",
      langEn: "EN",
    },
  };

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "ru" || stored === "en") return stored;

    const candidates = [
      ...(navigator.languages || []),
      navigator.language,
      navigator.userLanguage,
    ].filter(Boolean);

    for (const tag of candidates) {
      const lower = String(tag).toLowerCase();
      if (lower.startsWith("ru")) return "ru";
      if (lower.startsWith("en")) return "en";
    }
    return "ru";
  }

  function applyStrings(lang) {
    const t = strings[lang];
    document.documentElement.lang = lang;
    document.title = t.documentTitle;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (key && t[key] != null) el.textContent = t[key];
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (key && t[key] != null) el.innerHTML = t[key];
    });

    const portrait = document.querySelector(".portrait");
    if (portrait && t.portraitAlt) portrait.alt = t.portraitAlt;

    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      const btnLang = btn.getAttribute("data-lang");
      btn.setAttribute("aria-pressed", btnLang === lang ? "true" : "false");
    });

    renderProjects(lang);
  }

  function projectLinks(project, lang, defaultOpenLabel) {
    if (Array.isArray(project.links) && project.links.length) {
      return project.links.map((link) => ({
        url: link.url,
        label: (link.label && (link.label[lang] || link.label.en)) || defaultOpenLabel,
      }));
    }
    if (project.url) {
      const label =
        (project.cta && (project.cta[lang] || project.cta.en)) || defaultOpenLabel;
      return [{ url: project.url, label }];
    }
    return [];
  }

  function cardHtml(project, lang, defaultOpenLabel) {
    const title = project.title[lang] || project.title.en;
    const blurb = project.blurb[lang] || project.blurb.en;
    const links = projectLinks(project, lang, defaultOpenLabel);
    const linksHtml = links.length
      ? `<div class="card-links">${links
          .map(
            (link) =>
              `<a class="card-cta" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label} →</a>`
          )
          .join("")}</div>`
      : "";

    return `
      <article class="card">
        <div class="card-media">
          <img src="${project.image}" alt="" width="640" height="360" loading="lazy" />
        </div>
        <div class="card-body">
          <h3 class="card-title">${title}</h3>
          <p class="card-blurb">${blurb}</p>
          ${linksHtml}
        </div>
      </article>
    `;
  }

  function renderProjects(lang) {
    const projects = window.L1979_PROJECTS || [];
    const openLabel = strings[lang].openProject;
    const bySection = {
      redevest: projects.filter((p) => p.section === "redevest"),
      consumer: projects.filter((p) => p.section === "consumer"),
      it: projects.filter((p) => p.section === "it"),
    };

    Object.entries(bySection).forEach(([section, list]) => {
      const root = document.querySelector(`[data-projects="${section}"]`);
      if (!root) return;
      root.innerHTML = list.map((p) => cardHtml(p, lang, openLabel)).join("");
    });
  }

  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyStrings(lang);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.getAttribute("data-lang");
        if (lang === "ru" || lang === "en") setLang(lang);
      });
    });
    applyStrings(detectLang());
  });
})();
