// URL de votre Worker Cloudflare reliant Airtable
//# =========================================================
//Adhérents
//   innov'a (c) Charlotte Piau
//   Création :28 sept 2026
//   Last Modification : retrait des flèches dans le style.css

//   IMPORTANT : Le token Airtable n'est PAS présent ici. Il est stocké comme secret dans Cloudflare.
//========================================================= 
const API_URL = "https://adherents.charlottepiau-innova.workers.dev/";

let allRecords = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchAdherents();
  setupEventListeners();
});

async function fetchAdherents() {
  const container = document.getElementById("cards-container");
  container.innerHTML = "<p class='loading'>Chargement des adhérents...</p>";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur lors de la récupération des données");

    const data = await response.json();
    allRecords = data.records || [];

    setupFilters(allRecords);
    renderCards(allRecords);
  } catch (error) {
    console.error("Erreur:", error);
    container.innerHTML = "<p class='error'>Impossible de charger les adhérents pour le moment.</p>";
  }
}

// Génère les boutons de filtres dynamiquement basés sur "🤝Communauté pour site web"
function setupFilters(records) {
  const filterContainer = document.getElementById("filter-buttons");
  if (!filterContainer) return;

  const categories = new Set();

  records.forEach((record) => {
    const community = record.fields["🤝Communauté pour site web"];
    if (community) {
      if (Array.isArray(community)) {
        community.forEach((c) => categories.add(c));
      } else {
        categories.add(community);
      }
    }
  });

  // Reconstruit la barre de filtres
  filterContainer.innerHTML = `<button class="filter-btn active" data-category="all">Tous</button>`;

  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.category = cat;
    btn.textContent = cat;
    filterContainer.appendChild(btn);
  });

  // Écoute des clics sur les boutons de filtre
  filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterContainer.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      filterAndSearch();
    });
  });
}

function renderCards(records) {
  const container = document.getElementById("cards-container");
  container.innerHTML = "";

  if (records.length === 0) {
    container.innerHTML = "<p class='no-results'>Aucun adhérent ne correspond à votre recherche.</p>";
    return;
  }

  records.forEach((record) => {
    const fields = record.fields;

    // Récupération des champs Airtable
    const name = fields["Nom"] || fields["Nom de la structure"] || "Sans nom";
    const logoUrl = fields["Logo"] && fields["Logo"][0] ? fields["Logo"][0].url : "";
    const description = fields["Description"] || fields["Présentation"] || "";
    
    // Récupération de la communauté / catégorie
    const communityRaw = fields["🤝Communauté pour site web"];
    const community = Array.isArray(communityRaw) ? communityRaw.join(", ") : communityRaw || "";

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      ${logoUrl ? `<div class="card-logo"><img src="${logoUrl}" alt="${name}"></div>` : ""}
      <div class="card-content">
        ${community ? `<span class="badge">${community}</span>` : ""}
        <h3 class="card-title">${name}</h3>
        ${description ? `<p class="card-description">${description}</p>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

function filterAndSearch() {
  const searchInput = document.getElementById("search-input");
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const activeBtn = document.querySelector(".filter-btn.active");
  const activeCategory = activeBtn ? activeBtn.dataset.category : "all";

  const filtered = allRecords.filter((record) => {
    const fields = record.fields;
    const name = (fields["Nom"] || fields["Nom de la structure"] || "").toLowerCase();
    const description = (fields["Description"] || fields["Présentation"] || "").toLowerCase();

    // Vérification du filtre catégorie
    const communityRaw = fields["🤝Communauté pour site web"];
    let matchesCategory = false;

    if (activeCategory === "all") {
      matchesCategory = true;
    } else if (Array.isArray(communityRaw)) {
      matchesCategory = communityRaw.includes(activeCategory);
    } else if (communityRaw) {
      matchesCategory = communityRaw === activeCategory;
    }

    // Vérification de la recherche textuelle
    const matchesSearch = name.includes(searchTerm) || description.includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  renderCards(filtered);
}

function setupEventListeners() {
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", filterAndSearch);
  }
}

    chargerAdherents();
});
