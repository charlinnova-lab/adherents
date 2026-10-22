//=========================================================
// Adhérents — innov'a (c) Charlotte Piau
// Création : 28 sept 2026
// Modification : Retrait définitif de la recherche, des filtres et des tags de communauté
//
// IMPORTANT : Le token Airtable n'est PAS présent ici. Il est stocké comme secret dans Cloudflare.
//========================================================= 

const API_URL = "https://adherents.charlottepiau-innova.workers.dev/";

let allRecords = [];

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
    })
    .catch(err => {
      console.error("Erreur :", err);
      container.innerHTML = `<p class="innova-no-results" style="color:#d9534f;">Impossible de charger les adhérents (${err.message})</p>`;
    });
}

function renderCards() {
  const container = document.getElementById("membersGrid") || document.getElementById("cards-container");
  if (!container) return;

  container.innerHTML = "";

  if (allRecords.length === 0) {
    container.innerHTML = "<p class='innova-no-results'>Aucun adhérent à afficher pour le moment.</p>";
    return;
  }

  allRecords.forEach(record => {
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

    const card = document.createElement("div");
    card.className = "innova-card";

    card.innerHTML = `
      <div>
        ${logoUrl ? `<div class="innova-card-logo"><img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(name)}"></div>` : ""}
        <h3 class="innova-card-title">${escapeHtml(name)}</h3>
        ${description ? `<p class="innova-card-description">${escapeHtml(description)}</p>` : ""}
      </div>
    `;

    container.appendChild(card);
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

if (document.readyState === "complete" || document.readyState === "interactive") {
  initAdherents();
} else {
  document.addEventListener("DOMContentLoaded", initAdherents);
}
