// URL de votre Worker Cloudflare reliant Airtable
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

// Exécution sécurisée quel que soit l'état de chargement du DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", fetchAdherents);
} else {
  fetchAdherents();
}

async function fetchAdherents() {
  const container = document.getElementById("membersGrid");
  if (!container) {
    console.error("Erreur : L'élément #membersGrid est introuvable dans le HTML.");
    return;
  }

  container.innerHTML = "<p class='innova-loading-text'>Chargement des adhérents...</p>";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

    const data = await response.json();
    console.log("Données reçues d'Airtable :", data);

    allRecords = data.records || [];
    renderCards(allRecords);
  } catch (error) {
    console.error("Erreur de chargement :", error);
    container.innerHTML = "<p class='innova-error-text'>Impossible de charger les adhérents pour le moment.</p>";
  }
}

function renderCards(records) {
  const container = document.getElementById("membersGrid");
  if (!container) return;

  container.innerHTML = "";

  if (!records || records.length === 0) {
    container.innerHTML = "<p class='innova-no-results'>Aucun adhérent à afficher pour le moment.</p>";
    return;
  }

  records.forEach((record) => {
    const fields = record.fields || {};

    // Nom de l'adhérent / structure
    const name = fields["Nom"] || fields["Nom de la structure"] || "Sans nom";
    
    // Logo
    let logoUrl = "";
    if (Array.isArray(fields["Logo"]) && fields["Logo"].length > 0) {
      logoUrl = fields["Logo"][0].url || "";
    } else if (typeof fields["Logo"] === "string") {
      logoUrl = fields["Logo"];
    }

    // Description / Présentation
    const description = fields["Description"] || fields["Présentation"] || "";
    
    // Communauté / Catégorie (Badge)
    const communityRaw = fields["🤝Communauté pour site web"] || fields["Communauté"] || "";
    const community = Array.isArray(communityRaw) ? communityRaw.join(", ") : communityRaw;

    // Création de la carte
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

// Fonction utilitaire de sécurité contre les failles XSS
function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
