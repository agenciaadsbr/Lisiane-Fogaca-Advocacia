/*
 * Configuração da LP Lisiane Fogaça Advocacia
 * Edite SOMENTE este arquivo para trocar número de WhatsApp, Pixel etc.
 *
 * A chave abaixo é a chave pública (anon) do Supabase "ADS BR CLIENTES".
 * Ela pode ficar no front-end: as políticas RLS só permitem que o público
 * INSIRA visitas e leads; a leitura exige login no painel.
 */
window.LP_CONFIG = {
  SITE: 'lisiane-fogaca',

  SUPABASE_URL: 'https://qxhnjzyhtllmtdrcyygi.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4aG5qenlodGxsbXRkcmN5eWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMzczNjgsImV4cCI6MjA5NzgxMzM2OH0.DWf4I_x9F--H7ZZHUt_n4V3B__Nlsf1jNZdUV0vNBLU',

  // WhatsApp do escritório: só dígitos, com 55 + DDD. Ex.: '5511999999999'
  WHATSAPP_NUMBER: '55XXXXXXXXXXX',

  // Mensagem enviada quando o lead abre o WhatsApp pela página /redirect
  WHATSAPP_MESSAGE: 'Olá! Me chamo {nome} e acabei de preencher o formulário no site. Gostaria de falar sobre meu caso.',

  // ID do Pixel do Meta (deixe vazio para desativar). Ex.: '123456789012345'
  META_PIXEL_ID: '',

  // Segundos até abrir o WhatsApp automaticamente na /redirect
  REDIRECT_SECONDS: 5,

  // Painel /dashboard
  DASHBOARD_TITLE: 'LISIANE FOGAÇA ADVOCACIA',
  DASHBOARD_LOGIN_EMAIL: 'admin@lisiane-fogaca.adsbr.internal',
  DASHBOARD_USER: 'Admin',
  WHATSAPP_LEAD_MESSAGE: 'Olá, {nome}. Recebemos seu contato através da Lisiane Fogaça Advocacia e gostaria de dar continuidade ao seu atendimento.'
};
