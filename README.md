# LP Lisiane Fogaça Advocacia — Direito Bancário

Site estático (HTML/CSS/JS puro, sem build) pronto para GitHub + Vercel.

| Rota | Arquivo | O que faz |
|---|---|---|
| `/` | `index.html` | Landing page. Registra 1 visita por carregamento e salva o lead do formulário |
| `/redirect` | `redirect.html` | Página de obrigado. Dispara o evento `Lead` do Pixel (se configurado) e abre o WhatsApp após 5 s |
| `/dashboard` | `dashboard.html` | Painel de leads com login (Supabase Auth + RLS) |

## Configuração — edite só `assets/js/config.js`

- `WHATSAPP_NUMBER` — **obrigatório antes de publicar**. Só dígitos: `55` + DDD + número.
- `META_PIXEL_ID` — opcional. Com ele preenchido, a LP envia `PageView` e a /redirect envia `Lead`.
- `REDIRECT_SECONDS` — segundos até abrir o WhatsApp (padrão 5).
- `SITE` (`lisiane-fogaca`), `SUPABASE_URL` e `SUPABASE_ANON_KEY` já estão preenchidos com o projeto **ADS BR CLIENTES** (`qxhnjzyhtllmtdrcyygi`). A anon key é pública por natureza: o RLS só deixa o público **inserir** em `lp_visits`/`lp_leads`; ler exige login.

## Dados (Supabase)

- Tabelas: `lp_visits` (site, path, referrer) e `lp_leads` (site, nome, whatsapp, origem).
- `origem` do lead: `utm_source / utm_medium / utm_campaign` → `meta` (fbclid) → `google` (gclid) → domínio de referência → `direto`. Fica salva na sessão, então a UTM da primeira página vale até o envio.
- WhatsApp é gravado como `55` + DDD + número (só dígitos).
- Login do painel: usuário `Admin` (mapeado para `admin@lisiane-fogaca.adsbr.internal`). A leitura passa por `pode_ver_site(site)` + `lp_acessos`, então esse login só enxerga os dados da Lisiane. A senha não fica neste repositório.

## Publicar

1. Crie um repositório no GitHub (ex.: `lp-lisiane-fogaca`) e envie todos os arquivos desta pasta (a raiz do repo é onde está o `index.html`).
2. Na Vercel: **Add New → Project → Import** o repositório. Framework Preset: **Other**. Build Command e Output Directory: deixe em branco.
3. Deploy. O `vercel.json` já ativa URLs limpas (`/redirect`, `/dashboard`) e marca painel e obrigado como `noindex`.
4. Domínio próprio: Vercel → Settings → Domains.

## Testar depois de publicar

1. Abra `/?utm_source=teste` → gera 1 visita.
2. Envie o formulário → deve ir para `/redirect` e abrir o WhatsApp.
3. Entre em `/dashboard` → a visita e o lead aparecem (origem `teste`).

## Estrutura

```
index.html
redirect.html
dashboard.html
vercel.json
robots.txt
assets/
  css/lp.css
  js/config.js      ← configuração
  js/tracking.js    ← grava visita/lead no Supabase + Pixel
  js/lp.js          ← animações de fallback e formulário
  img/              ← fotos, logos e favicons
```

Conteúdo em conformidade com o Provimento 205/2021 da OAB: sem promessa de resultado ou prazo.
