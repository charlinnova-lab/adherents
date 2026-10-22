//=========================================================
// Adhérents — innov'a (c) Charlotte Piau
// Création : 28 sept 2026
// Modification : Retrait de la recherche et des filtres par catégorie
//
// IMPORTANT : Le token Airtable n'est PAS présent ici. Il est stocké comme secret dans Cloudflare.
//========================================================= 

//=========================================================
// Adhérents — innov'a 
//========================================================= 
const API_URL = "https://adherents.charlottepiau-innova.workers.dev/";

let allRecords = [];
let currentCategory = "all";
let currentSearch = "";

function initAdherents() {
  const container = document.getElementById("membersGrid") || document.getElementById("cards-container");
  if (!container) return;

  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error("Erreur réseau HTTP " + res.status);
      return res.json();
    })
    .then(data => {
      allRecords = data.records || [];
      renderCards();
      setupEventListeners();
    })
    .catch(err => {
      console.error("Erreur :", err);
      container.innerHTML = `<p class="innova-no-results" style="color:#d9534f;">Impossible de charger les adhérents (${err.message})</p>`;
    });
}

function renderCards() {
  const container = document.getElementById("membersGrid") || document.getElementById("cards-container");
  if (!container) return;

  // Filtrage combiné : Recherche + Catégorie
  const filtered = allRecords.filter(record => {
    const fields = record.fields || {};
    
    // Récupération de la raison sociale
    const name = (fields["Structure | Raison Sociale"] || fields["Nom"] || fields["Nom de la structure"] || "").toLowerCase();
    const description = (fields["Description"] || fields["Présentation"] || "").toLowerCase();
    
    // Communauté / Catégorie
    const communityRaw = fields["🤝Communauté pour site web"] || fields["Communauté"] || "";
    const communityArray = Array.isArray(communityRaw) ? communityRaw : [communityRaw];

    // Check Catégorie
    const matchesCategory = (currentCategory === "all") || communityArray.includes(currentCategory);
    
    // Check Recherche
    const matchesSearch = name.includes(currentSearch) || description.includes(currentSearch);

    return matchesCategory && matchesSearch;
  });

  container.innerHTML = "";

  if (filtered.length === 0) {
    container.innerHTML = "<p class='innova-no-results'>Aucun adhérent ne correspond à votre recherche.</p>";
    return;
  }

  filtered.forEach(record => {
    const fields = record.fields || {};

    // Priorité à "Structure | Raison Sociale"
    const name = fields["Structure | Raison Sociale"] || fields["Nom"] || fields["Nom de la structure"] || "Structure sans nom";

    // Récupération du Logo
    let logoUrl = "";
    if (Array.isArray(fields["Logo"]) && fields["Logo"].length > 0) {
      logoUrl = fields["Logo"][0].url || fields["Logo"][0].thumbnails?.large?.url || "";
    } else if (typeof fields["Logo"] === "string") {
      logoUrl = fields["Logo"];
    }

    const description = fields["Description"] || fields["Présentation"] || "";
    const communityRaw = fields["🤝Communauté pour site web"] || fields["Communauté"] || "";
    const community = Array.isArray(communityRaw) ? communityRaw.join(", ") : communityRaw;

    const card = document.createElement("div");
    card.className = "innova-card";

    card.innerHTML = `
      <div>
        ${logoUrl ? `<div class="innova-card-logo"><img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(name)}"></div>` : ""}
        ${community ? `<span class="innova-badge">${escapeHtml(community)}</span>` : ""}
        <h3 class="innova-card-title">${escapeHtml(name)}</h3>
        ${description ? `<p class="innova-card-description">${escapeHtml(description)}</p>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

function setupEventListeners() {
  // Écouteur Barre de recherche
  const searchInput = document.getElementById("directorySearch");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value.toLowerCase().trim();
      renderCards();
    });
  }

  // Écouteur Boutons de filtres
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      currentCategory = e.target.dataset.category;
      renderCards();
    });
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  initAdherents();
} else {
  document.addEventListener("DOMContentLoaded", initAdherents);
}
