/* =========================================================
   Grille des Adhérents — Style Épuré (Sans filtres ni ombre)
   ========================================================= */

/* Conteneur de la grille */
#membersGrid, 
#cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  padding: 20px 0;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* Carte membre : fond plat, fine bordure, AUCUNE ombre au survol */
.innova-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: none !important; /* Retrait des ombres */
  transition: none !important; /* Retrait de l'effet de mouvement */
}

/* Annulation stricte de tout survol */
.innova-card:hover {
  transform: none !important;
  box-shadow: none !important;
  border-color: #e2e8f0 !important;
}

/* Zone du logo */
.innova-card-logo {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.innova-card-logo img {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
}

/* Titre de la structure */
.innova-card-title {
  color: #2b3a82;
  font-size: 15px;
  font-weight: 800;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

/* Description (si présente) */
.innova-card-description {
  color: #64748b;
  font-size: 12.5px;
  line-height: 1.4;
  margin: 0;
}

/* Masquage définitif des anciens conteneurs de recherche et filtres s'ils existent encore en HTML */
.innova-search-bar,
.innova-filters-container,
.innova-tag,
.badge-category,
.category-tag {
  display: none !important;
}
