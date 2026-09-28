//=========================================================
// Adhérents — innov'a (c) Charlotte Piau
// Création : 28 sept 2026
// Modification : Retrait de la recherche et des filtres par catégorie
//
// IMPORTANT : Le token Airtable n'est PAS présent ici. Il est stocké comme secret dans Cloudflare.
//========================================================= 

const API_URL = "https://adherents.charlottepiau-innova.workers.dev/";

let allRecords = [];

// Exécution robuste quel que soit le mode d'injection du script
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchAdherents);
} else {
  fetchAdherents();
}

async function fetchAdherents() {
  // Détection automatique pour compatibilité avec #membersGrid OU #cards-container
  const container = document.getElementById("membersGrid") || document.getElementById("cards-container");
  
  if (!container) {
    console.error("Erreur : Aucun conteneur (#membersGrid ou #cards-container) n'a été trouvé dans le HTML.");
    return;
  }

  container.innerHTML = "<p class='innova-loading-text'>Chargement des adhérents...</p>";

  try {
    console.log("Appel du Worker Cloudflare :", API_URL);
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Données récupérées d'Airtable :", data);

    allRecords = data.records || [];
    renderCards(allRecords, container);
  } catch (error) {
    console.error("Erreur de récupération :", error);
    container.innerHTML = `
      <p class='innova-error-text'>
        Impossible de charger les adhérents pour le moment.<br>
        <small style="font-weight: normal; font-size: 12px; color: #888;">(${error.message})</small>
      </p>
    `;
  }
}

function renderCards(records, container) {
  if (!container) return;
  container.innerHTML = "";

  if (!records || records.length === 0) {
    container.innerHTML = "<p class='innova-no-results'>Aucun adhérent à afficher pour le moment.</p>";
    return;
  }

  records.forEach((record) => {
    const fields = record.fields || {};

    // 1. Nom
    const name = fields["Nom"] || fields["Nom de la structure"] || "Sans nom";
    
    // 2. Logo (Gère les formats d'attachements Airtable)
    let logoUrl = "";
    if (Array.isArray(fields["Logo"]) && fields["Logo"].length > 0) {
      logoUrl = fields["Logo"][0].url || fields["Logo"][0].thumbnails?.large?.url || "";
    } else if (typeof fields["Logo"] === "string") {
      logoUrl = fields["Logo"];
    }

    // 3. Description
    const description = fields["Description"] || fields["Présentation"] || "";
    
    // 4. Communauté / Badge
    const communityRaw = fields["🤝Communauté pour site web"] || fields["Communauté"] || "";
    const community = Array.isArray(communityRaw) ? communityRaw.join(", ") : communityRaw;

    // Création de la carte HTML
    const card = document.createElement("div");
    card.className = "innova-card";

    card.innerHTML = `
      ${logoUrl ? `<div class="innova-card-logo"><img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(name)}"></div>` : ""}
      <div class="innova-card-content">
        ${community ? `<span class="innova-badge">${escapeHtml(community)}</span>` : ""}
        <h3 class="innova-card-title">${escapeHtml(name)}</h3>
        ${description ? `<p class="innova-card-description">${escapeHtml(description)}</p>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

// Fonction de sécurisation HTML (Anti-XSS)
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
