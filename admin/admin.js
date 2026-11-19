/* JAYSCOS global site — admin. Edits data/site.js; drafts stay in this browser until published to GitHub. */
(function () {
  var PUB = null, D = null, view = 'dash', editId = null, editImgs = [];
  var K_DRAFT = 'jz_draft', K_TOKEN = 'jz_gh_token', K_AUTH = 'jz_auth';
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function src(s) { return /^(https?:|data:)/.test(s) ? s : '../' + s; }
  function get(o, path) { return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
  function set(o, path, v) { var ks = path.split('.'), last = ks.pop(); ks.reduce(function (a, k) { return a[k] = a[k] || {}; }, o)[last] = v; }
  function toast(t, err) { var e = $('#toast'); e.textContent = t; e.className = 'toast show' + (err ? ' err' : ''); clearTimeout(toast.t); toast.t = setTimeout(function () { e.className = 'toast'; }, 3600); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product-' + Date.now(); }
  function sha256(s) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); });
  }
  function b64(str) { return btoa(unescape(encodeURIComponent(str))); }
  function isDirty() { return JSON.stringify(D) !== JSON.stringify(PUB); }
  function saveDraft(msg) {
    if (isDirty()) localStorage.setItem(K_DRAFT, JSON.stringify(D)); else localStorage.removeItem(K_DRAFT);
    $('#dirty').hidden = !isDirty(); if (msg) toast(msg);
  }

  /* ---------- field helpers: data-k = path, data-t = text | lines | paras | csv | bool ---------- */
  function fval(el) {
    var t = el.getAttribute('data-t') || 'text', v = el.type === 'checkbox' ? el.checked : el.value;
    if (t === 'lines') return v.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
    if (t === 'paras') return v.split(/\n\s*\n/).map(function (x) { return x.replace(/\s*\n\s*/g, ' ').trim(); }).filter(Boolean);
    if (t === 'csv') return v.split(',').map(function (x) { return x.trim(); }).filter(Boolean);
    if (t === 'rows') {
      var fs = el.getAttribute('data-f').split(',');
      return v.split('\n').filter(function (l) { return l.trim(); }).map(function (l) { var p = l.split('|'), o = {}; fs.forEach(function (f, i) { o[f] = (p[i] || '').trim().replace(/\s*\/\/\s*/g, '\n'); }); return o; });
    }
    return t === 'bool' ? !!v : v.trim();
  }
  function rowsOf(obj, path, label, fields, n) { return rows(path, label, fields, n, obj); }
  function rows(path, label, fields, n, obj) {
    var v = (get(obj || D, path) || []).map(function (o) { return fields.map(function (f) { return String(o[f] || '').replace(/\n/g, ' // '); }).join(' | '); }).join('\n');
    return '<label><span>' + label + '</span><textarea data-k="' + path + '" data-t="rows" data-f="' + fields.join(',') + '" rows="' + (n + 1) + '" style="font-size:13px">' + esc(v) + '</textarea></label>';
  }
  function fshow(v, t) { if (t === 'lines') return (v || []).join('\n'); if (t === 'paras') return (v || []).join('\n\n'); if (t === 'csv') return (v || []).join(', '); return v == null ? '' : v; }
  function inp(obj, path, label, o) {
    o = o || {}; var t = o.t || 'text', v = fshow(get(obj, path), t), help = o.help ? '<small>' + o.help + '</small>' : '';
    if (o.area || t === 'lines' || t === 'paras') return '<label><span>' + label + '</span><textarea data-k="' + path + '" data-t="' + t + '" rows="' + (o.rows || 4) + '">' + esc(v) + '</textarea>' + help + '</label>';
    return '<label><span>' + label + '</span><input data-k="' + path + '" data-t="' + t + '" value="' + esc(v) + '"' + (o.ph ? ' placeholder="' + esc(o.ph) + '"' : '') + '>' + help + '</label>';
  }
  function collect(root, obj) { $$('[data-k]', root).forEach(function (el) { set(obj, el.getAttribute('data-k'), fval(el)); }); }

  /* ---------- views ---------- */
  var TITLES = { dash: 'Dashboard', products: 'Products', edit: 'Edit product', company: 'Company information', pages: 'Page content', contact: 'Contact form', publish: 'Publish & settings' };
  function go(v, id) {
    view = v; editId = id || null;
    $$('#menu a').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-v') === (v === 'edit' ? 'products' : v)); });
    $('#vt').textContent = TITLES[v]; $('.side').classList.remove('open');
    VIEWS[v](); scrollTo(0, 0);
  }

  var VIEWS = {
    dash: function () {
      var vis = D.products.filter(function (p) { return p.visible !== false; }).length, tok = !!localStorage.getItem(K_TOKEN);
      $('#view').innerHTML =
        '<div class="stats"><div class="stat"><div class="k">Products on site</div><div class="v">' + vis + ' <small>/ ' + D.products.length + ' total</small></div></div>' +
        '<div class="stat"><div class="k">Categories</div><div class="v">' + D.categories.length + '</div></div>' +
        '<div class="stat"><div class="k">Last published</div><div class="v" style="font-size:22px">' + esc(PUB.meta.updated || '-') + '</div></div>' +
        '<div class="stat"><div class="k">Inquiry delivery</div><div class="v" style="font-size:18px">' + (D.contact.formEndpoint ? 'Form service' : 'Email (mailto)') + '</div></div></div>' +
        '<div class="panel"><h3>Quick actions</h3><div class="actions"><button class="b pri" data-go="new">+ Add product</button><button class="b" data-go="products">Manage products</button><button class="b" data-go="company">Edit company info</button><a class="b" href="../index.html?draft=1" target="_blank" rel="noopener">Preview draft ↗</a><button class="b" data-go="publish">Publish</button></div></div>' +
        '<div class="panel"><h3>Products <small>Shown on the website in this order</small></h3>' + table(D.products, true) + '</div>' +
        '<div class="panel"><h3>Status</h3><ul class="check-list">' +
        '<li>' + (isDirty() ? '<span><b>You have unpublished changes.</b> They are saved in this browser only. Open “Publish & settings” to put them live.</span>' : '<span>Everything is published. The website shows the current content.</span>') + '</li>' +
        '<li><span>GitHub publishing token: ' + (tok ? '<b>connected in this browser</b>' : '<b>not set</b> (add it in Publish & settings to publish and upload images)') + '</span></li>' +
        '<li><span>Online payment is disabled. Product pages show an inquiry button instead of prices.</span></li></ul></div>';
      bindGo(); bindTable();
    },

    products: function () {
      $('#view').innerHTML = '<div class="panel"><h3>All products <button class="b pri" data-go="new">+ Add product</button></h3><p class="help">Use the arrows to change the order on the website. Hidden products are kept here but not shown publicly.</p>' + table(D.products, false) + '</div>' +
        '<div class="panel"><h3>Categories</h3><p class="help">One per line, as <span class="mono">id | Name</span>. The id is used in product settings.</p>' +
        '<textarea id="cats" rows="4">' + esc(D.categories.map(function (c) { return c.id + ' | ' + c.name; }).join('\n')) + '</textarea><div class="actions" style="margin-top:10px"><button class="b" id="saveCats">Save categories</button></div></div>';
      bindGo(); bindTable();
      $('#saveCats').onclick = function () {
        D.categories = $('#cats').value.split('\n').map(function (l) { var a = l.split('|'); return a.length > 1 ? { id: slug(a[0]), name: a[1].trim() } : null; }).filter(Boolean);
        saveDraft('Categories saved as draft');
      };
    },

    edit: function () {
      var isNew = editId === 'new', p = isNew ? { id: '', visible: true, category: (D.categories[0] || {}).id, brand: 'Myrié', line: 'Sea-Calm', origin: 'Made in Korea', images: [], ingredients: [], benefits: [], howToUse: [], evidence: [], cautions: [], badges: [] }
        : clone(D.products.filter(function (x) { return x.id === editId; })[0]);
      editImgs = (p.images || []).slice();
      $('#view').innerHTML =
        '<div class="panel"><h3>Basic information <span class="actions"><label style="margin:0;display:flex;gap:8px;align-items:center;font-weight:700"><input type="checkbox" data-k="visible" data-t="bool"' + (p.visible !== false ? ' checked' : '') + '> Show on website</label></span></h3>' +
        '<div class="g2">' + inp(p, 'name', 'Product name *') + inp(p, 'id', 'URL id (product.html?id=…)', { help: isNew ? 'Leave empty to create it from the name.' : 'Changing it changes the product page address.' }) + '</div>' +
        '<div class="g3"><label><span>Category</span><select data-k="category">' + D.categories.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === p.category ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select></label>' + inp(p, 'brand', 'Brand') + inp(p, 'line', 'Line') + '</div>' +
        inp(p, 'subtitle', 'Headline on the detail page') + inp(p, 'summaryLine', 'One-line summary on product cards') + inp(p, 'summary', 'Summary paragraph', { area: 1, rows: 4 }) + inp(p, 'badges', 'Badges (comma separated)', { t: 'csv' }) + inp(p, 'hoverImage', 'Card hover image (optional)') + '</div>' +
        '<div class="panel"><h3>Specifications</h3><div class="g2">' + inp(p, 'volume', 'Volume') + inp(p, 'texture', 'Texture') + inp(p, 'packaging', 'Packaging') + inp(p, 'origin', 'Origin') + inp(p, 'functional', 'Function / certification') + inp(p, 'skinType', 'Recommended for') + '</div></div>' +
        '<div class="panel"><h3>Images <small>First image = main image</small></h3><div class="imgs" id="imgs"></div>' +
        '<div class="row-add"><input id="imgUrl" placeholder="Image path (img/…) or https:// URL"><button class="b" id="addUrl">Add</button><label class="b" style="margin:0">Upload…<input type="file" id="upl" accept="image/*" hidden></label></div>' +
        '<small style="display:block;color:var(--muted);margin-top:6px;font-size:12px">Uploads go straight to the website’s image folder (GitHub token required). Recommended: square, at least 1000 px, under 500 KB (JPG/WebP).</small></div>' +
        '<div class="panel"><h3>Detail page content</h3><p class="help">Detail page photos are images 2–5 above, placed between sections.</p>' + rowsOf(p, 'points', 'Points: title | text', ['title', 'text'], 3) +
        inp(p, 'checklistTitle', 'Checklist title') + inp(p, 'checklist', 'Checklist (one per line)', { t: 'lines', rows: 4 }) + inp(p, 'benefits', 'Key benefits (one per line)', { t: 'lines', rows: 5 }) +
        '<label><span>Key ingredients</span></label><div id="ings"></div><button class="b sm" id="addIng" style="margin-bottom:18px">+ Add ingredient</button>' +
        inp(p, 'howToUse', 'How to use (one step per line)', { t: 'lines', rows: 4 }) + inp(p, 'evidence', 'Evidence & testing (one per line)', { t: 'lines', rows: 5 }) +
        inp(p, 'inci', 'Full ingredients (INCI)', { area: 1, rows: 5 }) + inp(p, 'cautions', 'Precautions (one per line)', { t: 'lines', rows: 4 }) + '</div>' +
        '<div class="sticky-save">' + (isNew ? '' : '<button class="b danger" id="del">Delete</button>') + '<button class="b" data-go="products">Cancel</button><button class="b pri" id="saveP">Save product</button></div>';
      renderImgs(); (p.ingredients || []).forEach(function (x) { addIng(x); });
      bindGo();
      $('#addIng').onclick = function () { addIng({ name: '', text: '' }); };
      $('#addUrl').onclick = function () { var v = $('#imgUrl').value.trim(); if (v) { editImgs.push(v); $('#imgUrl').value = ''; renderImgs(); } };
      $('#upl').onchange = function (e) { var f = e.target.files[0]; if (f) upload(f); e.target.value = ''; };
      if (!isNew) $('#del').onclick = function () {
        if (!confirm('Delete “' + p.name + '”? You can still undo this by discarding the draft before publishing.')) return;
        D.products = D.products.filter(function (x) { return x.id !== editId; }); saveDraft('Product deleted (draft)'); go('products');
      };
      $('#saveP').onclick = function () {
        var n = { images: editImgs.slice() }; collect($('#view'), n);
        n.ingredients = $$('#ings .ing-row').map(function (r) { return { name: r.children[0].value.trim(), text: r.children[1].value.trim() }; }).filter(function (x) { return x.name; });
        if (!n.name) return toast('Please enter a product name.', 1);
        n.id = slug(n.id || n.name);
        if (D.products.some(function (x) { return x.id === n.id && x.id !== editId; })) return toast('Another product already uses this URL id.', 1);
        if (!n.images.length) return toast('Please add at least one image.', 1);
        var merged = Object.assign(isNew ? {} : p, n);
        if (isNew) D.products.push(merged); else D.products = D.products.map(function (x) { return x.id === editId ? merged : x; });
        saveDraft('Product saved as draft'); go('products');
      };
    },

    company: function () {
      var c = D.company;
      $('#view').innerHTML = '<div class="panel"><h3>Company</h3><div class="g2">' + inp(D, 'company.name', 'Company name (English)') + inp(D, 'company.nameLocal', 'Company name (Korean)') + inp(D, 'company.ceo', 'CEO') + inp(D, 'company.bizNo', 'Business registration no.') + inp(D, 'company.founded', 'Founded') + '</div>' +
        inp(D, 'company.address', 'Address (English)') + '<div class="g3">' + inp(D, 'company.phone', 'Mobile / telephone') + inp(D, 'company.fax', 'Fax') + inp(D, 'company.email', 'Email') + '</div>' + inp(D, 'company.hours', 'Business hours') + '</div>' +
        '<div class="panel"><h3>Brand &amp; channels</h3><div class="g2">' + inp(D, 'company.corporateSlogan', 'Corporate slogan') + inp(D, 'company.productBrand', 'Product brand') + inp(D, 'company.productSlogan', 'Product brand slogan') + inp(D, 'company.website', 'Website') +
        inp(D, 'company.instagram', 'Instagram URL') + inp(D, 'company.blog', 'Blog URL') + inp(D, 'company.smartstore', 'Korean online store URL') + '</div></div>' +
        '<div class="sticky-save"><button class="b pri" id="save">Save</button></div>';
      $('#save').onclick = function () { collect($('#view'), D); saveDraft('Company information saved as draft'); };
    },

    pages: function () {
      var h = D.home;
      $('#view').innerHTML = '<div class="panel"><h3>Home page</h3><p class="help">List fields: one item per line, fields separated by <span class="mono">|</span>. Use <span class="mono">//</span> for a line break inside a headline.</p>' +
        inp(D, 'home.topbar', 'Top notice bar (one message per line)', { t: 'lines', rows: 3 }) +
        rows('home.slides', 'Hero slides: PC image | mobile image | label | headline | text | button link | button text | 2nd link | 2nd button text | image description', ['image', 'imageMo', 'eyebrow', 'title', 'lead', 'link', 'linkLabel', 'link2', 'link2Label', 'alt'], 3) +
        '<div class="g3">' + inp(D, 'home.video.src', 'Brand video file') + inp(D, 'home.video.poster', 'Video poster image') + inp(D, 'home.video.product', 'Product shown on video (id)') + '</div>' +
        '<div class="g2">' + inp(D, 'home.video.note', 'Video card text') + inp(D, 'home.video.tag', 'Video tag') + '</div>' +
        inp(D, 'home.concernsTitle', 'Skin concern section title') + inp(D, 'home.concernsSub', 'Skin concern section subtitle') +
        rows('home.concerns', 'Skin concern tabs: tab | label | title | text | image | link | button text', ['tab', 'eyebrow', 'title', 'text', 'image', 'link', 'linkLabel'], 6) +
        inp(D, 'home.storyTitle', 'Brand story title') + inp(D, 'home.storyText', 'Brand story (paragraphs)', { t: 'paras', rows: 6 }) + inp(D, 'home.storyChips', 'Brand story chips (comma separated)', { t: 'csv' }) +
        inp(D, 'home.gallery', 'Photo gallery images (one path per line)', { t: 'lines', rows: 6 }) + '</div>' +
        '<div class="panel"><h3>Brand page (Myrié)</h3>' + '<div class="g3">' + inp(D, 'brand.title', 'Brand name') + inp(D, 'brand.slogan', 'Slogan') + inp(D, 'brand.heroImage', 'Top image') + '</div>' +
        inp(D, 'brand.promise', 'Brand promise (quote)') + inp(D, 'brand.intro', 'Introduction (paragraphs)', { t: 'paras', rows: 6 }) + inp(D, 'brand.nameMeaning', 'Meaning of the name', { area: 1, rows: 3 }) +
        rows('about.approach', 'Care approach: step | text', ['step', 'text'], 4) + inp(D, 'brand.approachImages', 'Care approach images (one per line, same order)', { t: 'lines', rows: 4 }) +
        inp(D, 'brand.lineText', 'Sea-Calm line text', { area: 1, rows: 3 }) + rows('brand.routine', 'Routine: step | product name | text | image | link', ['step', 'name', 'text', 'image', 'link'], 2) +
        inp(D, 'about.ingredientTitle', 'Key ingredient title') + inp(D, 'about.ingredientText', 'Key ingredient text', { area: 1, rows: 4 }) +
        inp(D, 'brand.recommended', 'Recommended for (one per line)', { t: 'lines', rows: 6 }) + rows('brand.values', 'Values: title | text', ['title', 'text'], 4) + '</div>' +
        '<div class="panel"><h3>FAQ page</h3>' + rows('faq', 'Questions: question | answer', ['q', 'a'], 10) + '</div>' +
        '<div class="panel"><h3>About page (company introduction)</h3><p class="help">Blank line between paragraphs. List fields: one item per line, fields separated by <span class="mono">|</span>.</p>' +
        inp(D, 'about.title', 'Headline') + inp(D, 'about.heroImage', 'Top image path') + inp(D, 'about.intro', 'Who is JAYSCOS (paragraphs)', { t: 'paras', rows: 7 }) +
        rows('about.keyFacts', 'Key facts: value | label', ['value', 'label'], 4) +
        rows('about.history', 'History: date | title | details (separate details with ;)', ['date', 'title', 'items'], 9) +
        inp(D, 'about.philosophyTitle', 'Philosophy title') + inp(D, 'about.philosophyImage', 'Philosophy image path') + inp(D, 'about.philosophy', 'Philosophy & value (paragraphs)', { t: 'paras', rows: 7 }) +
        inp(D, 'about.brandText', 'Our brand (paragraphs)', { t: 'paras', rows: 6 }) + inp(D, 'about.researchText', 'Research & formulation (paragraphs)', { t: 'paras', rows: 6 }) +
        inp(D, 'about.qualityText', 'Quality management', { area: 1, rows: 4 }) + inp(D, 'about.ipIntro', 'Intellectual property intro', { area: 1, rows: 3 }) +
        rows('about.patents', 'Patents: kind | title | details | description | image path', ['kind', 'title', 'meta', 'text', 'image'], 4) +
        rows('about.certificates', 'Certifications: title | description | image path', ['title', 'text', 'image'], 6) +
        inp(D, 'about.globalText', 'Global business text', { area: 1, rows: 5 }) +
        rows('about.mous', 'MOUs: year | country | value | description | image path', ['year', 'country', 'value', 'text', 'image'], 3) + '</div>' +
        '<div class="sticky-save"><button class="b pri" id="save">Save</button></div>';
      $('#save').onclick = function () {
        $$('[data-k]', $('#view')).forEach(function (el) {
          var k = el.getAttribute('data-k'), m = k.match(/^home\.highlights\.(\d+)\.(title|text)$/);
          if (m) D.home.highlights[+m[1]][m[2]] = el.value.trim(); else set(D, k, fval(el));
        });
        saveDraft('Page content saved as draft');
      };
    },

    contact: function () {
      $('#view').innerHTML = '<div class="panel"><h3>Contact page</h3>' + inp(D, 'contact.title', 'Headline') + inp(D, 'contact.lead', 'Intro text', { area: 1, rows: 3 }) + inp(D, 'contact.inquiryTypes', 'Inquiry types (one per line)', { t: 'lines', rows: 6 }) + '</div>' +
        '<div class="panel"><h3>Inquiry delivery</h3><p class="help">Without a form service, the Send button opens the visitor’s email app with the inquiry already written, addressed to the recipient below. To receive inquiries directly (no email app needed), create a free form endpoint (for example Formspree or Web3Forms) for the recipient address and paste its URL here.</p>' +
        inp(D, 'contact.formRecipient', 'Recipient email') + inp(D, 'contact.formEndpoint', 'Form service endpoint URL (optional)', { ph: 'https://…' }) + '</div>' +
        '<div class="sticky-save"><button class="b pri" id="save">Save</button></div>';
      $('#save').onclick = function () { collect($('#view'), D); saveDraft('Contact settings saved as draft'); };
    },

    publish: function () {
      var tok = localStorage.getItem(K_TOKEN) || '';
      $('#view').innerHTML =
        '<div class="panel"><h3>Publish changes</h3><p class="help">' + (isDirty() ? 'There are unpublished changes in this browser.' : 'No unpublished changes.') + ' Publishing updates the live website in about one minute.</p>' +
        '<div class="actions"><button class="b pri" id="pub">Publish now</button><a class="b" href="../index.html?draft=1" target="_blank" rel="noopener">Preview draft ↗</a><button class="b danger" id="discard">Discard draft</button></div></div>' +
        '<div class="panel"><h3>GitHub connection</h3><p class="help">The website is hosted on GitHub Pages. Publishing writes <span class="mono">data/site.js</span> to the repository. Use a fine-grained personal access token limited to this repository with “Contents: Read and write”. The token is stored only in this browser.</p>' +
        '<div class="g2">' + inp(D, 'admin.repo', 'Repository (owner/name)') + inp(D, 'admin.branch', 'Branch') + '</div>' +
        '<label><span>Access token</span><input type="password" id="tok" value="' + esc(tok) + '" autocomplete="off" placeholder="github_pat_…"></label>' +
        '<div class="actions"><button class="b" id="saveTok">Save connection</button><button class="b" id="testTok">Test connection</button><button class="b danger" id="clrTok">Remove token from this browser</button></div></div>' +
        '<div class="panel"><h3>Backup</h3><p class="help">Download all content as a file, or restore from a backup file (restored content becomes a draft).</p><div class="actions"><button class="b" id="exp">Download backup (.json)</button><label class="b" style="margin:0">Restore backup…<input type="file" id="imp" accept=".json,application/json" hidden></label></div></div>' +
        '<div class="panel"><h3>Admin password</h3><p class="help">The new password takes effect after you publish.</p><div class="g2"><label><span>New password</span><input type="password" id="np1" autocomplete="new-password"></label><label><span>Repeat new password</span><input type="password" id="np2" autocomplete="new-password"></label></div><button class="b" id="chpw">Change password</button></div>';
      $('#pub').onclick = publish;
      $('#discard').onclick = function () { if (!isDirty()) return toast('Nothing to discard.'); if (confirm('Discard all unpublished changes?')) { D = clone(PUB); saveDraft('Draft discarded'); go('publish'); } };
      $('#saveTok').onclick = function () { collect($('#view'), D); var t = $('#tok').value.trim(); if (t) localStorage.setItem(K_TOKEN, t); saveDraft('Connection saved'); };
      $('#clrTok').onclick = function () { localStorage.removeItem(K_TOKEN); $('#tok').value = ''; toast('Token removed from this browser'); };
      $('#testTok').onclick = function () { gh('GET', '/repos/' + D.admin.repo).then(function (r) { toast(r.ok ? 'Connected to ' + D.admin.repo + (r.body.permissions && r.body.permissions.push ? ' (write access)' : ' (read only)') : 'Connection failed (' + r.status + ')', !r.ok); }); };
      $('#exp').onclick = function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(D, null, 2)], { type: 'application/json' })); a.download = 'jayscos-site-backup-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); };
      $('#imp').onchange = function (e) {
        var f = e.target.files[0]; if (!f) return; var r = new FileReader();
        r.onload = function () { try { var d = JSON.parse(r.result); if (!d.products || !d.company) throw 0; d.admin = D.admin; D = d; saveDraft('Backup restored as draft'); go('dash'); } catch (x) { toast('This is not a valid backup file.', 1); } };
        r.readAsText(f);
      };
      $('#chpw').onclick = function () {
        var a = $('#np1').value, b = $('#np2').value;
        if (a.length < 8) return toast('Use at least 8 characters.', 1); if (a !== b) return toast('The passwords do not match.', 1);
        sha256(a).then(function (h) { D.admin.passHash = h; $('#np1').value = $('#np2').value = ''; saveDraft('Password changed. Publish to apply it.'); });
      };
    }
  };

  function table(list, compact) {
    if (!list.length) return '<div class="empty">No products yet.</div>';
    return '<table><thead><tr><th></th><th>Product</th><th class="hide-m">Category</th><th class="hide-m">Volume</th><th>Status</th>' + (compact ? '' : '<th>Order</th>') + '<th></th></tr></thead><tbody>' +
      list.map(function (p, i) {
        var cat = (D.categories.filter(function (c) { return c.id === p.category; })[0] || {}).name || p.category;
        return '<tr><td><img class="th" src="' + esc(src(p.images[0] || '')) + '" alt=""></td><td><b>' + esc(p.name) + '</b><span class="s">' + esc(p.id) + '</span></td><td class="hide-m">' + esc(cat) + '</td><td class="hide-m">' + esc(p.volume) + '</td>' +
          '<td><button class="tag' + (p.visible === false ? ' off' : '') + '" data-vis="' + esc(p.id) + '" style="border:0;cursor:pointer" title="Click to toggle">' + (p.visible === false ? 'Hidden' : 'Visible') + '</button></td>' +
          (compact ? '' : '<td><div class="ord"><button class="b sm" data-mv="' + i + ',-1"' + (i ? '' : ' disabled') + '>↑</button><button class="b sm" data-mv="' + i + ',1"' + (i < list.length - 1 ? '' : ' disabled') + '>↓</button></div></td>') +
          '<td style="text-align:right;white-space:nowrap"><a class="b sm" href="../product.html?id=' + encodeURIComponent(p.id) + '&draft=1" target="_blank" rel="noopener">View</a> <button class="b sm" data-edit="' + esc(p.id) + '">Edit</button></td></tr>';
      }).join('') + '</tbody></table>';
  }
  function bindTable() {
    $$('[data-edit]').forEach(function (b) { b.onclick = function () { go('edit', b.getAttribute('data-edit')); }; });
    $$('[data-vis]').forEach(function (b) { b.onclick = function () { var p = D.products.filter(function (x) { return x.id === b.getAttribute('data-vis'); })[0]; p.visible = p.visible === false; saveDraft(p.name + (p.visible ? ' is now visible' : ' is now hidden') + ' (draft)'); VIEWS[view](); }; });
    $$('[data-mv]').forEach(function (b) { b.onclick = function () { var a = b.getAttribute('data-mv').split(',').map(Number), i = a[0], j = i + a[1], t = D.products[i]; D.products[i] = D.products[j]; D.products[j] = t; saveDraft('Order changed (draft)'); VIEWS[view](); }; });
  }
  function bindGo() { $$('[data-go]').forEach(function (b) { b.onclick = function () { var g = b.getAttribute('data-go'); g === 'new' ? go('edit', 'new') : go(g); }; }); }
  function addIng(x) {
    var d = document.createElement('div'); d.className = 'ing-row';
    d.innerHTML = '<input placeholder="Ingredient" value="' + esc(x.name) + '"><input placeholder="What it does" value="' + esc(x.text) + '"><button title="Remove">×</button>';
    d.lastChild.onclick = function () { d.remove(); }; $('#ings').appendChild(d);
  }
  function renderImgs() {
    $('#imgs').innerHTML = editImgs.length ? editImgs.map(function (s, i) {
      return '<div class="im">' + (i ? '' : '<span class="first">MAIN</span>') + '<img src="' + esc(src(s)) + '" alt="" title="' + esc(s) + '"><div class="ctl"><button data-i="' + i + '" data-a="l"' + (i ? '' : ' disabled') + '>←</button><button data-i="' + i + '" data-a="m">Main</button><button data-i="' + i + '" data-a="x">×</button></div></div>';
    }).join('') : '<div class="empty" style="padding:20px">No images yet.</div>';
    $$('#imgs button').forEach(function (b) {
      b.onclick = function () {
        var i = +b.getAttribute('data-i'), a = b.getAttribute('data-a');
        if (a === 'x') editImgs.splice(i, 1); else if (a === 'm') editImgs.unshift(editImgs.splice(i, 1)[0]); else if (a === 'l') { var t = editImgs[i - 1]; editImgs[i - 1] = editImgs[i]; editImgs[i] = t; }
        renderImgs();
      };
    });
  }

  /* ---------- GitHub ---------- */
  function gh(method, path, body) {
    var tok = localStorage.getItem(K_TOKEN);
    if (!tok) return Promise.resolve({ ok: false, status: 0, body: { message: 'No access token. Add it in Publish & settings.' } });
    return fetch('https://api.github.com' + path, { method: method, headers: { Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json' }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, status: r.status, body: j }; }); })
      .catch(function (e) { return { ok: false, status: 0, body: { message: String(e) } }; });
  }
  function putFile(path, contentB64, message) {
    var url = '/repos/' + D.admin.repo + '/contents/' + path;
    return gh('GET', url + '?ref=' + encodeURIComponent(D.admin.branch)).then(function (r) {
      var body = { message: message, content: contentB64, branch: D.admin.branch };
      if (r.ok && r.body.sha) body.sha = r.body.sha;
      return gh('PUT', url, body);
    });
  }
  function publish() {
    if (!localStorage.getItem(K_TOKEN)) { toast('Add a GitHub access token first (Publish & settings).', 1); return go('publish'); }
    if (!isDirty()) return toast('No changes to publish.');
    var out = clone(D); out.meta.updated = new Date().toISOString().slice(0, 10);
    toast('Publishing…');
    putFile('data/site.js', b64('window.SITE_DATA = ' + JSON.stringify(out, null, 2) + ';\n'), 'Update site content from admin').then(function (r) {
      if (!r.ok) return toast('Publish failed: ' + (r.body.message || r.status), 1);
      PUB = clone(out); D = clone(out); localStorage.removeItem(K_DRAFT); $('#dirty').hidden = true;
      toast('Published. The live site updates in about a minute.'); VIEWS[view]();
    });
  }
  function upload(f) {
    if (!localStorage.getItem(K_TOKEN)) return toast('Image upload needs the GitHub token (Publish & settings). You can also add an image URL.', 1);
    if (f.size > 3 * 1024 * 1024) return toast('Please use an image under 3 MB.', 1);
    var name = 'img/uploads/' + Date.now() + '-' + f.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
    var r = new FileReader(); toast('Uploading image…');
    r.onload = function () {
      putFile(name, r.result.split(',')[1], 'Upload image ' + name).then(function (res) {
        if (!res.ok) return toast('Upload failed: ' + (res.body.message || res.status), 1);
        editImgs.push(name); renderImgs(); toast('Uploaded. It appears on the live site about a minute after publishing.');
      });
    };
    r.readAsDataURL(f);
  }

  /* ---------- boot ---------- */
  function start() {
    $('#login').hidden = true; $('#app').hidden = false;
    var dr = null; try { dr = JSON.parse(localStorage.getItem(K_DRAFT) || 'null'); } catch (e) {}
    D = dr && dr.products ? dr : clone(PUB);
    $('#dirty').hidden = !isDirty(); $('#pv').href = '../index.html?draft=1';
    $$('#menu a').forEach(function (a) { a.onclick = function () { go(a.getAttribute('data-v')); }; });
    $('#pubTop').onclick = publish; $('#mb').onclick = function () { $('.side').classList.toggle('open'); };
    $('#logout').onclick = function () { sessionStorage.removeItem(K_AUTH); location.reload(); };
    go('dash');
  }
  var s = document.createElement('script');
  s.src = '../data/site.js?t=' + Date.now();
  s.onload = function () {
    PUB = clone(window.SITE_DATA);
    if (sessionStorage.getItem(K_AUTH) === PUB.admin.passHash) return start();
    $('#pw').focus();
    $('#lf').onsubmit = function (e) {
      e.preventDefault();
      if (!window.crypto || !crypto.subtle) { $('#lerr').textContent = 'Please open the admin page over https.'; return; }
      sha256($('#pw').value).then(function (h) {
        if (h === PUB.admin.passHash) { sessionStorage.setItem(K_AUTH, h); start(); } else { $('#lerr').textContent = 'Incorrect password.'; $('#pw').select(); }
      });
    };
  };
  document.head.appendChild(s);
})();
