// URL de votre Worker Cloudflare reliant Airtable
const API_URL = "https://portaitsexpo.charlottepiau-innova.workers.dev";

let allAdherents = [];

async function chargerAdherents() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = `<div class="loading">Chargement des adhérents…</div>`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`Erreur : ${response.status}`);

        const data = await response.json();
        allAdherents = data.records || (Array.isArray(data) ? data : []);

        filtrerEtAfficher();
    } catch (error) {
        console.error("Erreur lors du chargement :", error);
        gallery.innerHTML = `
            <div class="error" style="text-align:center; padding: 30px; color: #dc2626;">
                Impossible de charger la liste des adhérents.<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function getImageUrl(fields) {
    const visuel = fields["Visuel"] || fields["Logo"] || fields["Photo"];
    if (Array.isArray(visuel) && visuel.length > 0) {
        return visuel[0]?.thumbnails?.large?.url || visuel[0]?.url || "";
    }
    return "";
}

function filtrerEtAfficher() {
    const searchInput = document.getElementById("searchInput");
    const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const activeBtn = document.querySelector(".filter-btn.active");
    const selectedCat = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

    const filtres = allAdherents.filter(record => {
        const fields = record.fields || record;
        const name = String(fields["Structure"] || fields["Nom"] || "").toLowerCase();
        let cat = fields["Category"] || fields["Catégorie"] || fields["Type"] || "";
        if (Array.isArray(cat)) cat = cat.join(" ");
        cat = String(cat).toLowerCase();

        const matchSearch = !searchVal || name.includes(searchVal) || cat.includes(searchVal);
        let matchCat = false;

        if (selectedCat === "all") {
            matchCat = true;
        } else {
            matchCat = cat.includes(selectedCat.toLowerCase());
        }

        return matchSearch && matchCat;
    });

    afficherCartes(filtres);
}

function afficherCartes(records) {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";

    if (records.length === 0) {
        gallery.innerHTML = `<div class="error" style="text-align:center; padding: 40px; color: #64748b;">Aucun adhérent ne correspond à votre recherche.</div>`;
        return;
    }

    records.forEach(record => {
        const fields = record.fields || record;
        const name = fields["Structure"] || fields["Nom"] || "Adhérent";
        
        let catRaw = fields["Category"] || fields["Catégorie"] || fields["Type"] || "Adhérent";
        if (Array.isArray(catRaw)) catRaw = catRaw[0] || "Adhérent";
        
        const imageUrl = getImageUrl(fields);

        const catLower = String(catRaw).toLowerCase();
        let badgeClass = "badge-autre";
        if (catLower.includes("incubateur")) badgeClass = "badge-incubateur";
        else if (catLower.includes("territoriale")) badgeClass = "badge-territoriale";
        else if (catLower.includes("écologie") || catLower.includes("durable")) badgeClass = "badge-ecologie";
        else if (catLower.includes("numérique") || catLower.includes("conseil")) badgeClass = "badge-numerique";

        const card = document.createElement("article");
        card.className = "portrait-card";
        
        card.innerHTML = `
            <div class="portrait-image-wrapper">
                ${imageUrl ? `<img class="portrait-image" src="${imageUrl}" alt="${name}" loading="lazy">` : `<div style="font-weight:700; color:#555;">${name}</div>`}
            </div>
            <div class="portrait-content">
                <h2 class="portrait-title">${name}</h2>
                <span class="chapter-badge ${badgeClass}">${catRaw}</span>
                <span class="card-arrow">↗</span>
            </div>
        `;

        gallery.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) searchInput.addEventListener("input", filtrerEtAfficher);

    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterButtons.forEach(b => b.classList.remove("active"));
            e.currentTarget.classList.add("active");
            filtrerEtAfficher();
        });
    });

    chargerAdherents();
});
