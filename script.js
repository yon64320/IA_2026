// Site piloté par JSON (site.json)
// - Remplit le contenu des pages en fonction de body[data-page]
// - Garde la popup "Offres du moment" + option "Ne plus afficher aujourd'hui"

function $(id){ return document.getElementById(id); }

// ---------- Data loader ----------
let __siteDataPromise = null;
async function loadSiteData(){
  if (!__siteDataPromise) {
    __siteDataPromise = fetch('./site.json', { cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`Impossible de charger site.json (${r.status})`);
        return r.json();
      });
  }
  return __siteDataPromise;
}

// ---------- Helpers ----------
function setText(id, value){
  const el = $(id);
  if (!el) return;
  el.textContent = value ?? '';
}

function setHTML(id, html){
  const el = $(id);
  if (!el) return;
  el.innerHTML = html ?? '';
}

function escapeHtml(str){
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ---------- Common (header/footer) ----------
function applyCommon(data){
  const site = data.site;
  if (!site) return;

  // Header
  setText('siteNameHeader', site.name);
  setText('siteAddressHeader', site.address);

  // Footer (si les IDs existent sur la page)
  // On laisse les textes "par défaut" si tu veux les personnaliser page par page.
  const line1 = $('footerLine1');
  const line2 = $('footerLine2');

  if (line1 && line1.textContent.trim().length === 0) {
    line1.textContent = `${site.copyright}`;
  }
  if (line2 && line2.textContent.trim().length === 0) {
    line2.textContent = `${site.hours} • ${site.phone} • ${site.email}`;
  }
}

// ---------- Home ----------
function renderGridCards(containerId, cards){
  const container = $(containerId);
  if (!container) return;
  container.innerHTML = '';

  for (const c of (cards || [])) {
    const article = document.createElement('article');
    article.className = 'item';
    article.innerHTML = `
      <h3>${escapeHtml(c.title ?? '')}</h3>
      <p>${escapeHtml(c.text ?? '')}</p>
      ${c.badge ? `<span class="badge">${escapeHtml(c.badge)}</span>` : ''}
    `.trim();
    container.appendChild(article);
  }
}

function applyHome(data){
  const home = data.home;
  const site = data.site;
  if (!home || !site) return;

  document.title = home.pageTitle || document.title;

  setText('homeHeroTitle', home.hero?.title);
  setText('homeHeroText', home.hero?.text);

  setText('homeHours', site.hours);
  setText('homeContact', `${site.phone} • ${site.email}`);

  setText('homeKvTag', home.kv?.tag);
  setText('homeKvMeta', home.kv?.meta);

  setText('homeOffersTitle', home.offersSection?.title);
  setText('homeOffersSubtitle', home.offersSection?.subtitle);
  renderGridCards('homeOffersGrid', home.offersSection?.cards);

  setText('homeFeaturedTitle', home.featuredSection?.title);
  setText('homeFeaturedSubtitle', home.featuredSection?.subtitle);
  renderGridCards('homeFeaturedGrid', home.featuredSection?.cards);

  // Footer home (si présent)
  setText('footerLine1', `${site.copyright} — ${site.address}`);
  setText('footerLine2', `${site.hours.replace(' — ', '–')} • ${site.phone} • ${site.email}`);

  // Modal offers
  setText('offersModalTitle', home.offersModal?.title);
  setText('offersModalSubtitle', home.offersModal?.subtitle);
  setText('offersOkBtn', home.offersModal?.okLabel || 'OK');
  setText('dontShowTodayBtn', home.offersModal?.dontShowLabel || 'Ne plus afficher aujourd’hui');
  setText('closeOffersBtn', home.offersModal?.closeLabel || 'Fermer');
  setText('offersTip', home.offersModal?.tip);

  const list = $('offersModalList');
  if (list) {
    list.innerHTML = '';
    for (const it of (home.offersModal?.items || [])) {
      const li = document.createElement('li');
      const strong = it.strong ? `<strong>${escapeHtml(it.strong)}</strong>` : '';
      const rest = it.text ? ` — ${escapeHtml(it.text)}` : '';
      li.innerHTML = `${strong}${rest}`;
      list.appendChild(li);
    }
  }
}

// ---------- Produits ----------
function applyProduits(data){
  const products = data.products;
  if (!products) return;

  document.title = products.pageTitle || document.title;

  setText('productsTitle', products.title);
  setText('productsIntro', products.intro);

  const root = $('productsSections');
  if (!root) return;
  root.innerHTML = '';

  for (const cat of (products.categories || [])) {
    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = `<h2>${escapeHtml(cat.title || '')}</h2><p>${escapeHtml(cat.subtitle || '')}</p>`;

    const list = document.createElement('div');
    list.className = 'list';

    for (const item of (cat.items || [])) {
      const row = document.createElement('div');
      row.className = 'row';

      const price = (item.price ?? '—');
      row.innerHTML = `
        <div class="left">
          <div class="name">${escapeHtml(item.name || '')}</div>
          <div class="desc">${escapeHtml(item.desc || '')}</div>
        </div>
        <div class="price">${escapeHtml(price)}</div>
      `.trim();

      list.appendChild(row);
    }

    root.appendChild(sectionTitle);
    root.appendChild(list);
  }
}

// ---------- À propos ----------
function applyAPropos(data){
  const about = data.about;
  if (!about) return;

  document.title = about.pageTitle || document.title;

  setText('aboutTitle', about.title);
  setText('aboutIntro', about.intro);

  renderGridCards('aboutCards', about.cards);

  setText('aboutCommitmentsTitle', about.commitments?.title || 'Engagements');

  const ul = $('aboutCommitments');
  if (ul) {
    ul.innerHTML = '';
    for (const liText of (about.commitments?.items || [])) {
      const li = document.createElement('li');
      li.textContent = liText;
      ul.appendChild(li);
    }
  }
}

// ---------- Contact ----------
function applyContact(data){
  const contact = data.contact;
  const site = data.site;
  if (!contact || !site) return;

  document.title = contact.pageTitle || document.title;

  setText('contactTitle', contact.title);
  setText('contactIntro', contact.intro);

  // Cards
  const cards = (contact.cards || []).map(c => {
    // On autorise des tokens simples
    const mapped = { ...c };
    if (mapped.text === '$ADDRESS') mapped.text = site.address;
    if (mapped.text === '$HOURS') mapped.text = `Ouvert tous les jours\n${site.hours}`;
    if (mapped.text === '$CONTACT') mapped.text = `${site.phone}\n${site.email}`;
    return mapped;
  });

  const container = $('contactCards');
  if (container) {
    container.innerHTML = '';
    for (const c of cards) {
      const article = document.createElement('article');
      article.className = 'item';
      const textLines = String(c.text ?? '').split('\n').map(escapeHtml).join('<br>');
      article.innerHTML = `
        <h3>${escapeHtml(c.title ?? '')}</h3>
        <p>${textLines}</p>
        ${c.badge ? `<span class="badge">${escapeHtml(c.badge)}</span>` : ''}
      `.trim();
      container.appendChild(article);
    }
  }

  setText('contactPlanTitle', contact.plan?.title);
  setText('contactPlanText', contact.plan?.text);
}

// ---------- Popup offres du moment ----------
function openOffers(){
  const backdrop = $('offersBackdrop');
  if (!backdrop) return;
  backdrop.style.display = 'flex';
}

function closeOffers(){
  const backdrop = $('offersBackdrop');
  if (!backdrop) return;
  backdrop.style.display = 'none';
}

function dontShowToday(){
  const key = 'bds_offers_hidden_date';
  const today = new Date().toISOString().slice(0,10); // YYYY-MM-DD
  localStorage.setItem(key, today);
  closeOffers();
}

function shouldShowOffersToday(){
  const key = 'bds_offers_hidden_date';
  const today = new Date().toISOString().slice(0,10);
  return localStorage.getItem(key) !== today;
}

// Fermer si clic hors modal
document.addEventListener('click', (e) => {
  const backdrop = $('offersBackdrop');
  const modal = $('offersModal');
  if (!backdrop || !modal) return;
  if (e.target === backdrop) closeOffers();
});

// ---------- Bootstrap ----------
window.addEventListener('DOMContentLoaded', async () => {
  let data;
  try {
    data = await loadSiteData();
  } catch (err) {
    console.error(err);
    return;
  }

  applyCommon(data);

  const page = document.body?.dataset?.page;
  if (page === 'home') {
    applyHome(data);

    // Open modal logic
    if (shouldShowOffersToday()) openOffers();

    const openBtn = $('openOffersBtn');
    if (openBtn) openBtn.addEventListener('click', openOffers);

    const closeBtn = $('closeOffersBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeOffers);

    const dontBtn = $('dontShowTodayBtn');
    if (dontBtn) dontBtn.addEventListener('click', dontShowToday);

  } else if (page === 'produits') {
    applyProduits(data);
  } else if (page === 'apropos') {
    applyAPropos(data);
  } else if (page === 'contact') {
    applyContact(data);
  }
});
