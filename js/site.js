/* =====================================================================
   JAYSCOS Global (English) — renders every page from data/site.js (edited in /admin/),
   using the shop skin markup (css/jayscos.css + js/jayscos.js). No prices, cart, member or search.
   ===================================================================== */
(function () {
  var qs = new URLSearchParams(location.search);
  var PAGE = document.body.getAttribute('data-page');
  var ICO = {
    arrow: '<svg class="ico" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg class="ico" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>',
    prev: '<svg class="ico" viewBox="0 0 24 24"><path d="m15 6-6 6 6 6"/></svg>',
    next: '<svg class="ico" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
    menu: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    insta: '<svg class="ico" viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r=".9" fill="currentColor" stroke="none"/></svg>',
    blog: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v7a3.5 3.5 0 0 1-3.5 3.5H12l-3.6 3.2c-.5.4-1.2.1-1.2-.6V18A3.5 3.5 0 0 1 4 14.5z"/><path d="M9.5 9h2.6c1.2 0 1.9.6 1.9 1.4 0 .6-.3 1-.8 1.2.7.2 1.1.7 1.1 1.4 0 1-.8 1.7-2.1 1.7H9.5z"/></svg>',
    mail: '<svg class="ico" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>',
    up: '<svg class="ico" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6"/></svg>',
    down: '<svg class="ico" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    link: '<svg class="ico" viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
    shield: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.5 8.5 8 9.5 4.5-1 8-4.5 8-9.5V7z"/><path d="m9 12 2 2 4-4"/></svg>',
    drop: '<svg class="ico" viewBox="0 0 24 24"><path d="M12 3c3 4 6 7.5 6 11a6 6 0 0 1-12 0c0-3.5 3-7 6-11z"/></svg>',
    flag: '<svg class="ico" viewBox="0 0 24 24"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>'
  };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function br(s) { return esc(s).replace(/\n/g, '<br>'); }
  function $(s, el) { return (el || document).querySelector(s); }
  function vis(D) { return (D.products || []).filter(function (p) { return p.visible !== false; }); }
  function catName(D, id) { var c = (D.categories || []).filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; }
  function plink(p) { return 'product.html?id=' + encodeURIComponent(p.id); }
  function byId(D, id) { return (D.products || []).filter(function (p) { return p.id === id; })[0]; }
  function paras(a, cls) { return (a || []).map(function (p) { return '<p' + (cls ? ' class="' + cls + '"' : '') + '>' + esc(p) + '</p>'; }).join(''); }
  function link(u) { return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener">' + esc(u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')) + '</a>' : ''; }
  function ld(o) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(o); document.head.appendChild(s); }
  function abs(u) { return new URL(u, location.href).href; }
  function org(D) {
    var c = D.company;
    return { '@type': 'Organization', '@id': abs('index.html') + '#org', name: c.name, alternateName: [c.nameLocal, 'JAYSCOS'], slogan: c.corporateSlogan, url: abs('index.html'), logo: abs('img/logo.png'),
      email: c.email, telephone: c.phone, faxNumber: c.fax, foundingDate: '2025-06', address: { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'KR' },
      brand: { '@type': 'Brand', name: c.productBrand, slogan: c.productSlogan }, sameAs: [c.instagram, c.blog, c.smartstore].filter(Boolean) };
  }

  /* ---------- data (published, or draft preview from the admin) ---------- */
  function load(cb) {
    try { if (qs.get('draft') === '1') sessionStorage.setItem('jz_dm', '1'); if (qs.get('draft') === '0') sessionStorage.removeItem('jz_dm'); } catch (e) {}
    var dm = false; try { dm = sessionStorage.getItem('jz_dm') === '1'; } catch (e) {}
    if (dm) {
      try { var d = JSON.parse(localStorage.getItem('jz_draft') || 'null'); if (d) { document.body.insertAdjacentHTML('beforeend', '<div class="draft-bar">Draft preview (not published)</div>'); return cb(d); } } catch (e) {}
    }
    var s = document.createElement('script');
    s.src = 'data/site.js?t=' + Date.now();
    s.onload = function () { cb(window.SITE_DATA); };
    document.head.appendChild(s);
  }

  /* ---------- header / drawer / footer ---------- */
  var COMPANY = [['about.html', 'About Us', 'about'], ['history.html', 'History', 'history'], ['certifications.html', 'Certifications & Patents', 'certs']];
  function catLink(id) { return 'products.html?cat=' + encodeURIComponent(id); }
  function header(D) {
    var cur = PAGE === 'product' ? (curProduct(D) || {}).category : PAGE === 'products' ? qs.get('cat') : null;
    var on = function (k) { return (PAGE === k || cur === k) ? ' class="on"' : ''; };
    var compOn = COMPANY.some(function (c) { return c[2] === PAGE; }) ? ' class="on"' : '';
    var cats = D.categories || [];
    var top = (D.home.topbar || []).map(function (t, i) { return (i ? '<span class="dot pc-only-inline">·</span><span class="pc-only-inline">' : '<span class="it"><em>EXPORT</em>') + esc(t) + '</span>'; }).join('');
    $('#hd').innerHTML =
      '<div class="topbar">' + top + '</div>' +
      '<header class="header" id="header"><div class="container inner">' +
      '<div class="left"><button type="button" class="iconbtn menu" data-open-drawer aria-label="Open menu">' + ICO.menu + '</button>' +
      '<div class="logo"><a href="index.html" aria-label="JAYSCOS home"><img src="img/logo.png" alt="JAYSCOS" width="149" height="24"></a></div></div>' +
      '<nav class="gnb-wrap" aria-label="Main menu"><ul class="gnb">' +
      '<li class="has-sub"><a href="about.html"' + compOn + '>Company</a><div class="sub">' + COMPANY.map(function (c) { return '<a href="' + c[0] + '"' + (PAGE === c[2] ? ' class="on"' : '') + '>' + c[1] + '</a>'; }).join('') + '</div></li>' +
      cats.map(function (c) { return '<li><a href="' + catLink(c.id) + '"' + on(c.id) + '>' + esc(c.name) + '</a></li>'; }).join('') +
      '<li><a href="brand.html"' + on('brand') + '>Brand</a></li><li><a href="faq.html"' + on('faq') + '>FAQ</a></li>' +
      '<li><a href="contact.html" class="cta' + (PAGE === 'contact' ? ' on' : '') + '">Contact Us</a></li></ul></nav>' +
      '<div class="right"></div></div></header>' +
      '<div class="drawer" id="drawer" aria-hidden="true"><div class="dim" data-close-drawer></div><div class="panel">' +
      '<div class="head"><strong>Menu</strong><button type="button" class="iconbtn close" data-close-drawer aria-label="Close">' + ICO.close + '</button></div>' +
      '<ul class="nav"><li><strong>Company</strong><div class="sub">' + COMPANY.map(function (c) { return '<a href="' + c[0] + '">' + c[1] + '</a>'; }).join('') + '</div></li>' +
      '<li><strong>Products</strong><div class="sub">' + cats.map(function (c) { return '<a href="' + catLink(c.id) + '">' + esc(c.name) + '</a>'; }).join('') + '</div></li>' +
      '<li><a href="brand.html">Brand</a></li><li><a href="faq.html">FAQ</a></li><li><a href="contact.html">Contact Us</a></li></ul>' +
      '<p class="foot">' + esc(D.company.name) + '<br>' + esc(D.company.email) + '</p></div></div>';
  }
  function footer(D) {
    var c = D.company, cats = (D.categories || []).filter(function (x) { return vis(D).some(function (p) { return p.category === x.id; }); });
    $('#ft').innerHTML =
      '<footer class="footer"><div class="container cols">' +
      '<div class="cs"><h2 class="ttl">Contact <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></h2>' +
      '<p>Mobile : <a href="tel:' + esc(c.phone.replace(/[^+\d]/g, '')) + '">' + esc(c.phone) + '</a>' + (c.fax ? ' · Fax : ' + esc(c.fax) : '') + '</p><p>' + esc(c.hours) + '</p>' +
      '<h3 class="ttl">Address</h3><p>' + esc(c.address) + '</p>' +
      '<div class="sns">' + (c.instagram ? '<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICO.insta + '</a>' : '') + (c.blog ? '<a href="' + esc(c.blog) + '" target="_blank" rel="noopener" aria-label="Blog">' + ICO.blog + '</a>' : '') + '<a href="mailto:' + esc(c.email) + '" aria-label="Email">' + ICO.mail + '</a></div></div>' +
      '<div class="links"><ul><li><strong>Company</strong></li>' + COMPANY.map(function (x) { return '<li><a href="' + x[0] + '">' + x[1] + '</a></li>'; }).join('') + '<li><a href="brand.html">Brand</a></li></ul>' +
      '<ul><li><strong>Products</strong></li>' + cats.map(function (x) { return '<li><a href="' + catLink(x.id) + '">' + esc(x.name) + '</a></li>'; }).join('') + '<li><a href="faq.html">FAQ</a></li><li><a href="contact.html"><strong>Contact Us</strong></a></li></ul></div>' +
      '<div class="info"><h3 class="ttl">Information</h3><p>Company. ' + esc(c.name) + '</p><p>CEO. ' + esc(c.ceo) + '</p><p>Business Reg. No. ' + esc(c.bizNo) + '</p><p>Email. ' + esc(c.email) + '</p>' +
      '<p>This website provides company and product information for business partners. Online sales are not provided.</p><p class="copy">© ' + new Date().getFullYear() + ' JAYSCOS. ALL RIGHTS RESERVED.</p></div>' +
      '</div></footer>' +
      '<div class="float-sns" aria-label="JAYSCOS channels">' + (c.instagram ? '<a href="' + esc(c.instagram) + '" target="_blank" rel="noopener" class="insta" aria-label="Instagram">' + ICO.insta + '<span>Instagram</span></a>' : '') +
      '<a href="contact.html" class="mail" aria-label="Contact us">' + ICO.mail + '<span>Contact Us</span></a>' +
      '<button type="button" class="top" data-scroll-top aria-label="Back to top">' + ICO.up + '</button></div>';
  }

  /* ---------- shared bits ---------- */
  function cards(list, D) {
    return list.map(function (p) {
      var hov = p.hoverImage || p.images[1] || '';
      return '<li class="prd"><div class="thumb"><a href="' + plink(p) + '" class="thumb-slides"><img src="' + esc(p.images[0]) + '" alt="' + esc(p.brand + ' ' + p.name) + '" loading="lazy" class="s1">' +
        (hov ? '<img src="' + esc(hov) + '" alt="' + esc(p.name) + ' lifestyle photo" loading="lazy" class="s2">' : '') + '</a><span class="badge">' + esc(catName(D, p.category).toUpperCase()) + '</span></div>' +
        '<div class="desc"><a href="' + plink(p) + '" class="name">' + esc(p.brand + ' ' + p.name) + '</a><p class="summary">' + esc(p.summaryLine || p.subtitle) + '</p>' +
        '<a href="' + plink(p) + '" class="more">View details ' + ICO.arrow + '</a></div></li>';
    }).join('');
  }
  function pageHead(eyebrow, title, sub, tabs) {
    return '<div class="list-head container"><span class="eyebrow">' + esc(eyebrow) + '</span><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + esc(sub) + '</p>' : '') +
      (tabs ? '<div class="sub-tabs">' + COMPANY.map(function (c) { return '<a href="' + c[0] + '"' + (PAGE === c[2] ? ' class="on"' : '') + '>' + c[1] + '</a>'; }).join('') + '</div>' : '') + '</div>';
  }
  function secHead(eyebrow, title, sub, center) {
    return '<div class="section-head' + (center ? ' center' : '') + '"><div>' + (eyebrow ? '<span class="eyebrow">' + esc(eyebrow) + '</span>' : '') + '<h2 class="h-section">' + esc(title) + '</h2>' + (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') + '</div></div>';
  }
  function doc(x, alt) { return '<a class="doc-img" href="' + esc(x.image) + '" target="_blank" rel="noopener"><img src="' + esc(x.image) + '" alt="' + esc(alt) + '" loading="lazy"></a>'; }
  function companyBand(D) {
    var a = D.about;
    return '<section class="section bg-deep co-teaser"><div class="container wrap"><div class="txt"><span class="eyebrow">About JAYSCOS</span><h2 class="h-section" style="margin-top:6px">' + esc(a.title) + '</h2>' +
      '<p>' + esc((a.intro || [])[0]) + '</p><p>' + esc(a.globalText.split('. ')[0]) + '.</p>' +
      '<div class="btns"><a href="about.html" class="btn btn-white">About Us</a><a href="certifications.html" class="btn btn-ghost">Certifications &amp; Patents</a></div></div>' +
      '<div class="kf">' + (a.keyFacts || []).map(function (k) { return '<div><b>' + esc(k.value) + '</b><span>' + esc(k.label) + '</span></div>'; }).join('') + '</div></div></section>';
  }

  /* ---------- pages ---------- */
  function curProduct(D) {
    var id = qs.get('id'), cat = qs.get('cat');
    if (id) return (D.products || []).filter(function (p) { return p.id === id && p.visible !== false; })[0];
    if (cat) return vis(D).filter(function (p) { return p.category === cat; })[0];
    return vis(D)[0];
  }

  var pages = {
    home: function (D) {
      var h = D.home, v = h.video || {}, vp = byId(D, v.product) || vis(D)[0];
      $('#main').innerHTML = '<div class="main-page">' +
        '<section class="hero hero-slider" id="top" data-interval="6000" aria-label="Main banner"><div class="slides">' +
        (h.slides || []).map(function (s, i) {
          var t = i ? 'h2' : 'h1';
          return '<div class="slide' + (i ? '' : ' on') + '"><picture class="bg"><source media="(max-width:767px)" srcset="' + esc(s.imageMo || s.image) + '"><img src="' + esc(s.image) + '" alt="' + esc(s.alt) + '" width="1920" height="630"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '></picture>' +
            '<div class="container"><div class="copy"><span class="eyebrow">' + esc(s.eyebrow) + '</span><' + t + ' class="h-display">' + br(s.title) + '</' + t + '><p class="lead">' + br(s.lead) + '</p>' +
            '<div class="btns"><a href="' + esc(s.link) + '" class="btn btn-white btn-lg">' + esc(s.linkLabel) + '</a>' + (s.link2 ? '<a href="' + esc(s.link2) + '" class="btn btn-ghost btn-lg">' + esc(s.link2Label) + '</a>' : '') + '</div></div></div></div>';
        }).join('') + '</div><div class="hero-nav"><button type="button" class="prev" aria-label="Previous slide">' + ICO.prev + '</button><button type="button" class="next" aria-label="Next slide">' + ICO.next + '</button></div><ol class="hero-dots" aria-label="Choose slide"></ol></section>' +
        (v.src ? '<section class="section brandvideo" id="video"><div class="container"><div class="wrap"><video class="vid" autoplay muted loop playsinline preload="metadata" poster="' + esc(v.poster) + '" aria-label="Myrié brand film"><source src="' + esc(v.src) + '" type="video/mp4"></video>' +
          (vp ? '<a href="' + plink(vp) + '" class="vcard"><img src="' + esc(vp.images[0]) + '" alt="' + esc(vp.name) + '" loading="lazy" width="120" height="120"><div class="t"><strong>' + esc(vp.brand + ' ' + vp.name) + '</strong><span>' + esc(v.note) + '</span><em>Made in Korea</em></div></a>' : '') +
          '<span class="vtag">' + esc(v.tag) + '</span></div></div></section>' : '') +
        '<section class="section best" id="products"><div class="container">' + secHead('Products', 'The Sea-Calm Revive line', 'A light serum to begin, a soft cream to finish. Select a product for full details.', true) +
        '<ul class="prdList row3 wide">' + cards(vis(D), D) + '</ul></div></section>' +
        '<section class="section concern" id="concern"><div class="container">' + secHead('', h.concernsTitle, h.concernsSub, true) +
        '<div class="tabs" role="tablist">' + (h.concerns || []).map(function (c, i) { return '<button type="button"' + (i ? '' : ' class="on"') + ' data-tab="c' + i + '">' + esc(c.tab) + '</button>'; }).join('') + '</div><div class="panels">' +
        (h.concerns || []).map(function (c, i) { return '<div class="panel' + (i ? '' : ' on') + '" data-panel="c' + i + '"><div class="banner"><div class="txt"><span class="eyebrow">' + esc(c.eyebrow) + '</span><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p><a href="' + esc(c.link) + '" class="btn btn-ink">' + esc(c.linkLabel) + '</a></div><div class="img"><img src="' + esc(c.image) + '" alt="' + esc(c.title) + '" loading="lazy" width="1024" height="1024"></div></div></div>'; }).join('') +
        '</div></div></section>' +
        companyBand(D) +
        '<section class="section story" id="story"><div class="container"><div class="wrap"><div class="img"><img src="img/shop/story.webp" alt="Woman applying Myrié serum by a window" loading="lazy" width="1024" height="1024"></div>' +
        '<div class="txt"><span class="eyebrow">Brand Story</span><h2 class="h-section">' + esc(h.storyTitle) + '</h2>' + paras(h.storyText) +
        '<ul class="chips">' + (h.storyChips || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul><a href="brand.html" class="btn btn-line">Discover Myrié</a></div></div></div></section>' +
        ((h.gallery || []).length ? '<section class="section insta"><div class="container">' + secHead('Moments', 'Daily rituals with Myrié', '', true) + '<ul class="grid">' +
          h.gallery.map(function (g, i) { return '<li><a href="' + esc(D.company.instagram || '#') + '" target="_blank" rel="noopener"><img src="' + esc(g) + '" alt="Myrié Sea-Calm Revive lifestyle photo ' + (i + 1) + '" loading="lazy"></a></li>'; }).join('') + '</ul></div></section>' : '') +
        '</div>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'WebSite', name: D.meta.siteTitle, url: abs('index.html'), inLanguage: 'en' }] });
    },

    about: function (D) {
      var a = D.about, c = D.company;
      var facts = [['Company name', esc(c.name) + (c.nameLocal ? ' / ' + esc(c.nameLocal) : '')], ['CEO', esc(c.ceo)], ['Founded', esc(c.founded)], ['Business registration no.', esc(c.bizNo)], ['Address', esc(c.address)],
        ['Mobile', esc(c.phone)], ['Fax', esc(c.fax)], ['Email', '<a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>'], ['Website', link(c.website)], ['Instagram', link(c.instagram)], ['Blog', link(c.blog)], ['Online store (Korea)', link(c.smartstore)]].filter(function (r) { return r[1]; });
      $('#main').innerHTML = pageHead('Company', 'About Us', 'JAYSCOS Co., Ltd. · For Skin. With Care.', true) +
        '<section class="section" style="padding-top:20px"><div class="container"><div class="split2"><div class="img"><img src="' + esc(a.heroImage) + '" alt="JAYSCOS signboard" width="946" height="703"></div>' +
        '<div class="txt"><span class="eyebrow">Who is JAYSCOS?</span><h2 class="h-section" style="margin-top:6px">' + esc(a.title) + '</h2>' + (a.intro || []).map(function (p, i, arr) { return '<p' + (i === arr.length - 1 ? ' class="strong"' : '') + '>' + esc(p) + '</p>'; }).join('') + '</div></div>' +
        '<div class="kf" style="margin-top:40px">' + (a.keyFacts || []).map(function (k) { return '<div><b>' + esc(k.value) + '</b><span>' + esc(k.label) + '</span></div>'; }).join('') + '</div></div></section>' +
        '<section class="section bg-sea"><div class="container"><div class="split2 rev"><div class="img"><img src="' + esc(a.philosophyImage) + '" alt="JAYSCOS philosophy" loading="lazy"></div><div class="txt"><span class="eyebrow">Philosophy &amp; Value</span><h2 class="h-section" style="margin-top:6px">' + esc(a.philosophyTitle) + '</h2>' + paras(a.philosophy) + '</div></div></div></section>' +
        '<section class="section"><div class="container">' + secHead('Our brand', 'The company and its brand', '', false) + '<div class="cards2">' +
        '<div class="card-w"><div class="k">Company</div><h3>JAYSCOS</h3><div class="sl">' + esc(c.corporateSlogan) + '</div><p>' + esc((a.intro || [])[0]) + '</p></div>' +
        '<div class="card-w"><div class="k">Signature skincare brand</div><h3>' + esc(c.productBrand) + '</h3><div class="sl">' + esc(c.productSlogan) + '</div>' + paras(a.brandText) + '<a href="brand.html" class="btn btn-line btn-sm" style="margin-top:18px">Discover Myrié</a></div></div></div></section>' +
        '<section class="section bg-sand"><div class="container">' + secHead('Research & quality', 'Designed with testing, managed with standards', '', false) + '<div class="cards2">' +
        '<div class="card-w"><div class="k">Research &amp; formulation</div>' + paras(a.researchText) + '</div>' +
        '<div class="card-w"><div class="k">Quality management · ISO 9001:2015</div><p>' + esc(a.qualityText) + '</p><a href="certifications.html" class="btn btn-line btn-sm" style="margin-top:18px">Certifications &amp; Patents</a></div></div></div></section>' +
        '<section class="section"><div class="container"><div class="split2"><div class="txt"><span class="eyebrow">Global business</span><h2 class="h-section" style="margin-top:6px">Growing with partners abroad</h2><p>' + esc(a.globalText) + '</p><a href="contact.html" class="btn btn-ink" style="margin-top:24px">Become a partner</a></div>' +
        '<div class="mous">' + (a.mous || []).map(function (m) { return '<div class="mou">' + doc(m, m.country + ' MOU ' + m.year) + '<span class="k">' + esc(m.year) + ' · ' + esc(m.country) + '</span><b>' + esc(m.value) + '</b><span>' + esc(m.text) + '</span></div>'; }).join('') + '</div></div></div></section>' +
        '<section class="section bg-sea"><div class="container">' + secHead('Company information', c.name, '', false) + '<dl class="facts">' + facts.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + r[1] + '</dd></div>'; }).join('') + '</dl></div></section>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'AboutPage', name: 'About ' + c.name, url: abs('about.html') }] });
    },

    history: function (D) {
      var a = D.about;
      $('#main').innerHTML = pageHead('Company', 'History', 'From startup preparation to quality certification and our first export partnerships.', true) +
        '<section class="section" style="padding-top:30px"><div class="container"><ol class="tl">' + (a.history || []).map(function (h) {
          var items = String(h.items || '').split(';').map(function (s) { return s.trim(); }).filter(Boolean);
          return '<li><div class="d">' + esc(h.date) + '</div><div><h3>' + esc(h.title) + '</h3>' + (items.length ? '<ul>' + items.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul>' : '') + '</div></li>';
        }).join('') + '</ol></div></section>' + companyBand(D);
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'WebPage', name: 'History of ' + D.company.name, url: abs('history.html') }] });
    },

    certs: function (D) {
      var a = D.about, iso = (a.certificates || []).filter(function (x) { return /ISO/.test(x.title); })[0], rest = (a.certificates || []).filter(function (x) { return x !== iso; });
      $('#main').innerHTML = pageHead('Company', 'Certifications & Patents', a.ipIntro, true) +
        (iso ? '<section class="section" style="padding-top:30px"><div class="container"><div class="iso"><div class="txt"><span class="eyebrow">Quality management system</span><h2 class="h-section" style="margin-top:6px">' + esc(iso.title) + '</h2><p style="margin-top:14px;color:var(--ink-2);line-height:1.8">' + esc(a.qualityText) + '</p><p style="margin-top:10px;color:var(--muted);font-size:14px">' + esc(iso.text) + '</p></div>' +
          '<div class="imgs">' + doc({ image: 'img/company/iso9001-en.webp' }, 'ISO 9001:2015 certificate (English)') + doc({ image: 'img/company/iso9001-kr.webp' }, 'ISO 9001:2015 certificate (Korean)') + '</div></div></div></section>' : '') +
        '<section class="section bg-sea"><div class="container">' + secHead('Technology & intellectual property', 'Patents', '', false) + '<div class="patents">' +
        (a.patents || []).map(function (p) { return '<div class="patent">' + doc(p, p.kind + ': ' + p.title) + '<div><div class="k">' + esc(p.kind) + '</div><h3>' + esc(p.title) + '</h3><div class="meta">' + esc(p.meta) + '</div><p>' + esc(p.text) + '</p></div></div>'; }).join('') + '</div></div></section>' +
        '<section class="section"><div class="container">' + secHead('Certifications & registrations', 'Business foundation', 'Certificates and registrations that support our operations, quality and brand protection.', false) + '<div class="docs">' +
        rest.map(function (x) { return '<div class="doc">' + doc(x, x.title) + '<b>' + esc(x.title) + '</b><span>' + esc(x.text) + '</span></div>'; }).join('') + '</div></div></section>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'WebPage', name: 'Certifications and patents of ' + D.company.name, url: abs('certifications.html') }] });
    },

    product: function (D) {
      var p = curProduct(D);
      if (!p) { $('#main').innerHTML = pageHead('Products', 'Product not found', '', false) + '<p style="text-align:center"><a class="btn btn-ink" href="index.html#products">See all products</a></p>'; return; }
      document.title = p.brand + ' ' + p.name + ' | ' + D.company.name;
      var md = $('meta[name="description"]'); if (md) md.setAttribute('content', p.summary);
      var spec = [['Brand / Line', p.brand + ' · ' + p.line], ['Volume', p.volume], ['Texture', p.texture], ['Packaging', p.packaging], ['Function', p.functional], ['Recommended for', p.skinType], ['Origin', p.origin]].filter(function (r) { return r[1]; });
      var im = p.images || [], others = vis(D).filter(function (x) { return x.id !== p.id; });
      var img = function (i, alt) { return im[i] ? '<div class="pd-img"><img src="' + esc(im[i]) + '" alt="' + esc(p.name + ' ' + alt) + '" loading="lazy"></div>' : ''; };
      $('#main').innerHTML = '<div class="detail"><div class="container">' +
        '<ul class="crumb"><li><a href="index.html">Home</a></li><li><a href="products.html">Products</a></li><li><a href="' + catLink(p.category) + '">' + esc(catName(D, p.category)) + '</a></li></ul>' +
        '<div class="detail-top"><div class="gallery"><div class="main"><ul class="slides">' + im.map(function (s, i) { return '<li><img src="' + esc(s) + '" alt="' + esc(p.brand + ' ' + p.name + ' image ' + (i + 1)) + '"' + (i ? ' loading="lazy"' : '') + '></li>'; }).join('') + '</ul>' +
        '<button type="button" class="arrow prev" aria-label="Previous image">' + ICO.prev + '</button><button type="button" class="arrow next" aria-label="Next image">' + ICO.next + '</button><span class="counter">1 / ' + im.length + '</span></div>' +
        '<ul class="thumbs">' + im.map(function (s, i) { return '<li' + (i ? '' : ' class="on"') + '><img src="' + esc(s) + '" alt="' + esc(p.name + ' thumbnail ' + (i + 1)) + '" loading="lazy"></li>'; }).join('') + '</ul></div>' +
        '<div class="info"><span class="brand-line">' + esc(p.brand + ' ' + p.line) + ' Revive</span><h1>' + esc(p.name) + '</h1><div class="badges">' + (p.badges || []).map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</div>' +
        '<p class="sum">' + esc(p.summary) + '</p><dl class="spec">' + spec.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="benefit"><span>' + ICO.shield + 'Functional cosmetic</span><span>' + ICO.drop + 'Patch tested</span><span>' + ICO.flag + 'Made in Korea</span></div>' +
        '<div class="cta-btns"><a href="contact.html?product=' + encodeURIComponent(p.id) + '" class="btn btn-ink">Inquire about this product</a><button type="button" class="btn btn-line" onclick="window.print()">Save as PDF</button></div>' +
        '<div class="share"><button type="button" data-copy-url>' + ICO.link + 'Copy link</button><a href="mailto:' + esc(D.company.email) + '?subject=' + encodeURIComponent('Inquiry: ' + p.brand + ' ' + p.name) + '">' + ICO.mail + 'Email us</a></div></div>' +
        '<div class="dtabs"><ul><li class="on"><a href="#prdDetail">Details</a></li><li><a href="#prdIngredients">Ingredients</a></li><li><a href="#prdInfo">How to use</a></li></ul></div>' +
        '<div id="prdDetail" class="dtab-cont"><div class="pd-cont">' +
        '<div class="pd-block"><span class="eyebrow">JAYSCOS · ' + esc(p.brand) + '</span><h2>' + esc(p.subtitle) + '</h2>' + img(1, 'mood photo') +
        '<ol class="pd-points">' + (p.points || []).map(function (x, i) { return '<li><i>POINT ' + (i + 1) + '</i><b>' + esc(x.title) + '</b><span>' + esc(x.text) + '</span></li>'; }).join('') + '</ol></div>' +
        ((p.checklist || []).length ? '<div class="pd-block pd-check"><h2>' + esc(p.checklistTitle) + '</h2><ul>' + p.checklist.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div>' : '') +
        '<div class="pd-block"><span class="eyebrow">Key benefits</span><h2>What it does for your skin</h2>' +
        '<ul class="ing-grid">' + (p.benefits || []).map(function (b) { return '<li><b>' + esc(b) + '</b></li>'; }).join('') + '</ul>' + img(2, 'texture photo') + '</div>' +
        '<div class="pd-block"><span class="eyebrow">Formula</span><h2>Key ingredients</h2><p class="lead">Every ingredient has a role: soothing first, moisture and barrier next, functional care on top.</p><ul class="ing-grid">' +
        (p.ingredients || []).map(function (x) { return '<li><b>' + esc(x.name) + '</b><span>' + esc(x.text) + '</span></li>'; }).join('') + '</ul>' + img(3, 'lifestyle photo') + '</div>' +
        '<div class="pd-block"><span class="eyebrow">Evidence</span><h2>Tested on the finished product</h2><div class="ev-box"><ul>' + (p.evidence || []).map(function (e) { return '<li>' + ICO.check + '<span>' + esc(e) + '</span></li>'; }).join('') + '</ul><p>Detailed figures and test reports are provided to business partners on request.</p></div>' + img(4, 'routine photo') + '</div>' +
        '</div></div>' +
        '<div id="prdIngredients" class="dtab-cont"><h2 class="ttl">Full ingredients (INCI)</h2><div class="inci-box">' + esc(p.inci) + '</div></div>' +
        '<div id="prdInfo" class="dtab-cont"><h2 class="ttl">How to use</h2><ol class="howto" style="margin-left:0">' + (p.howToUse || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        '<div style="margin-top:36px"><div class="fold open"><button type="button" class="ttl">Precautions ' + ICO.down + '</button><div class="cont"><ul>' + (p.cautions || []).map(function (c) { return '<li style="padding:4px 0">· ' + esc(c) + '</li>'; }).join('') + '</ul></div></div>' +
        '<div class="fold"><button type="button" class="ttl">Product information ' + ICO.down + '</button><div class="cont"><table><tbody>' + spec.map(function (r) { return '<tr><th>' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('') + '<tr><th>Brand owner</th><td>' + esc(D.company.name) + '</td></tr></tbody></table></div></div>' +
        '<div class="fold"><button type="button" class="ttl">Business inquiries ' + ICO.down + '</button><div class="cont"><p>For pricing, MOQ, samples and documents, please use the <a href="contact.html?product=' + encodeURIComponent(p.id) + '" style="color:var(--blue);font-weight:700">Contact Us</a> page or email ' + esc(D.company.email) + '.</p></div></div></div></div>' +
        '</div>' +
        (others.length ? '<section class="related section"><div class="container">' + secHead('Complete the routine', 'Other products', '', false) + '<ul class="prdList row3 wide">' + cards(others, D) + '</ul></div></section>' : '') +
        '</div></div>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'Product', name: p.brand + ' ' + p.name, description: p.summary, brand: { '@type': 'Brand', name: p.brand }, category: catName(D, p.category), size: p.volume,
        image: im.map(abs), manufacturer: { '@id': abs('index.html') + '#org' }, countryOfOrigin: 'KR' }] });
    },

    products: function (D) {
      var cat = qs.get('cat'), c = (D.categories || []).filter(function (x) { return x.id === cat; })[0];
      var list = vis(D).filter(function (p) { return !c || p.category === c.id; });
      if (c) document.title = c.name + ' | Myrié by JAYSCOS';
      $('#main').innerHTML = '<div class="list-head container"><span class="eyebrow">Products</span><h1>' + esc(c ? c.name : 'All products') + '</h1><p>' + esc(c ? (c.desc || '') : 'The Myrié Sea-Calm Revive line by JAYSCOS.') + '</p>' +
        '<div class="cate-tabs"><a href="products.html"' + (c ? '' : ' class="on"') + '>All</a>' + (D.categories || []).map(function (x) { return '<a href="' + catLink(x.id) + '"' + (c && c.id === x.id ? ' class="on"' : '') + '>' + esc(x.name) + '</a>'; }).join('') + '</div></div>' +
        '<section class="section" style="padding-top:0"><div class="container"><div class="list-tools"><span class="count">' + list.length + ' product' + (list.length === 1 ? '' : 's') + '</span><span class="count">Select a product for full details</span></div>' +
        (list.length ? '<ul class="prdList">' + cards(list, D) + '</ul>' : '<p style="text-align:center;padding:60px 0;color:var(--muted)">New products are coming soon.</p>') + '</div></section>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'ItemList', name: c ? c.name : 'All products', itemListElement: list.map(function (p, i) { return { '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.name, url: abs(plink(p)) }; }) }] });
    },

    brand: function (D) {
      var b = D.brand, a = D.about;
      $('#main').innerHTML = pageHead('Brand', b.title, b.slogan, false) +
        '<section class="section" style="padding-top:10px"><div class="container"><div class="pg-hero"><img src="' + esc(b.heroImage) + '" alt="Myrié brand visual" width="1000" height="490"></div>' +
        '<div class="promise" style="margin-top:46px"><q>' + esc(b.promise) + '</q>' + paras(b.intro) + '</div></div></section>' +
        '<section class="section bg-sea"><div class="container"><div class="split2"><div class="img"><img src="img/shop/story.webp" alt="Woman with Myrié serum" loading="lazy"></div><div class="txt"><span class="eyebrow">The name</span><h2 class="h-section" style="margin-top:6px">What “Myrié” means</h2><p>' + esc(b.nameMeaning) + '</p></div></div></div></section>' +
        '<section class="section why"><div class="container">' + secHead('Myrié care approach', 'Comfort first, functional care on top', 'How we think about every product.', true) + '<div class="points four">' +
        (a.approach || []).map(function (s, i) { return '<div class="point"><div class="img"><img src="' + esc((b.approachImages || [])[i] || '') + '" alt="' + esc(s.step) + '" loading="lazy"></div><span class="no">0' + (i + 1) + '</span><h3>' + esc(s.step) + '</h3><p>' + esc(s.text) + '</p></div>'; }).join('') + '</div></div></section>' +
        '<section class="section bg-sand"><div class="container">' + secHead('Product line', 'The Sea-Calm line', b.lineText, false) + '<div class="routine">' +
        (b.routine || []).map(function (r) { return '<a href="' + esc(r.link) + '"><img src="' + esc(r.image) + '" alt="' + esc(r.name) + '" loading="lazy"><div><i>' + esc(r.step) + '</i><b>' + esc(r.name) + '</b><span>' + esc(r.text) + '</span></div></a>'; }).join('') + '</div></div></section>' +
        '<section class="section"><div class="container"><div class="split2 rev"><div class="img"><img src="img/seaweed.webp" alt="Sargassum serratifolium brown seaweed" loading="lazy"></div><div class="txt"><span class="eyebrow">Key marine ingredient</span><h2 class="h-section" style="margin-top:6px">' + esc(a.ingredientTitle) + '</h2><p>' + esc(a.ingredientText) + '</p></div></div></div></section>' +
        '<section class="section bg-sea"><div class="container">' + secHead('Recommended for', 'Who Myrié is for', '', true) + '<ul class="chips2">' + (b.recommended || []).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul></div></section>' +
        '<section class="section"><div class="container">' + secHead('Communication', 'What we stand by', '', true) + '<div class="values4">' + (b.values || []).map(function (v) { return '<div><b>' + esc(v.title) + '</b><span>' + esc(v.text) + '</span></div>'; }).join('') + '</div></div></section>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'Brand', name: b.title, slogan: b.slogan, description: (b.intro || [])[0] }] });
    },

    faq: function (D) {
      $('#main').innerHTML = '<div class="faq-page">' + pageHead('FAQ', 'Frequently asked questions', 'About Myrié products, testing and working with JAYSCOS.', false) +
        '<div class="container"><div class="faq-visual"><img src="img/shop/faq_visual.webp" alt="Myrié cream and serum on a vanity" width="1000" height="400" style="width:100%;height:100%;object-fit:cover"></div><div class="faq-list">' +
        (D.faq || []).map(function (f, i) { return '<details' + (i ? '' : ' open') + '><summary><h2>' + esc(f.q) + '</h2></summary><p>' + esc(f.a) + '</p></details>'; }).join('') +
        '</div><div class="faq-more"><a href="contact.html" class="btn btn-ink">Ask us a question</a></div></div></div>';
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'FAQPage', mainEntity: (D.faq || []).map(function (f) { return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } }; }) }] });
    },

    contact: function (D) {
      var c = D.company, k = D.contact, pre = qs.get('product');
      var opts = vis(D).map(function (p) { return '<option value="' + esc(p.name) + '"' + (p.id === pre ? ' selected' : '') + '>' + esc(p.brand + ' ' + p.name) + '</option>'; }).join('');
      $('#main').innerHTML = pageHead('Contact Us', k.title, k.lead, false) +
        '<section class="section" style="padding-top:20px"><div class="container ct"><form class="form" id="cf" novalidate>' +
        '<div class="row"><label><span>Name <i>*</i></span><input name="name" autocomplete="name" required></label><label><span>Company <i>*</i></span><input name="company" autocomplete="organization" required></label></div>' +
        '<div class="row"><label><span>Email <i>*</i></span><input name="email" type="email" autocomplete="email" required></label><label><span>Country <i>*</i></span><input name="country" autocomplete="country-name" required></label></div>' +
        '<div class="row"><label><span>Phone / WhatsApp</span><input name="phone" autocomplete="tel"></label><label><span>Inquiry type <i>*</i></span><select name="type" required>' + (k.inquiryTypes || []).map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select></label></div>' +
        '<label><span>Product of interest</span><select name="product"><option value="">All products / not decided</option>' + opts + '</select></label>' +
        '<label><span>Message <i>*</i></span><textarea name="message" required placeholder="Tell us about your business, target market and the quantities you have in mind."></textarea></label>' +
        '<label class="chk"><input type="checkbox" name="agree" required><span>I agree that JAYSCOS may use the information above only to reply to this inquiry.</span></label>' +
        '<button class="btn btn-ink" type="submit">Send inquiry</button><div class="msg" id="cfmsg"></div></form>' +
        '<aside class="ct-side"><div><div class="k">Email</div><p><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></p></div>' +
        '<div><div class="k">Mobile' + (c.fax ? ' / Fax' : '') + '</div><p><a href="tel:' + esc(c.phone.replace(/[^+\d]/g, '')) + '">' + esc(c.phone) + '</a>' + (c.fax ? '<br>Fax ' + esc(c.fax) : '') + '<br><span style="color:var(--muted);font-size:14px">' + esc(c.hours) + '</span></p></div>' +
        '<div><div class="k">Address</div><p>' + esc(c.address) + '</p></div><div><div class="k">Company</div><p>' + esc(c.name) + '<br><span style="color:var(--muted);font-size:14px">CEO ' + esc(c.ceo) + ' · Business Reg. No. ' + esc(c.bizNo) + '</span></p></div></aside></div></section>';
      $('#cf').onsubmit = function (e) {
        e.preventDefault();
        var f = e.target, msg = $('#cfmsg'), data = {};
        new FormData(f).forEach(function (v, key) { data[key] = v; });
        var bad = Array.prototype.filter.call(f.querySelectorAll('[required]'), function (el) { return el.type === 'checkbox' ? !el.checked : !el.value.trim(); });
        if (bad.length || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || '')) { msg.className = 'msg err'; msg.textContent = 'Please fill in all required fields (*) with a valid email address and agree to the privacy notice.'; return; }
        var body = ['Name: ' + data.name, 'Company: ' + data.company, 'Email: ' + data.email, 'Country: ' + data.country, 'Phone: ' + (data.phone || '-'), 'Inquiry type: ' + data.type, 'Product: ' + (data.product || 'All products'), '', data.message].join('\n');
        var subject = '[Website inquiry] ' + data.type + ' - ' + data.company + ' (' + data.country + ')';
        if (k.formEndpoint) {
          fetch(k.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.assign({ subject: subject, _subject: subject }, data)) })
            .then(function (r) { if (!r.ok) throw 0; msg.className = 'msg ok'; msg.textContent = 'Thank you. Your inquiry has been sent. We will reply to ' + data.email + ' soon.'; f.reset(); })
            .catch(function () { msg.className = 'msg err'; msg.textContent = 'Sending failed. Please email us directly at ' + k.formRecipient + '.'; });
        } else {
          location.href = 'mailto:' + k.formRecipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          msg.className = 'msg ok'; msg.textContent = 'Your email app has opened with the inquiry filled in. Please press send to deliver it to ' + k.formRecipient + '.';
        }
      };
      ld({ '@context': 'https://schema.org', '@graph': [org(D), { '@type': 'ContactPage', name: 'Contact ' + c.name, url: abs('contact.html') }] });
    }
  };

  load(function (D) {
    header(D); footer(D);
    if (pages[PAGE]) pages[PAGE](D);
    if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
    var s = document.createElement('script'); s.src = 'js/jayscos.js?v=3'; document.body.appendChild(s);
  });
})();
