/* JAYSCOS global site — renders every public page from data/site.js (edited in /admin/) */
(function () {
  var ROOT = document.documentElement.getAttribute('data-root') || '';
  var qs = new URLSearchParams(location.search);
  var ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h12M9 3l5 5-5 5"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>';

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function img(src) { return /^(https?:)?\/\//.test(src) || src.indexOf('data:') === 0 ? src : ROOT + src; }
  function $(s, el) { return (el || document).querySelector(s); }
  function catName(D, id) { var c = (D.categories || []).filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; }
  function visible(D) { return (D.products || []).filter(function (p) { return p.visible !== false; }); }
  function plink(p) { return ROOT + 'product.html?id=' + encodeURIComponent(p.id); }

  function load(cb) {
    try { if (qs.get('draft') === '1') sessionStorage.setItem('jz_dm', '1'); if (qs.get('draft') === '0') sessionStorage.removeItem('jz_dm'); } catch (e) {}
    var dm = false; try { dm = sessionStorage.getItem('jz_dm') === '1'; } catch (e) {}
    if (dm) {
      try { var d = JSON.parse(localStorage.getItem('jz_draft') || 'null'); if (d) { window.SITE_DATA = d; document.body.insertAdjacentHTML('beforeend', '<div class="draft-bar">Draft preview (not published)</div>'); return cb(d); } } catch (e) {}
    }
    var s = document.createElement('script');
    s.src = ROOT + 'data/site.js?t=' + Date.now();
    s.onload = function () { cb(window.SITE_DATA); };
    s.onerror = function () { document.body.insertAdjacentHTML('afterbegin', '<p style="padding:40px">Could not load site data.</p>'); };
    document.head.appendChild(s);
  }

  function header(D) {
    var page = document.body.getAttribute('data-page');
    var on = function (k) { return page === k ? ' class="on"' : ''; };
    $('#hd').innerHTML = '<div class="wrap"><a class="logo" href="' + ROOT + 'index.html" aria-label="' + esc(D.company.name) + ' home"><img src="' + ROOT + 'img/logo.png" alt="JAYSCOS logo" width="133" height="22"></a>' +
      '<button class="menu-btn" aria-label="Open menu"><span></span><span></span></button>' +
      '<nav class="nav"><a href="' + ROOT + 'about.html"' + on('about') + '>About</a><a href="' + ROOT + 'products.html"' + on('products') + '>Products</a><a href="' + ROOT + 'contact.html"' + on('contact') + '>Contact</a>' +
      '<a class="btn" href="' + ROOT + 'contact.html">Export Inquiry</a></nav></div>';
    $('.menu-btn').onclick = function () { $('.nav').classList.toggle('open'); };
    var hd = $('#hd');
    addEventListener('scroll', function () { hd.classList.toggle('scrolled', scrollY > 10); }, { passive: true });
  }

  function footer(D) {
    var c = D.company, year = new Date().getFullYear();
    $('#ft').innerHTML = '<div class="wrap"><div class="top">' +
      '<div class="brand"><img src="' + ROOT + 'img/logo_slogan_white.png" alt="JAYSCOS — For Skin. With Care." width="261" height="64"><p style="margin-top:20px;max-width:340px">' + esc(c.productBrand) + ' · ' + esc(c.productSlogan) + '<br>Daily derma skincare from Korea.</p></div>' +
      '<div><h4>Company</h4><ul><li>' + esc(c.name) + '</li><li>CEO ' + esc(c.ceo) + '</li><li>Business Reg. No. ' + esc(c.bizNo) + '</li><li>' + esc(c.address) + '</li></ul></div>' +
      '<div><h4>Contact</h4><ul><li><a href="tel:' + esc(c.phone.replace(/[^+\d]/g, '')) + '">' + esc(c.phone) + '</a></li><li><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></li><li>' + esc(c.hours) + '</li></ul>' +
      '<h4 style="margin-top:26px">Menu</h4><ul><li><a href="' + ROOT + 'about.html">About</a></li><li><a href="' + ROOT + 'products.html">Products</a></li><li><a href="' + ROOT + 'contact.html">Contact</a></li></ul></div>' +
      '</div><div class="bot"><span>© ' + year + ' ' + esc(c.name) + ' All rights reserved.</span><span>This website is for product information and business inquiries. Online sales are not provided.</span></div></div>';
  }

  function ld(obj) { var s = document.createElement('script'); s.type = 'application/ld+json'; s.textContent = JSON.stringify(obj); document.head.appendChild(s); }
  function orgLd(D) {
    var c = D.company;
    return { '@type': 'Organization', '@id': location.origin + location.pathname.replace(/[^/]*$/, '') + '#org', name: c.name, alternateName: c.nameLocal, slogan: c.corporateSlogan, email: c.email, telephone: c.phone,
      address: { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'KR' }, brand: { '@type': 'Brand', name: c.productBrand, slogan: c.productSlogan } };
  }

  function cards(list, D) {
    return list.map(function (p) {
      return '<a class="card reveal" href="' + plink(p) + '"><div class="ph"><img src="' + img(p.images[0]) + '" alt="' + esc(p.brand + ' ' + p.name) + '" loading="lazy"></div><div class="bd">' +
        '<div class="cat">' + esc(catName(D, p.category)) + ' · ' + esc(p.line) + '</div><h3>' + esc(p.name) + '</h3><p>' + esc(p.subtitle) + '</p>' +
        '<div class="meta"><span>' + esc(p.volume) + '</span><b>View details ' + ARROW + '</b></div></div></a>';
    }).join('');
  }

  var pages = {
    home: function (D) {
      var h = D.home, a = D.about;
      $('#main').innerHTML =
        '<section class="hero"><div class="wrap"><div class="reveal"><div class="eyebrow">' + esc(h.eyebrow) + '</div><h1>' + esc(h.title) + '</h1><p class="lead">' + esc(h.lead) + '</p>' +
        '<div class="cta"><a class="btn" href="products.html">View products ' + ARROW + '</a><a class="btn ghost" href="contact.html">Export inquiry</a></div></div>' +
        '<div class="hero-img reveal"><img src="' + img(h.heroImage) + '" alt="Myrié Sea-Calm Revive Serum and Cream" width="1024" height="1024"><div class="tag"><b>' + esc(D.company.corporateSlogan) + '</b><span>' + esc(D.company.name) + ' · Korea</span></div></div></div></section>' +
        '<section><div class="wrap"><div class="hl">' + h.highlights.map(function (x, i) { return '<div class="reveal"><div class="n">0' + (i + 1) + '</div><h3>' + esc(x.title) + '</h3><p>' + esc(x.text) + '</p></div>'; }).join('') + '</div></div></section>' +
        '<section class="section"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Products</div><h2>The Sea-Calm routine</h2></div><p>A light serum to begin and a soft cream to finish. Select a product to see its full details, ingredients and evidence.</p></div>' +
        '<div class="grid">' + cards(visible(D), D) + '</div></div></section>' +
        '<section class="section dark"><div class="wrap"><div class="eyebrow">Myrié Care Approach</div><h2 style="margin-top:14px;max-width:760px">Comfort first. Functional care on top.</h2>' +
        '<div class="steps">' + a.approach.map(function (s) { return '<div class="reveal"><h3>' + esc(s.step) + '</h3><p>' + esc(s.text) + '</p></div>'; }).join('') + '</div></div></section>' +
        '<section class="section"><div class="wrap split"><div class="media round reveal"><img src="' + img('img/seaweed.webp') + '" alt="Sargassum serratifolium brown seaweed" loading="lazy"></div>' +
        '<div class="txt reveal"><div class="eyebrow">Key marine ingredient</div><h2>' + esc(a.ingredientTitle) + '</h2><p>' + esc(a.ingredientText) + '</p><a class="btn ghost" style="margin-top:28px" href="about.html">About JAYSCOS ' + ARROW + '</a></div></div></section>' +
        '<section class="section tight"><div class="wrap"><div class="band reveal"><div><div class="eyebrow">Export & partnership</div><h2 style="margin:12px 0 14px">' + esc(h.partnerTitle) + '</h2><p class="lead">' + esc(h.partnerText) + '</p></div>' +
        '<div class="cta"><a class="btn" href="contact.html">Contact us ' + ARROW + '</a></div></div></div></section>';
      ld({ '@context': 'https://schema.org', '@graph': [orgLd(D), { '@type': 'WebSite', name: D.meta.siteTitle, url: location.href.split('?')[0] }] });
    },

    about: function (D) {
      var a = D.about, c = D.company;
      $('#main').innerHTML =
        '<section class="ph-head"><div class="wrap"><div class="crumb"><a href="index.html">Home</a> / About</div><h1 class="reveal">' + esc(a.title) + '</h1><p class="lead reveal">' + esc(a.intro) + '</p></div></section>' +
        '<section class="section tight" style="padding-top:0"><div class="wrap brands">' +
        '<div class="reveal"><div class="k">Corporate brand</div><h3>JAYSCOS</h3><div class="sl">' + esc(c.corporateSlogan) + '</div><p>A company that thinks about the skin first, and creates the standards for its products, ingredients, technology and brand.</p></div>' +
        '<div class="reveal"><div class="k">Product brand</div><h3>' + esc(c.productBrand) + '</h3><div class="sl">' + esc(c.productSlogan) + '</div><p>Myrié carries the JAYSCOS care philosophy into a soft, comfortable everyday skincare experience.</p></div></div></section>' +
        '<section class="section"><div class="wrap split"><div class="media reveal"><img src="' + img('img/story-model.webp') + '" alt="Woman using Myrié skincare by a window" loading="lazy"></div><div class="txt reveal"><div class="eyebrow">Our story</div><h2>Why Myrié began</h2>' +
        a.story.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '<p class="note"><b>The name.</b> ' + esc(a.nameMeaning) + '</p></div></div></section>' +
        '<section class="section dark"><div class="wrap"><div class="eyebrow">Care approach</div><h2 style="margin-top:14px">How we think about every product</h2><div class="steps">' +
        a.approach.map(function (s) { return '<div class="reveal"><h3>' + esc(s.step) + '</h3><p>' + esc(s.text) + '</p></div>'; }).join('') + '</div></div></section>' +
        '<section class="section"><div class="wrap split rev"><div class="media reveal"><img src="' + img('img/serum-coral.webp') + '" alt="Sea-Calm Revive Serum with coral and sea glass" loading="lazy"></div><div class="txt reveal"><div class="eyebrow">Product line</div><h2>' + esc(a.lineTitle) + '</h2><p>' + esc(a.lineText) + '</p><p>' + esc(a.ingredientText) + '</p></div></div></section>' +
        '<section class="section" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Communication</div><h2>What we stand by</h2></div></div><div class="values">' +
        a.values.map(function (v) { return '<div class="reveal"><h3>' + esc(v.title) + '</h3><p>' + esc(v.text) + '</p></div>'; }).join('') + '</div></div></section>' +
        '<section class="section" style="padding-top:0"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Company information</div><h2>' + esc(c.name) + '</h2></div></div><dl class="facts">' +
        [['Company name', c.name + (c.nameLocal ? ' / ' + c.nameLocal : '')], ['CEO', c.ceo], ['Business registration no.', c.bizNo], ['Headquarters', c.address], ['Brands', c.productBrand + ' (Sea-Calm line)'], ['Telephone', c.phone], ['Email', c.email]]
          .map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl></div></section>';
      ld({ '@context': 'https://schema.org', '@graph': [orgLd(D), { '@type': 'AboutPage', name: 'About ' + c.name }] });
    },

    products: function (D) {
      var cats = (D.categories || []).filter(function (c) { return visible(D).some(function (p) { return p.category === c.id; }); });
      $('#main').innerHTML =
        '<section class="ph-head"><div class="wrap"><div class="crumb"><a href="index.html">Home</a> / Products</div><h1>Products</h1><p class="lead">Myrié Sea-Calm line by JAYSCOS. Select a product for its full details, key ingredients, evidence and full ingredient list.</p></div></section>' +
        '<section style="padding-bottom:110px"><div class="wrap"><div class="tabs"><button class="on" data-c="">All</button>' + cats.map(function (c) { return '<button data-c="' + esc(c.id) + '">' + esc(c.name) + '</button>'; }).join('') + '</div><div class="grid" id="plist"></div></div></section>';
      function show(cid) { $('#plist').innerHTML = cards(visible(D).filter(function (p) { return !cid || p.category === cid; }), D); reveal(); }
      document.querySelectorAll('.tabs button').forEach(function (b) {
        b.onclick = function () { document.querySelectorAll('.tabs button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); show(b.getAttribute('data-c')); };
      });
      show('');
      ld({ '@context': 'https://schema.org', '@graph': [orgLd(D), { '@type': 'ItemList', itemListElement: visible(D).map(function (p, i) { return { '@type': 'ListItem', position: i + 1, name: p.brand + ' ' + p.name, url: new URL(plink(p), location.href).href }; }) }] });
    },

    product: function (D) {
      var id = qs.get('id'), p = (D.products || []).filter(function (x) { return x.id === id && x.visible !== false; })[0];
      if (!p) { $('#main').innerHTML = '<section class="ph-head"><div class="wrap"><h1>Product not found</h1><p class="lead"><a class="btn" href="products.html">Back to products</a></p></div></section>'; return; }
      document.title = p.brand + ' ' + p.name + ' | ' + D.company.name;
      var m = document.querySelector('meta[name="description"]'); if (m) m.setAttribute('content', p.summary);
      var spec = [['Brand / Line', p.brand + ' · ' + p.line], ['Category', catName(D, p.category)], ['Volume', p.volume], ['Texture', p.texture], ['Packaging', p.packaging], ['Function', p.functional], ['Recommended for', p.skinType], ['Origin', p.origin]].filter(function (r) { return r[1]; });
      var others = visible(D).filter(function (x) { return x.id !== p.id; });
      $('#main').innerHTML =
        '<section class="wrap" style="padding-top:26px"><div class="crumb"><a href="index.html">Home</a> / <a href="products.html">Products</a> / ' + esc(p.name) + '</div></section>' +
        '<section class="wrap pd"><div class="gal"><div class="main"><img id="gmain" src="' + img(p.images[0]) + '" alt="' + esc(p.brand + ' ' + p.name) + '"></div>' +
        (p.images.length > 1 ? '<div class="thumbs">' + p.images.map(function (s, i) { return '<button class="' + (i ? '' : 'on') + '" data-src="' + esc(img(s)) + '" aria-label="Image ' + (i + 1) + '"><img src="' + img(s) + '" alt="' + esc(p.name) + ' image ' + (i + 1) + '" loading="lazy"></button>'; }).join('') + '</div>' : '') + '</div>' +
        '<div class="info"><div class="eyebrow">' + esc(p.brand) + ' · ' + esc(p.line) + ' line</div><h1>' + esc(p.name) + '</h1><p class="sub">' + esc(p.subtitle) + '</p>' +
        '<div class="badges">' + (p.badges || []).map(function (b) { return '<span>' + esc(b) + '</span>'; }).join('') + '</div><p class="sum">' + esc(p.summary) + '</p>' +
        '<dl class="spec">' + spec.map(function (r) { return '<div><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="cta"><a class="btn" href="contact.html?product=' + encodeURIComponent(p.id) + '">Inquire about this product ' + ARROW + '</a><button class="btn ghost" onclick="window.print()">Print / Save PDF</button></div></div></section>' +
        '<div class="nav-sticky"><div class="wrap"><a href="#benefits">Key benefits</a><a href="#ingredients">Key ingredients</a><a href="#howto">How to use</a><a href="#evidence">Evidence</a><a href="#inci">Full ingredients</a><a href="#caution">Precautions</a></div></div>' +
        '<div class="wrap">' +
        '<section class="block" id="benefits"><div class="head"><div><div class="eyebrow">01</div><h2>Key benefits</h2></div><ul class="blist">' + p.benefits.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div></section>' +
        '<section class="block" id="ingredients"><div class="head"><div><div class="eyebrow">02</div><h2>Key ingredients</h2></div><div class="ings">' + p.ingredients.map(function (x) { return '<div><b>' + esc(x.name) + '</b><p>' + esc(x.text) + '</p></div>'; }).join('') + '</div></div></section>' +
        '<section class="block" id="howto"><div class="head"><div><div class="eyebrow">03</div><h2>How to use</h2></div><ol class="howto">' + p.howToUse.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div></section>' +
        '<section class="block" id="evidence"><div class="head"><div><div class="eyebrow">04</div><h2>Evidence & testing</h2></div><div><div class="evid">' + p.evidence.map(function (e) { return '<div>' + CHECK + '<span>' + esc(e) + '</span></div>'; }).join('') + '</div>' +
        '<p class="small">Tests were conducted on the finished product. Detailed figures and test reports are provided to business partners on request.</p></div></div></section>' +
        '<section class="block" id="inci"><div class="head"><div><div class="eyebrow">05</div><h2>Full ingredients</h2></div><div class="inci">' + esc(p.inci) + '</div></div></section>' +
        '<section class="block" id="caution"><div class="head"><div><div class="eyebrow">06</div><h2>Precautions</h2></div><ul class="cautions">' + p.cautions.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul></div></section>' +
        '</div>' +
        (others.length ? '<section class="section" style="background:var(--mist)"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Complete the routine</div><h2>Other products</h2></div></div><div class="grid">' + cards(others, D) + '</div></div></section>' : '');
      document.querySelectorAll('.thumbs button').forEach(function (b) {
        b.onclick = function () { $('#gmain').src = b.getAttribute('data-src'); document.querySelectorAll('.thumbs button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); };
      });
      ld({ '@context': 'https://schema.org', '@graph': [orgLd(D), { '@type': 'Product', name: p.brand + ' ' + p.name, description: p.summary, brand: { '@type': 'Brand', name: p.brand }, category: catName(D, p.category), size: p.volume,
        image: p.images.map(function (s) { return new URL(img(s), location.href).href; }), manufacturer: { '@type': 'Organization', name: D.company.name }, countryOfOrigin: 'KR' }] });
    },

    contact: function (D) {
      var c = D.company, k = D.contact, pre = qs.get('product');
      var opts = visible(D).map(function (p) { return '<option value="' + esc(p.name) + '"' + (p.id === pre ? ' selected' : '') + '>' + esc(p.brand + ' ' + p.name) + '</option>'; }).join('');
      $('#main').innerHTML =
        '<section class="ph-head"><div class="wrap"><div class="crumb"><a href="index.html">Home</a> / Contact</div><h1>' + esc(k.title) + '</h1><p class="lead">' + esc(k.lead) + '</p></div></section>' +
        '<section class="wrap ct"><form class="form" id="cf" novalidate>' +
        '<div class="row"><label><span>Name <i>*</i></span><input name="name" required autocomplete="name"></label><label><span>Company <i>*</i></span><input name="company" required autocomplete="organization"></label></div>' +
        '<div class="row"><label><span>Email <i>*</i></span><input name="email" type="email" required autocomplete="email"></label><label><span>Country <i>*</i></span><input name="country" required autocomplete="country-name"></label></div>' +
        '<div class="row"><label><span>Phone / WhatsApp</span><input name="phone" autocomplete="tel"></label><label><span>Inquiry type <i>*</i></span><select name="type" required>' + k.inquiryTypes.map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') + '</select></label></div>' +
        '<label><span>Product of interest</span><select name="product"><option value="">All products / not decided</option>' + opts + '</select></label>' +
        '<label><span>Message <i>*</i></span><textarea name="message" required placeholder="Tell us about your business, target market and the quantities you have in mind."></textarea></label>' +
        '<label class="chk"><input type="checkbox" name="agree" required><span>I agree that JAYSCOS may use the information above only to reply to this inquiry.</span></label>' +
        '<button class="btn" type="submit">Send inquiry ' + ARROW + '</button><div class="msg" id="cfmsg"></div></form>' +
        '<aside class="ct-side"><div><div class="k">Email</div><p><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a></p></div><div><div class="k">Telephone</div><p><a href="tel:' + esc(c.phone.replace(/[^+\d]/g, '')) + '">' + esc(c.phone) + '</a><br><span style="color:var(--muted);font-size:14px">' + esc(c.hours) + '</span></p></div>' +
        '<div><div class="k">Address</div><p>' + esc(c.address) + '</p></div><div><div class="k">Company</div><p>' + esc(c.name) + '<br><span style="color:var(--muted);font-size:14px">CEO ' + esc(c.ceo) + ' · Business Reg. No. ' + esc(c.bizNo) + '</span></p></div></aside></section>';
      $('#cf').onsubmit = function (e) {
        e.preventDefault();
        var f = e.target, msg = $('#cfmsg'), data = {};
        new FormData(f).forEach(function (v, key) { data[key] = v; });
        var bad = Array.prototype.filter.call(f.querySelectorAll('[required]'), function (el) { return el.type === 'checkbox' ? !el.checked : !el.value.trim(); });
        if (bad.length || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email || '')) { msg.className = 'msg err'; msg.textContent = 'Please fill in all required fields (*) with a valid email address and agree to the privacy notice.'; return; }
        var body = ['Name: ' + data.name, 'Company: ' + data.company, 'Email: ' + data.email, 'Country: ' + data.country, 'Phone: ' + (data.phone || '-'), 'Inquiry type: ' + data.type, 'Product: ' + (data.product || 'All products'), '', data.message].join('\n');
        var subject = '[Website inquiry] ' + data.type + ' - ' + data.company + ' (' + data.country + ')';
        if (k.formEndpoint) {
          fetch(k.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(Object.assign({ subject: subject, _subject: subject }, data)) })
            .then(function (r) { if (!r.ok) throw 0; msg.className = 'msg ok'; msg.textContent = 'Thank you. Your inquiry has been sent. We will reply to ' + data.email + ' soon.'; f.reset(); })
            .catch(function () { msg.className = 'msg err'; msg.textContent = 'Sending failed. Please email us directly at ' + k.formRecipient + '.'; });
        } else {
          location.href = 'mailto:' + k.formRecipient + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
          msg.className = 'msg ok'; msg.textContent = 'Your email app has opened with the inquiry filled in. Please press send to deliver it to ' + k.formRecipient + '.';
        }
      };
      ld({ '@context': 'https://schema.org', '@graph': [orgLd(D), { '@type': 'ContactPage', name: 'Contact ' + c.name }] });
    }
  };

  function reveal() {
    var els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  load(function (D) {
    header(D); footer(D);
    var pg = document.body.getAttribute('data-page');
    if (pages[pg]) pages[pg](D);
    reveal();
    if (qs.get('static') === '1') document.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
  });
})();
