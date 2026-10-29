// Funciona offline: guarda a casca do app. Rede primeiro, cache quando estiver sem internet.
const VERSAO = 'ier-v1';
const CASCA = ['./', 'index.html', 'css/app.css', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png',
  'js/app.js', 'js/config.js', 'js/store.js', 'js/ui.js', 'js/icons.js', 'js/instalar.js', 'js/analise.js', 'js/prompt.js', 'js/redacao.js', 'js/escolherTema.js',
  'js/dados/matriz.js', 'js/dados/temas.js', 'js/dados/checklist.js',
  'js/views/inicio.js', 'js/views/redacoes.js', 'js/views/escrever.js', 'js/views/avaliar.js', 'js/views/treino.js', 'js/views/proposta.js', 'js/views/progresso.js', 'js/views/competencias.js', 'js/views/ajustes.js', 'js/views/mais.js'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(CASCA)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then((resp) => { const c = resp.clone(); caches.open(VERSAO).then((k) => k.put(e.request, c)); return resp; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))));
});
