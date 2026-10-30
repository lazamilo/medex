(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Language ---------- */
  const I18N = window.MEDEX_I18N;
  const prefs = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };
  let lang = prefs.get('medex-lang') === 'en' ? 'en' : 'sl';
  const EN = {};
  $$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] ??= el.innerHTML.trim(); });
  $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(p => { const [a, k] = p.split(':'); EN[k] ??= el.getAttribute(a); }));
  const T = k => (lang === 'sl' && I18N.sl[k]) || EN[k] || k;
  const L = v => (v && typeof v === 'object' && !Array.isArray(v) ? v[lang] : v);
  const ui = () => I18N.ui[lang];
  const locale = () => (lang === 'sl' ? 'sl-SI' : 'en-IE');
  const eur = n => new Intl.NumberFormat(locale(), { style: 'currency', currency: 'EUR' }).format(n);
  const num = (n, d = 0) => n.toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' });

  /* ---------- Data (products and copy from the live medex.si homepage) ---------- */
  const PRODUCTS = [
    { id: 'rjjunior', img: 'assets/real/p5.jpg', price: 14.89,
      name: { en: 'Royal Jelly Junior vials', sl: 'Matični mleček Junior, viale' },
      meta: { en: 'Dietary supplement solution · 10 × 9 ml · 10 days of regular use', sl: 'Prehransko dopolnilo, raztopina · 10 × 9 ml · 10 dni redne uporabe' },
      desc: { en: 'To strengthen resistance and naturally help the immune system. With natural vitamins C and E.', sl: 'Za krepitev odpornosti in naravno pomoč imunskemu sistemu. Z naravnima vitaminoma C in E.' } },
    { id: 'rjcardio', img: 'assets/real/p6.jpg', price: 21.24, was: 24.99, lowest30: 18.74,
      name: { en: 'Royal Jelly Cardio vials', sl: 'Matični mleček Cardio, viale' },
      meta: { en: 'Dietary supplement solution · 10 × 9 ml · 10 days of regular use', sl: 'Prehransko dopolnilo, raztopina · 10 × 9 ml · 10 dni redne uporabe' },
      desc: { en: 'Supports heart function. A unique combination of royal jelly and coenzyme Q10.', sl: 'Podpira delovanje srca. Edinstvena kombinacija matičnega mlečka in koencima Q10.' } },
    { id: 'postbeeotic', img: 'assets/real/p7.png', price: 24.89,
      name: { en: 'Postbeeotic™', sl: 'Postbeeotic™' },
      meta: { en: 'Dietary supplement · 20 × 6.6 g sachets · 20 days of regular use', sl: 'Prehransko dopolnilo · 20 × 6,6 g vrečk · 20 dni redne uporabe' },
      desc: { en: 'Innovative and effective metabolic support. Fermented fruit and vegetables, bifidobacteria, bee pollen, B-complex and vitamin C.', sl: 'Inovativna in učinkovita presnovna podpora. Fermentirano sadje in zelenjava, bifidobakterije, cvetni prah, kompleks B in vitamin C.' } },
    { id: 'mgdirect', img: 'assets/real/p8.jpg', price: 10.49,
      name: { en: 'Magnesium 400 Direct Orange', sl: 'Magnezij 400 Direct, pomaranča' },
      meta: { en: 'Dietary supplement · 20 × 2.2 g sachets · 20 days of regular use', sl: 'Prehransko dopolnilo · 20 × 2,2 g vrečk · 20 dni redne uporabe' },
      desc: { en: '400 mg of magnesium with added vitamins D3, B1 and B6. Great orange taste, taken directly.', sl: '400 mg magnezija z dodanimi vitamini D3, B1 in B6. Odličen okus pomaranče, za neposredno uživanje.' } },
    { id: 'collagen', img: 'assets/real/p1.jpg', price: 29.99,
      name: { en: 'Collagen Flex Curcumin', sl: 'Collagen Flex Curcumin' },
      meta: { en: 'Dietary supplement · 60 capsules · 30 days of regular use', sl: 'Prehransko dopolnilo · 60 kapsul · 30 dni redne uporabe' },
      desc: { en: 'Effective natural support for cartilage and bones, for freedom and pleasure of movement.', sl: 'Učinkovita naravna podpora hrustancu in kostem, za svobodo in užitek gibanja.' } },
    { id: 'beebrown', img: 'assets/real/p2.jpg', price: 12.99,
      name: { en: 'BeeBrown', sl: 'BeeBrown' },
      meta: { en: 'Dietary supplement · 30 × 380 mg capsules · 30 days of regular use', sl: 'Prehransko dopolnilo · 30 × 380 mg kapsul · 30 dni redne uporabe' },
      desc: { en: 'Contributes to healthy, protected and toned skin.', sl: 'Prispeva k zdravi, zaščiteni in negovani koži.' } },
    { id: 'royaljelly', img: 'assets/real/p3.jpg', price: 37.99,
      name: { en: 'Organic Royal Jelly Strong vials', sl: 'Ekološki matični mleček Strong, viale' },
      meta: { en: 'Dietary supplement solution · 10 vials · 10 days of regular use', sl: 'Prehransko dopolnilo, raztopina · 10 vial · 10 dni redne uporabe' },
      desc: { en: 'To naturally strengthen the immune system in adults, with the proven effectiveness of royal jelly.', sl: 'Za naravno krepitev imunskega sistema pri odraslih, z dokazano učinkovitostjo matičnega mlečka.' } },
    { id: 'magnesium', img: 'assets/real/p4.jpg', price: 18.99, isNew: true,
      name: { en: 'Magnesium Hydro with electrolytes', sl: 'Magnezij Hydro z elektroliti' },
      meta: { en: 'Dietary supplement · 14 × 10 g sachets · 14 days of regular use', sl: 'Prehransko dopolnilo · 14 × 10 g vrečk · 14 dni redne uporabe' },
      desc: { en: 'For optimal body hydration. With electrolytes, magnesium and vitamins B1, B6, B12 and C.', sl: 'Za optimalno hidracijo telesa. Z elektroliti, magnezijem ter vitamini B1, B6, B12 in C.' } },
  ];
  const LINES = [
    { name: 'Junior', img: 'assets/real/junior.jpg', href: '#lines', sub: { en: 'For children', sl: 'Za otroke' } },
    { name: 'Gummies', img: 'assets/real/gummies.jpg', href: '#lines', sub: { en: 'Fruit gummies · NEW', sl: 'Sadni bonboni · NOVO' } },
    { name: 'Omega-3 Alga Eye', img: 'assets/real/omega.jpg', href: '#lines', sub: { en: 'Omega-3 from algae', sl: 'Omega-3 iz alg' } },
    { name: 'Omega-3 Marine Vital', img: 'assets/real/omega.jpg', href: '#lines', sub: { en: 'Marine omega-3', sl: 'Morske omega-3' } },
    { name: 'BeeHarmony', img: 'assets/real/beeharmony.jpg', href: '#lines', sub: { en: 'Hormonal balance', sl: 'Hormonsko ravnovesje' } },
    { name: { en: 'Medex honey', sl: 'Med Medex' }, img: 'assets/real/jars.jpg', href: '#honey', sub: { en: 'Tested honey, check by LOT', sl: 'Preverjen med, preverite po LOT' } },
  ];
  const CATS = [
    ['👑', { en: 'Royal jelly', sl: 'Matični mleček' }, { en: 'Immunity', sl: 'Imunost' }],
    ['🌲', { en: 'Propolis', sl: 'Propolis' }, { en: 'Natural defence', sl: 'Naravna zaščita' }],
    ['🍯', { en: 'Honey', sl: 'Med' }, { en: 'Slovenian honey', sl: 'Slovenski med' }],
    ['🧸', { en: 'Junior', sl: 'Junior' }, { en: 'For children', sl: 'Za otroke' }],
    ['🍬', { en: 'Gummies', sl: 'Gummies' }, { en: 'Up to 96% fruit', sl: 'Do 96 % sadja' }],
    ['🐟', { en: 'Omega-3', sl: 'Omega-3' }, { en: 'Heart, brain, eyes', sl: 'Srce, možgani, oči' }],
    ['🌸', { en: "Women's health", sl: 'Zdravje žensk' }, { en: 'BeeHarmony', sl: 'BeeHarmony' }],
    ['✨', { en: 'Beauty & joints', sl: 'Lepota in sklepi' }, { en: 'Collagen, skin', sl: 'Kolagen, koža' }],
    ['💧', { en: 'Hydration', sl: 'Hidracija' }, { en: 'Magnesium, electrolytes', sl: 'Magnezij, elektroliti' }],
    ['🛡️', { en: 'Immunity', sl: 'Imunost' }, { en: 'All year round', sl: 'Skozi vse leto' }],
  ];
  const NEEDS = [
    ['🛡️', { en: 'Immunity', sl: 'Imunost' }], ['⚡', { en: 'Energy & focus', sl: 'Energija in zbranost' }],
    ['🧸', { en: 'Kids', sl: 'Otroci' }], ['🌸', { en: 'Women', sl: 'Ženske' }],
    ['✨', { en: 'Skin & joints', sl: 'Koža in sklepi' }], ['💧', { en: 'Hydration', sl: 'Hidracija' }],
    ['🍯', { en: 'Honey', sl: 'Med' }], ['🌲', { en: 'Propolis', sl: 'Propolis' }],
  ];
  const HIVE = [
    { icon: '🍯', name: { en: 'Honey', sl: 'Med' },
      p: { en: 'Nectar transformed by bees into a natural source of energy.', sl: 'Nektar, ki ga čebele spremenijo v naraven vir energije.' },
      li: { en: ['Natural sugars for quick energy', 'Enzymes and antioxidants', 'Every Medex batch lab-tested'], sl: ['Naravni sladkorji za hitro energijo', 'Encimi in antioksidanti', 'Vsaka serija Medex laboratorijsko preverjena'] } },
    { icon: '🌲', name: { en: 'Propolis', sl: 'Propolis' },
      p: { en: 'Resin that bees collect from tree buds to protect their hive.', sl: 'Smola, ki jo čebele naberejo z drevesnih brstov za zaščito panja.' },
      li: { en: ["The hive's natural shield", 'Rich in polyphenols', 'Standardised in alcohol- and water-based forms'], sl: ['Naravni ščit panja', 'Bogat s polifenoli', 'Standardiziran v alkoholni in vodni obliki'] } },
    { icon: '👑', name: { en: 'Royal jelly', sl: 'Matični mleček' },
      p: { en: 'The exclusive food of the queen bee: the biggest secret of the hive.', sl: 'Izključna hrana matice: največja skrivnost panja.' },
      li: { en: ['Contains the unique fatty acid 10-HDA', 'Standardised for 10-HDA', 'In vials, capsules and syrups'], sl: ['Vsebuje edinstveno maščobno kislino 10-HDA', 'Standardiziran na 10-HDA', 'V vialah, kapsulah in sirupih'] } },
    { icon: '🌼', name: { en: 'Pollen', sl: 'Cvetni prah' },
      p: { en: 'Bees gather pollen as protein-rich food for the colony.', sl: 'Čebele nabirajo cvetni prah kot z beljakovinami bogato hrano za družino.' },
      li: { en: ['Source of protein', 'Vitamins and minerals', 'From flowers across the meadow'], sl: ['Vir beljakovin', 'Vitamini in minerali', 'S cvetov vsega travnika'] } },
    { icon: '🕯️', name: { en: 'Beeswax', sl: 'Čebelji vosek' },
      p: { en: 'The building material of the honeycomb, and a gentle base for skincare.', sl: 'Gradbeni material satja in nežna osnova za nego kože.' },
      li: { en: ['Builds the honeycomb', 'Nourishes and protects skin', 'Used in balms and creams'], sl: ['Gradi satje', 'Neguje in ščiti kožo', 'V balzamih in kremah'] } },
  ];

  /* ---------- Header ---------- */
  const header = $('#header');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    header.classList.toggle('is-hidden', y > lastY && y > 500 && !document.body.classList.contains('lock') && !$('#mega').classList.contains('open'));
    lastY = y;
  }, { passive: true });

  // Mega menu
  const mega = $('#mega'), megaBtn = $('#megaBtn');
  const renderMega = () => {
    $('#megaGrid').innerHTML = CATS.map(([i, n, s]) => `<a href="#bestsellers" class="mega__cat"><i>${i}</i><span>${L(n)}<small>${L(s)}</small></span></a>`).join('');
  };
  const setMega = open => { mega.classList.toggle('open', open); megaBtn.setAttribute('aria-expanded', open); };
  megaBtn.addEventListener('click', e => { e.stopPropagation(); setMega(!mega.classList.contains('open')); });
  if (matchMedia('(hover: hover)').matches) {
    const item = $('.menu__item--mega'); let t;
    item.addEventListener('mouseenter', () => { clearTimeout(t); setMega(true); });
    item.addEventListener('mouseleave', () => { t = setTimeout(() => setMega(false), 180); });
  }
  document.addEventListener('click', e => { if (!e.target.closest('.menu__item--mega')) setMega(false); });
  mega.addEventListener('click', e => { if (e.target.closest('a')) setMega(false); });

  // Live search
  const sInput = $('#searchInput'), sRes = $('#searchResults');
  const index = () => [
    ...PRODUCTS.map(p => ({ name: L(p.name), sub: eur(p.price), img: p.img, href: '#bestsellers' })),
    ...LINES.map(l => ({ name: L(l.name), sub: L(l.sub), img: l.img, href: l.href })),
  ];
  let sFocus = -1;
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const renderSearch = () => {
    const q = sInput.value.trim();
    if (!q) { sRes.hidden = true; return; }
    const re = new RegExp(esc(q), 'i');
    const hits = index().filter(r => re.test(r.name) || re.test(r.sub)).slice(0, 6);
    sFocus = -1;
    sRes.hidden = false;
    sRes.innerHTML = hits.length
      ? hits.map(h => `<a class="sres" href="${h.href}"><img src="${h.img}" alt=""><span><b>${h.name.replace(re, m => `<mark>${m}</mark>`)}</b><small>${h.sub}</small></span><span>→</span></a>`).join('')
      : `<div class="sres__empty">${ui().noResults(q)}</div>`;
  };
  sInput.addEventListener('input', renderSearch);
  sInput.addEventListener('focus', renderSearch);
  sInput.addEventListener('keydown', e => {
    const items = $$('.sres', sRes);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!items.length) return;
      sFocus = (sFocus + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items.forEach((it, i) => it.classList.toggle('is-focus', i === sFocus));
    } else if (e.key === 'Enter' && items[Math.max(0, sFocus)]) { items[Math.max(0, sFocus)].click(); }
    else if (e.key === 'Escape') { sRes.hidden = true; sInput.blur(); }
  });
  sRes.addEventListener('click', e => { if (e.target.closest('.sres')) { sRes.hidden = true; sInput.value = ''; } });
  document.addEventListener('click', e => { if (!e.target.closest('#search')) sRes.hidden = true; });

  /* ---------- Hero slider ---------- */
  const hero = $('#hero'), slides = $$('.slide'), dots = $('#heroDots');
  const DUR = 6500;
  let cur = 0, timer, paused = false;
  dots.innerHTML = slides.map((_, i) => `<button aria-label="${i + 1}"><span></span></button>`).join('');
  const dotEls = $$('button', dots);
  const go = i => {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === cur));
    hero.dataset.theme = slides[cur].dataset.theme;
    dotEls.forEach((d, j) => {
      const bar = d.firstChild;
      d.classList.toggle('is-done', j < cur);
      bar.style.transition = 'none'; bar.style.transform = j < cur ? 'scaleX(1)' : 'scaleX(0)';
    });
    if (!reduced) requestAnimationFrame(() => requestAnimationFrame(() => {
      const bar = dotEls[cur].firstChild;
      bar.style.transition = `transform ${DUR}ms linear`; bar.style.transform = 'scaleX(1)';
    }));
    clearTimeout(timer);
    if (!paused && !reduced) timer = setTimeout(() => go(cur + 1), DUR);
  };
  dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(dotEls.indexOf(b)); });
  $('#heroPrev').onclick = () => go(cur - 1);
  $('#heroNext').onclick = () => go(cur + 1);
  let sx = null;
  hero.addEventListener('pointerdown', e => { sx = e.clientX; });
  hero.addEventListener('pointerup', e => { if (sx !== null && Math.abs(e.clientX - sx) > 50) go(cur + (e.clientX < sx ? 1 : -1)); sx = null; });
  if (!reduced && matchMedia('(hover: hover)').matches) {
    const hexes = $$('.hero__hexes span');
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      hexes.forEach((h, i) => (h.style.translate = `${x * (i + 1) * 10}px ${y * (i + 1) * 10}px`));
    });
  }
  new IntersectionObserver(([e]) => { paused = !e.isIntersecting; if (paused) clearTimeout(timer); else go(cur); }).observe(hero);

  /* ---------- Shop by need ---------- */
  const renderNeeds = () => { $('#needs').innerHTML = NEEDS.map(([i, n]) => `<a href="#bestsellers" class="need"><i>${i}</i>${L(n)}</a>`).join(''); };

  /* ---------- Best-sellers rail ---------- */
  const rail = $('#rail'), qtys = {};
  const renderRail = () => {
    const u = ui();
    rail.innerHTML = PRODUCTS.map(p => `
      <article class="pcard" data-id="${p.id}">
        <div class="pcard__img pcard__img--pack"><img src="${p.img}" alt="${L(p.name)}" loading="lazy" draggable="false">
          ${p.isNew ? `<span class="pcard__badge">${T('badge.new')}</span>` : ''}
          ${p.was ? `<span class="pcard__sale">−${Math.round((1 - p.price / p.was) * 100)}%</span>` : ''}
          <button class="pcard__fav${prefs.get('fav-' + p.id) ? ' on' : ''}" data-fav="${p.id}" aria-label="${u.fav}">${prefs.get('fav-' + p.id) ? '♥' : '♡'}</button>
        </div>
        <h3>${L(p.name)}</h3>
        <p class="pcard__meta">${L(p.meta)}</p>
        <p class="pcard__desc">${L(p.desc)}</p>
        <div class="pcard__buy">
          <div class="qty"><button data-step="-1" aria-label="${u.dec}">−</button><span>${qtys[p.id] || 1}</span><button data-step="1" aria-label="${u.inc}">+</button></div>
          <span class="pcard__prices">
            <span class="pcard__price${p.was ? ' pcard__price--sale' : ''}">${eur(p.price)}</span>
            ${p.was ? `<s>${eur(p.was)}</s>` : ''}
          </span>
        </div>
        ${p.lowest30 ? `<p class="pcard__lowest">${u.lowest30} ${eur(p.lowest30)}</p>` : ''}
        <button class="btn btn--yellow pcard__add" data-add="${p.id}">${u.addToCart}</button>
      </article>`).join('');
  };
  rail.addEventListener('click', e => {
    const card = e.target.closest('.pcard'); if (!card) return;
    const id = card.dataset.id;
    const step = e.target.closest('[data-step]');
    if (step) { qtys[id] = Math.max(1, Math.min(20, (qtys[id] || 1) + +step.dataset.step)); $('.qty span', card).textContent = qtys[id]; }
    const fav = e.target.closest('[data-fav]');
    if (fav) { const on = !fav.classList.contains('on'); fav.classList.toggle('on', on); fav.textContent = on ? '♥' : '♡'; prefs.set('fav-' + id, on ? '1' : ''); }
    if (e.target.closest('[data-add]')) addToCart(id, qtys[id] || 1, $('img', card));
  });
  const railStep = () => (rail.querySelector('.pcard')?.offsetWidth || 300) + 18;
  $('#bsPrev').onclick = () => rail.scrollBy({ left: -railStep(), behavior: 'smooth' });
  $('#bsNext').onclick = () => rail.scrollBy({ left: railStep(), behavior: 'smooth' });
  const railBar = $('#railBar');
  const updateRail = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    const vis = rail.clientWidth / rail.scrollWidth;
    railBar.style.width = Math.min(100, vis * 100) + '%';
    railBar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * (1 / vis - 1) * 100 : 0}%)`;
    $('.rail__progress').style.visibility = max > 4 ? 'visible' : 'hidden';
  };
  rail.addEventListener('scroll', updateRail, { passive: true });
  addEventListener('resize', updateRail);
  // drag to scroll (mouse)
  let drag = null;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.target.closest('button')) return; drag = { x: e.clientX, s: rail.scrollLeft, moved: false }; });
  addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - drag.x; if (Math.abs(dx) > 4) { drag.moved = true; rail.classList.add('dragging'); } rail.scrollLeft = drag.s - dx; });
  addEventListener('pointerup', () => { if (!drag) return; rail.classList.remove('dragging'); drag = null; });

  /* ---------- Cart ---------- */
  let cart = (() => { try { return JSON.parse(prefs.get('medex-v2-cart') || '{}'); } catch { return {}; } })();
  const byId = id => PRODUCTS.find(p => p.id === id);
  const cartEl = $('#cart'), scrim = $('#scrim');
  const openCart = () => { cartEl.classList.add('open'); scrim.classList.add('open'); cartEl.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); };
  const closeCart = () => { cartEl.classList.remove('open'); scrim.classList.remove('open'); cartEl.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); };
  $('#cartBtn').onclick = openCart; $('#cartClose').onclick = closeCart; scrim.onclick = closeCart;
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); setMega(false); } });
  const renderCart = () => {
    const u = ui(), ids = Object.keys(cart).filter(byId);
    $('#cartCount').textContent = ids.reduce((s, id) => s + cart[id], 0);
    $('#cartTotal').textContent = eur(ids.reduce((s, id) => s + cart[id] * byId(id).price, 0));
    $('#cartItems').innerHTML = ids.length ? ids.map(id => {
      const p = byId(id);
      return `<li class="citem"><img src="${p.img}" alt=""><div><b>${L(p.name)}</b><small>${eur(p.price)}</small></div>
        <div class="qty"><button data-q="-1" data-id="${id}" aria-label="${u.dec}">−</button><span>${cart[id]}</span><button data-q="1" data-id="${id}" aria-label="${u.inc}">+</button></div></li>`;
    }).join('') : `<li class="cart__empty">${u.cartEmpty}</li>`;
    prefs.set('medex-v2-cart', JSON.stringify(cart));
  };
  $('#cartItems').addEventListener('click', e => {
    const b = e.target.closest('[data-q]'); if (!b) return;
    cart[b.dataset.id] = (cart[b.dataset.id] || 0) + +b.dataset.q;
    if (cart[b.dataset.id] <= 0) delete cart[b.dataset.id];
    renderCart();
  });
  const toast = $('#toast'); let toastT;
  const showToast = msg => { toast.textContent = msg; toast.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('show'), 2400); };
  function addToCart(id, qty, imgEl) {
    cart[id] = (cart[id] || 0) + qty;
    renderCart();
    header.classList.remove('is-hidden');
    const cnt = $('#cartCount'); cnt.classList.remove('bump'); void cnt.offsetWidth; cnt.classList.add('bump');
    showToast(ui().added(L(byId(id).name), qty));
    if (imgEl && !reduced) {
      const a = imgEl.getBoundingClientRect(), b = $('#cartBtn').getBoundingClientRect();
      const f = document.createElement('img'); f.src = imgEl.src; f.className = 'fly'; document.body.append(f);
      const sx = a.left + a.width / 2 - 27, sy = a.top + a.height / 2 - 27, ex = b.left + b.width / 2 - 27, ey = b.top + b.height / 2 - 27;
      f.style.left = f.style.top = '0';
      f.animate([
        { transform: `translate(${sx}px, ${sy}px) scale(1.6)`, opacity: 1 },
        { transform: `translate(${(sx + ex) / 2}px, ${Math.min(sy, ey) - 140}px) scale(1) rotate(-12deg)`, offset: .55 },
        { transform: `translate(${ex}px, ${ey}px) scale(.25)`, opacity: .4 },
      ], { duration: 850, easing: 'cubic-bezier(.5,0,.4,1)' }).onfinish = () => f.remove();
    }
  }

  /* ---------- Stats + flying bee ---------- */
  const fmtStat = (el, v) => num(v) + (el.dataset.unit ? `<small>${ui().million}+</small>` : '') + (el.dataset.suffix || '');
  const cio = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    const tick = t => { const p = Math.min(1, (t - t0) / dur); el.innerHTML = fmtStat(el, Math.round(end * (1 - Math.pow(1 - p, 4)))); if (p < 1) requestAnimationFrame(tick); else el.dataset.done = ''; };
    requestAnimationFrame(tick); cio.unobserve(el);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));
  const stats = $('#stats'), path = $('#beePath'), bee = $('#statsBee');
  const flyBee = () => {
    const r = stats.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    const len = path.getTotalLength(), pt = path.getPointAtLength(p * len), pt2 = path.getPointAtLength(Math.min(len, p * len + 2));
    const sx = r.width / 1200, sy = r.height / 160;
    const ang = Math.atan2((pt2.y - pt.y) * sy, (pt2.x - pt.x) * sx) * 180 / Math.PI;
    bee.style.transform = `translate(${pt.x * sx - 20}px, ${pt.y * sy - 15}px) rotate(${ang}deg)`;
  };
  if (!reduced) { addEventListener('scroll', flyBee, { passive: true }); addEventListener('resize', flyBee); }
  flyBee();

  /* ---------- Why Medex: scroll-driven rows ---------- */
  const vrows = $$('.vrow');
  const setRow = i => {
    vrows.forEach((r, j) => r.classList.toggle('is-on', j === i));
  };
  // the active row is the one level with the centre of the sticky intro on the left
  // (or the middle of the screen when the intro isn't sticky, e.g. on phones)
  const whyIntro = $('.why__intro');
  let whyCur = -1;
  const whyLine = () => {
    if (getComputedStyle(whyIntro).position !== 'sticky') return innerHeight / 2;
    const ir = whyIntro.getBoundingClientRect();
    return ir.top + ir.height / 2;
  };
  const syncWhy = () => {
    const line = whyLine();
    let idx = 0;
    vrows.forEach((r, i) => { if (r.getBoundingClientRect().top <= line) idx = i; });
    if (idx !== whyCur) { whyCur = idx; setRow(idx); }
  };
  addEventListener('scroll', syncWhy, { passive: true });
  addEventListener('resize', syncWhy);
  syncWhy();
  vrows.forEach(r => r.addEventListener('click', () => {
    scrollTo({ top: scrollY + r.getBoundingClientRect().top - whyLine() + Math.min(40, r.offsetHeight / 3), behavior: reduced ? 'auto' : 'smooth' });
  }));

  /* ---------- Brand film ---------- */
  const FILM_ID = '4c1tCydBcW4', FILM_START = 11;
  const film = $('#film'), filmFrame = $('#filmFrame');
  $('#filmPlay').addEventListener('click', () => {
    if (filmFrame.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${FILM_ID}?autoplay=1&start=${FILM_START}&rel=0&modestbranding=1&playsinline=1&hl=${lang}&cc_lang_pref=${lang}`;
    f.title = 'Powered by bees, proven by science. | Medex';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    filmFrame.append(f);
    filmFrame.classList.add('is-playing'); film.classList.add('is-playing');
    filmFrame.style.removeProperty('--inset');
  });
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reduced) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: filmFrame, start: 'top 95%', end: 'center 55%', scrub: .5,
      onUpdate: self => {
        if (filmFrame.classList.contains('is-playing')) return;
        filmFrame.style.setProperty('--inset', `${(1 - self.progress) * 9}%`);
        filmFrame.style.setProperty('--zoom', 1.18 - self.progress * .18);
      },
    });
    if (matchMedia('(hover: hover)').matches) {
      const chips = $$('.film__chip');
      $('#filmStage').addEventListener('pointermove', e => {
        const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        chips.forEach(ch => (ch.style.transform = `translate(${x * 30 * ch.dataset.depth}px, ${y * 30 * ch.dataset.depth}px)`));
      });
    }
  }

  /* ---------- LOT check (concept demo) ---------- */
  const cells = $$('#lotCells input');
  cells.forEach((inp, i) => {
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(-1); if (inp.value && cells[i + 1]) cells[i + 1].focus(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Backspace' && !inp.value && cells[i - 1]) cells[i - 1].focus(); });
    inp.addEventListener('paste', e => {
      const d = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 5); if (!d) return;
      e.preventDefault(); [...d].forEach((c, j) => { if (cells[j]) cells[j].value = c; }); cells[Math.min(4, d.length)].focus();
    });
  });
  $('#lotDemo').onclick = () => { [...'24817'].forEach((c, j) => (cells[j].value = c)); $('#lotForm').requestSubmit(); };
  const REGIONS = ['Gorenjska', 'Štajerska', 'Dolenjska', 'Koroška', 'Notranjska', 'Prekmurje', 'Goriška'];
  let lastLot = null;
  const renderLot = (code, animate) => {
    let seed = +code; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    const u = ui(), honey = u.honeys[Math.floor(rnd() * u.honeys.length)], region = REGIONS[Math.floor(rnd() * REGIONS.length)], year = 2024 + Math.floor(rnd() * 3);
    const rows = [[u.moist, 15.6 + rnd() * 2.4, 20, u.pct], ['HMF', 2 + rnd() * 10, 40, ' mg/kg'], [u.diastase, 12 + rnd() * 14, 30, '']];
    const res = $('#lotResult'); res.hidden = false; res.style.animation = animate ? '' : 'none';
    res.innerHTML = `<h3>${honey} · ${region}, ${year}</h3><span class="ok">${u.lotOk} · LOT ${code}</span>
      <div class="lot__bars">${rows.map(([n, v, max, unit]) => `<div class="lot__bar"><span>${n}</span><div><span data-w="${(v / max) * 100}%" style="width:${animate ? 0 : (v / max) * 100}%"></span></div><b>${num(v, 1)}${unit === ' mg/kg' ? '' : unit}</b></div>`).join('')}</div>
      <p class="lot__note">${u.lotNote}</p>`;
    if (animate) requestAnimationFrame(() => setTimeout(() => $$('[data-w]', res).forEach(s => (s.style.width = s.dataset.w)), 60));
  };
  $('#lotForm').addEventListener('submit', e => {
    e.preventDefault();
    const code = cells.map(c => c.value).join('');
    if (code.length < 5) { const w = $('#lotCells'); w.classList.remove('shake'); void w.offsetWidth; w.classList.add('shake'); cells.find(c => !c.value).focus(); return; }
    lastLot = code; renderLot(code, true);
  });

  /* ---------- Hive explorer ---------- */
  let hiveCur = 2;
  const renderHive = animate => {
    $('#hiveCells').innerHTML = HIVE.map((h, i) => `<button class="hcell${i === hiveCur ? ' is-on' : ''}" data-i="${i}"><i>${h.icon}</i>${L(h.name)}</button>`).join('');
    const h = HIVE[hiveCur], panel = $('#hivePanel');
    panel.classList.remove('swap'); if (animate) { void panel.offsetWidth; panel.classList.add('swap'); }
    panel.innerHTML = `<h3>${h.icon} ${L(h.name)}</h3><p>${L(h.p)}</p><ul>${L(h.li).map(x => `<li>${x}</li>`).join('')}</ul>`;
  };
  $('#hiveCells').addEventListener('click', e => { const b = e.target.closest('.hcell'); if (b) { hiveCur = +b.dataset.i; renderHive(true); } });
  $('#hiveCells').addEventListener('mouseover', e => { const b = e.target.closest('.hcell'); if (b && +b.dataset.i !== hiveCur && matchMedia('(hover: hover)').matches) { hiveCur = +b.dataset.i; renderHive(true); } });

  /* ---------- Newsletter ---------- */
  $('#nlForm').addEventListener('submit', e => { e.preventDefault(); $('#nlOk').hidden = false; $('#nlEmail').value = ''; });
  const nlCard = $('#nlCard');
  if (!reduced && matchMedia('(hover: hover)').matches) {
    nlCard.addEventListener('pointermove', e => { const r = nlCard.getBoundingClientRect(); nlCard.style.transform = `perspective(900px) rotateY(${((e.clientX - r.left) / r.width - .5) * 10}deg) rotateX(${-((e.clientY - r.top) / r.height - .5) * 10}deg)`; });
    nlCard.addEventListener('pointerleave', () => (nlCard.style.transform = ''));
  }

  /* ---------- Reveal ---------- */
  $$('.head, .pcard, .tile, .stat, .why__text, .honey__card, .hive, .nl__text, .nl__card').forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -30px 0px' });
  const observeReveal = () => $$('.reveal:not(.in)').forEach(el => io.observe(el));

  /* ---------- Render / language ---------- */
  const applyStatic = () => {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { if (el.tagName === 'TITLE') document.title = T(el.dataset.i18n); else el.innerHTML = T(el.dataset.i18n); });
    $$('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(p => { const [a, k] = p.split(':'); el.setAttribute(a, T(k)); }));
    $$('#lang [data-lang]').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    $('#lang').dataset.active = lang;
  };
  const render = () => {
    applyStatic(); renderMega(); renderNeeds(); renderRail(); renderCart(); renderHive(false);
    $$('[data-count][data-done]').forEach(el => (el.innerHTML = fmtStat(el, +el.dataset.count)));
    if (lastLot) renderLot(lastLot, false);
    if (!sRes.hidden) renderSearch();
    $$('.pcard').forEach(el => el.classList.add('reveal', 'in'));
    updateRail();
  };
  $('#lang').addEventListener('click', e => { const b = e.target.closest('[data-lang]'); if (b && b.dataset.lang !== lang) { lang = b.dataset.lang; prefs.set('medex-lang', lang); render(); } });

  render();
  $$('.pcard').forEach(el => el.classList.remove('in'));
  observeReveal();
  go(0);
})();
