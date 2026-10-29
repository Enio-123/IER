// Casca do app: navegação, HUD e roteamento por hash.
import { carregar, S, sequencia, aoMudar, diffDias, hojeStr } from './store.js';
import { ic } from './icons.js';
import { esc } from './ui.js';
import { APP } from './config.js';
import { instalado, instalar, aoMudarInstalacao, ofertarInstalacao } from './instalar.js';

const NAV = [
  { r: 'inicio', rot: 'Início', ic: 'house' },
  { r: 'redacoes', rot: 'Redações', ic: 'pencil' },
  { r: 'treino', rot: 'Treino de parágrafo', ic: 'file-text' },
  { r: 'proposta', rot: 'Montar proposta', ic: 'target' },
  { r: 'progresso', rot: 'Progresso', ic: 'bar-chart-2' },
  { sep: true },
  { r: 'competencias', rot: 'As 5 competências', ic: 'book-open' },
  { r: 'ajustes', rot: 'Ajustes', ic: 'settings' },
];
const ABAS = [['inicio', 'Início', 'house'], ['redacoes', 'Redações', 'pencil'], ['treino', 'Parágrafo', 'file-text'], ['proposta', 'Proposta', 'target'], ['mais', 'Mais', 'ellipsis']];

const ROTAS = {
  inicio: () => import('./views/inicio.js'),
  redacoes: () => import('./views/redacoes.js'),
  escrever: () => import('./views/escrever.js'),
  avaliar: () => import('./views/avaliar.js'),
  treino: () => import('./views/treino.js'),
  proposta: () => import('./views/proposta.js'),
  progresso: () => import('./views/progresso.js'),
  competencias: () => import('./views/competencias.js'),
  ajustes: () => import('./views/ajustes.js'),
  mais: () => import('./views/mais.js'),
};
// Rotas internas acendem a aba de onde vieram.
const PAI = { escrever: 'redacoes', avaliar: 'redacoes' };
const TITULOS = { inicio: 'Início', redacoes: 'Redações', escrever: 'Escrever', avaliar: 'Correção', treino: 'Treino de parágrafo', proposta: 'Montar proposta', progresso: 'Progresso', competencias: 'As 5 competências', ajustes: 'Ajustes', mais: 'Mais' };

let limpar = null;

function casca() {
  document.getElementById('app').innerHTML = `
  <div class="app">
    <nav class="lateral" aria-label="Navegação principal">
      <div class="marca"><span class="logo-box" aria-hidden="true">R</span><span>${esc(APP.nome)}<small>${esc(APP.longo)}</small></span></div>
      ${NAV.map((n) => n.sep ? '<div class="nav-sep"></div>' : `<a class="nav-item" href="#/${n.r}" data-r="${n.r}">${ic(n.ic)}<span>${n.rot}</span></a>`).join('')}
    </nav>
    <div class="principal">
      <header class="hud"><span class="hud-titulo" id="hud-titulo"></span><div class="hud-info" id="hud-info"></div></header>
      <main class="conteudo" id="tela" tabindex="-1"></main>
    </div>
    <nav class="abas-baixo" aria-label="Navegação">
      ${ABAS.map(([r, rot, i]) => `<a href="#/${r}" data-r="${r}">${ic(i, 22)}<span>${rot}</span></a>`).join('')}
    </nav>
  </div>`;
}

export function hud() {
  const el = document.getElementById('hud-info');
  if (!el) return;
  const dias = S.perfil.dataProva ? diffDias(hojeStr(), S.perfil.dataProva) : null;
  el.innerHTML = `
    ${!instalado() ? `<button class="hud-foco" id="hud-instalar" title="Instalar o IER como app">${ic('download', 14)}Instalar</button>` : ''}
    ${dias !== null && dias >= 0 ? `<span title="Dias até a redação do ENEM">${ic('flag', 15)}${dias === 0 ? 'É hoje' : dias + (dias === 1 ? ' dia' : ' dias')}</span>` : ''}
    <span title="Dias seguidos escrevendo">${ic('flame', 15)}${sequencia()}</span>`;
  const bi = document.getElementById('hud-instalar'); if (bi) bi.onclick = instalar;
}

// Telas internas podem acender outra aba (ex.: treino de parágrafo aberto na folha).
export function marcarAba(r) {
  document.querySelectorAll('[data-r]').forEach((a) => a.classList.toggle('ativo', a.dataset.r === r));
}

async function rotear() {
  const h = location.hash.replace(/^#\/?/, '') || 'inicio';
  const [caminho, qs] = h.split('?');
  const partes = caminho.split('/').filter(Boolean);
  const r = ROTAS[partes[0]] ? partes[0] : 'inicio';
  const params = Object.fromEntries(new URLSearchParams(qs || ''));
  const ativa = PAI[r] || r;
  const naAba = ABAS.some(([x]) => x === ativa);
  document.querySelectorAll('[data-r]').forEach((a) => a.classList.toggle('ativo', a.dataset.r === ativa || (!naAba && a.dataset.r === 'mais' && a.closest('.abas-baixo'))));
  document.getElementById('hud-titulo').textContent = TITULOS[r] || '';
  if (limpar) { try { limpar(); } catch {} limpar = null; }
  const tela = document.getElementById('tela');
  tela.innerHTML = '<div class="carregando">Carregando…</div>';
  try {
    const mod = await ROTAS[r]();
    tela.innerHTML = '';
    limpar = (await mod.render(tela, partes.slice(1), params)) || null;
  } catch (e) {
    console.error(e);
    tela.innerHTML = `<div class="vazio"><p class="vazio-titulo">Algo deu errado ao abrir esta tela.</p><p>${esc(e.message)}</p><button class="btn" onclick="location.reload()">Recarregar</button></div>`;
  }
  window.scrollTo(0, 0);
  hud();
}

export function aplicarTema() {
  const t = ['escuro', 'sistema'].includes(S.perfil.tema) ? S.perfil.tema : 'claro';
  document.documentElement.dataset.tema = t;
  const escuro = t === 'escuro' || (t === 'sistema' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', escuro ? '#1C1C1C' : '#F4F1EA');
}

async function iniciar() {
  await carregar();
  aplicarTema();
  document.title = APP.nome;
  casca();
  aoMudar(hud);
  aoMudarInstalacao(hud);
  window.addEventListener('hashchange', rotear);
  rotear();
  if (new URLSearchParams(location.search).has('instalar')) {
    history.replaceState(null, '', location.pathname + location.hash);
    ofertarInstalacao();
  }
  if ('serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('sw.js').catch(() => {});
}

iniciar();
