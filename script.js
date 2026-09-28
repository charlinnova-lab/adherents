// URL de votre Worker Cloudflare reliant Airtable
//=========================================================
// Adhérents — innov'a (c) Charlotte Piau
// Création : 28 sept 2026
// Modification : Retrait de la recherche et des filtres par catégorie
//
// IMPORTANT : Le token Airtable n'est PAS présent ici. Il est stocké comme secret dans Cloudflare.
//========================================================= 
const API_URL = "https://adherents.charlottepiau-innova.workers.dev/";

let allRecords = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchAdherents();
});

async function fetchAdherents() {
  const container = document.getElementById("cards-container");
  if (!container) return;

  container.innerHTML = "<p class='loading'>Chargement des adhérents...</p>";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Erreur lors de la récupération des données");

    const data = await response.json();
    allRecords = data.records || [];

    renderCards(allRecords);
  } catch (error) {
    console.error("Erreur:", error);
    container.innerHTML = "<p class='error'>Impossible de charger les adhérents pour le moment.</p>";
  }
}

function renderCards(records) {
  const container = document.getElementById("cards-container");
  if (!container) return;

  container.innerHTML = "";

  if (records.length === 0) {
    container.innerHTML = "<p class='no-results'>Aucun adhérent à afficher pour le moment.</p>";
    return;
  }

  records.forEach((record) => {
    const fields = record.fields;

    // Récupération des champs Airtable
    const name = fields["Nom"] || fields["Nom de la structure"] || "Sans nom";
    const logoUrl = fields["Logo"] && fields["Logo"][0] ? fields["Logo"][0].url : "";
    const description = fields["Description"] || fields["Présentation"] || "";
    
    // Récupération de la communauté / catégorie pour le badge
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
