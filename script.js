const storageKey = "chandru_achievements_v1";

const seedAchievements = [
  {
    title: "FinTech Hackathon 2026 - Product Engineer (ATLAS)",
    organization: "Nanyang Technological University",
    date: "2026-03",
    category: "Research",
    impact:
      "Built an AI-powered macro-intelligence web platform that converts global market signals into decision-ready research for analysts and investors.",
    proof: "",
  },
  {
    title: "Satellite Building Workshop - Team Leader",
    organization: "Co-Curricular Technical Workshop",
    date: "2026-03",
    category: "Leadership",
    impact:
      "Led system integration of OBC and EPS modules, developed Arduino/C++ flight software for LoRa telemetry, and simulated VLEO mission profiles using GMAT.",
    proof: "",
  },
  {
    title: "Sustainability Project - Water Reduction in Petrochemical Industry",
    organization: "Nanyang Technological University (CC0006)",
    date: "2025-04",
    category: "Academics",
    impact:
      "Spearheaded a team project focused on reducing industrial water consumption by 25-30% through data-backed sustainability strategies.",
    proof: "",
  },
  {
    title: "Healthcare Analytics Project - Diabetes Indicators (USA)",
    organization: "Nanyang Technological University (BC2406 Analytics 1)",
    date: "2025-04",
    category: "Data Analytics",
    impact:
      "Collaborated on visual and predictive analysis of diabetes health indicators in the United States to identify actionable trends.",
    proof: "",
  },
  {
    title: "CCA Service Distinction",
    organization: "English Debate Society",
    date: "2021-12",
    category: "Community",
    impact:
      "Awarded Distinction in CCA Service (2021) for outstanding contributions while serving as Vice President.",
    proof: "",
  },
  {
    title: "Marketing Strategy Execution for Singtel Campaigns",
    organization: "Innovation Organisation PTE LTD",
    date: "2024-04",
    category: "Professional",
    impact:
      "Developed and executed marketing strategies, collaborating cross-functionally to improve brand visibility and customer engagement outcomes.",
    proof: "",
  },
];

const state = {
  achievements: [],
  activeCategory: "All",
};

const gridEl = document.querySelector("#achievementGrid");
const filtersEl = document.querySelector("#categoryFilters");
const templateEl = document.querySelector("#achievementTemplate");
const totalAchievementsEl = document.querySelector("#totalAchievements");
const totalCategoriesEl = document.querySelector("#totalCategories");
const latestYearEl = document.querySelector("#latestYear");
const dialogEl = document.querySelector("#achievementDialog");
const openFormButtonEl = document.querySelector("#openFormButton");
const closeDialogButtonEl = document.querySelector("#closeDialogButton");
const formEl = document.querySelector("#achievementForm");

function loadAchievements() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return seedAchievements;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return seedAchievements;
    return parsed;
  } catch {
    return seedAchievements;
  }
}

function saveAchievements() {
  localStorage.setItem(storageKey, JSON.stringify(state.achievements));
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
}

function categories() {
  const cats = new Set(state.achievements.map((item) => item.category.trim()).filter(Boolean));
  return ["All", ...Array.from(cats).sort((a, b) => a.localeCompare(b))];
}

function renderFilters() {
  filtersEl.innerHTML = "";
  categories().forEach((category) => {
    const button = document.createElement("button");
    button.className = `chip ${state.activeCategory === category ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      state.activeCategory = category;
      render();
    });
    filtersEl.appendChild(button);
  });
}

function renderKpis() {
  totalAchievementsEl.textContent = String(state.achievements.length);
  totalCategoriesEl.textContent = String(Math.max(categories().length - 1, 0));
  const latest = sortByDateDesc(state.achievements)[0];
  latestYearEl.textContent = latest ? new Date(latest.date).getFullYear() : "-";
}

function formatMonth(value) {
  const date = new Date(`${value}-01`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function renderCards() {
  const rows =
    state.activeCategory === "All"
      ? sortByDateDesc(state.achievements)
      : sortByDateDesc(state.achievements).filter((item) => item.category === state.activeCategory);

  gridEl.innerHTML = "";

  rows.forEach((item) => {
    const node = templateEl.content.firstElementChild.cloneNode(true);
    node.querySelector(".achievement-date").textContent = formatMonth(item.date);
    node.querySelector(".achievement-category").textContent = item.category;
    node.querySelector(".achievement-title").textContent = item.title;
    node.querySelector(".achievement-org").textContent = item.organization;
    node.querySelector(".achievement-impact").textContent = item.impact;

    const proofLink = node.querySelector(".achievement-proof");
    if (item.proof) {
      proofLink.href = item.proof;
    } else {
      proofLink.remove();
    }

    gridEl.appendChild(node);
  });
}

function render() {
  renderFilters();
  renderCards();
  renderKpis();
}

function openDialog() {
  formEl.reset();
  dialogEl.showModal();
}

function closeDialog() {
  dialogEl.close();
}

function initEvents() {
  openFormButtonEl.addEventListener("click", openDialog);
  closeDialogButtonEl.addEventListener("click", closeDialog);

  formEl.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(formEl);
    const record = {
      title: String(formData.get("title") || "").trim(),
      organization: String(formData.get("organization") || "").trim(),
      date: String(formData.get("date") || "").trim(),
      category: String(formData.get("category") || "").trim(),
      impact: String(formData.get("impact") || "").trim(),
      proof: String(formData.get("proof") || "").trim(),
    };

    if (!record.title || !record.organization || !record.date || !record.category || !record.impact) {
      return;
    }

    state.achievements.push(record);
    saveAchievements();
    closeDialog();
    render();
  });
}

function init() {
  state.achievements = loadAchievements();
  initEvents();
  render();
}

init();
