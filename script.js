// Popup offres du moment
// - s'ouvre au chargement (accueil) si pas désactivé
// - bouton "Ne plus afficher aujourd'hui" (localStorage)

function $(id){ return document.getElementById(id); }

function openOffers(){
  const backdrop = $("offersBackdrop");
  if (!backdrop) return;
  backdrop.style.display = "flex";
}

function closeOffers(){
  const backdrop = $("offersBackdrop");
  if (!backdrop) return;
  backdrop.style.display = "none";
}

function dontShowToday(){
  const key = "bds_offers_hidden_date";
  const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  localStorage.setItem(key, today);
  closeOffers();
}

function shouldShowOffersToday(){
  const key = "bds_offers_hidden_date";
  const today = new Date().toISOString().slice(0,10);
  return localStorage.getItem(key) !== today;
}

// Fermer si clic hors modal
document.addEventListener("click", (e) => {
  const backdrop = $("offersBackdrop");
  const modal = $("offersModal");
  if (!backdrop || !modal) return;
  if (e.target === backdrop) closeOffers();
});

// Ouvrir uniquement sur la page d'accueil
window.addEventListener("DOMContentLoaded", () => {
  const isHome = document.body.dataset.page === "home";
  if (!isHome) return;

  if (shouldShowOffersToday()) {
    openOffers();
  }

  const openBtn = $("openOffersBtn");
  if (openBtn) openBtn.addEventListener("click", openOffers);

  const closeBtn = $("closeOffersBtn");
  if (closeBtn) closeBtn.addEventListener("click", closeOffers);

  const dontBtn = $("dontShowTodayBtn");
  if (dontBtn) dontBtn.addEventListener("click", dontShowToday);
});
