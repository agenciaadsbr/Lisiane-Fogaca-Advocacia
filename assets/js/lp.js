/* LP: visita, animações de fallback e formulário */
(function () {
  // 1) Registra a visita
  if (window.LP) window.LP.trackVisit();

  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // 2) Revelar ao rolar (só quando o navegador não tem animation-timeline)
  if (document.documentElement.classList.contains('io')) {
    var els = document.querySelectorAll('.rv, .rv-clip, .draw');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      els.forEach(function (el) { io.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('in'); });
    }
  }

  // 3) Formulário
  var form = document.getElementById('lead-form');
  if (!form) return;
  var nome = document.getElementById('f-nome');
  var tel = document.getElementById('f-tel');
  var hp = document.getElementById('f-site');
  var btn = document.getElementById('f-btn');
  var btnTxt = document.getElementById('f-btn-txt');
  var msg = document.getElementById('f-msg');
  var fNome = document.getElementById('fld-nome');
  var fTel = document.getElementById('fld-tel');
  var tried = false;

  function mask(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);
    d = d.slice(0, 11);
    if (!d.length) return '';
    if (d.length < 3) return '(' + d;
    if (d.length < 7) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length < 11) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }
  function digits() { return tel.value.replace(/\D/g, ''); }
  function nameOk() { return nome.value.trim().replace(/\s+/g, ' ').length >= 3; }
  function telOk() {
    var d = digits();
    return (d.length === 10 || d.length === 11) && !/^(\d)\1+$/.test(d) && d[0] !== '0';
  }
  function validate() {
    fNome.classList.toggle('bad', tried && !nameOk());
    fTel.classList.toggle('bad', tried && !telOk());
    nome.setAttribute('aria-invalid', tried && !nameOk() ? 'true' : 'false');
    tel.setAttribute('aria-invalid', tried && !telOk() ? 'true' : 'false');
    return nameOk() && telOk();
  }

  tel.addEventListener('input', function () {
    var end = tel.selectionStart === tel.value.length;
    tel.value = mask(tel.value);
    if (end) tel.setSelectionRange(tel.value.length, tel.value.length);
    if (tried) validate();
  });
  nome.addEventListener('input', function () { if (tried) validate(); });

  function goRedirect(n) {
    var first = n.split(' ')[0];
    if (window.LP) window.LP.store('lp_lead_nome', first);
    location.href = '/redirect';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    tried = true;
    msg.classList.remove('on');
    if (!validate()) {
      (nameOk() ? tel : nome).focus();
      return;
    }
    if (hp && hp.value) return; // bot

    var n = nome.value.trim().replace(/\s+/g, ' ');
    var w = '55' + digits();

    btn.disabled = true;
    btn.classList.add('sending');
    btnTxt.textContent = 'Enviando…';

    var done = false;
    function finish() { if (done) return; done = true; goRedirect(n); }

    // Envia o lead; se a rede travar, segue para o WhatsApp mesmo assim após 6s
    var timer = setTimeout(finish, 6000);
    window.LP.saveLead(n, w).then(function () {
      clearTimeout(timer); finish();
    }).catch(function () {
      clearTimeout(timer); finish();
    });
  });
})();
