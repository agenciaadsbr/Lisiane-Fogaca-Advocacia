/* Registro de visitas e leads no Supabase (lp_visits / lp_leads) + Pixel do Meta */
(function () {
  var C = window.LP_CONFIG || {};

  function store(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  function read(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }

  // Origem do lead: UTMs > clid > referrer > direto. Fica salva na sessão.
  function computeOrigem() {
    var p = new URLSearchParams(location.search);
    var src = p.get('utm_source'), med = p.get('utm_medium'), camp = p.get('utm_campaign');
    if (src || med || camp) return [src, med, camp].filter(Boolean).join(' / ').slice(0, 200);
    if (p.get('fbclid')) return 'meta';
    if (p.get('gclid') || p.get('gbraid') || p.get('wbraid')) return 'google';
    if (document.referrer) {
      try {
        var h = new URL(document.referrer).hostname.replace(/^www\./, '');
        if (h && h !== location.hostname) return h;
      } catch (e) {}
    }
    return 'direto';
  }
  var saved = read('lp_origem');
  var fresh = computeOrigem();
  if (!saved || (fresh !== 'direto' && fresh !== saved)) { store('lp_origem', fresh); saved = fresh; }

  function insert(table, row) {
    if (!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY) return Promise.reject(new Error('Supabase não configurado'));
    return fetch(C.SUPABASE_URL + '/rest/v1/' + table, {
      method: 'POST',
      keepalive: true,
      headers: {
        'apikey': C.SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + C.SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(row)
    }).then(function (r) {
      if (!r.ok) throw new Error('Supabase ' + r.status);
      return true;
    });
  }

  // Pixel do Meta (opcional)
  function loadPixel() {
    if (!C.META_PIXEL_ID || window.fbq) return;
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', C.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }
  loadPixel();

  window.LP = {
    origem: function () { return read('lp_origem') || 'direto'; },
    trackVisit: function () {
      // 1 registro por carregamento da página (mesmo padrão das demais LPs ADS BR)
      insert('lp_visits', {
        site: C.SITE,
        path: location.pathname + location.search,
        referrer: document.referrer || null
      }).catch(function () {});
    },
    saveLead: function (nome, whatsapp) {
      return insert('lp_leads', {
        site: C.SITE,
        nome: nome,
        whatsapp: whatsapp,
        origem: window.LP.origem()
      });
    },
    pixel: function (ev) { if (window.fbq) window.fbq('track', ev); },
    store: store,
    read: read
  };
})();
