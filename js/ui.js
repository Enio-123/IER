// Utilidades de interface: escape, avisos, janelas e gráficos.
import { ic } from './icons.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// Texto com quebras de parágrafo, escapado.
export const paragrafos = (txt) => String(txt ?? '').split(/\n+/).map((p) => p.trim()).filter(Boolean).map((p) => `<p>${esc(p)}</p>`).join('');

export function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = msg;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('on'));
  setTimeout(() => { el.classList.remove('on'); setTimeout(() => el.remove(), 300); }, 2400);
}

// Janela simples. corpo: HTML. Retorna o elemento e uma função para fechar.
export function janela(titulo, corpo, { largo = false, aoFechar = null } = {}) {
  const fundo = document.createElement('div');
  fundo.className = 'modal-fundo';
  fundo.innerHTML = `<div class="modal ${largo ? 'largo' : ''}" role="dialog" aria-modal="true" aria-label="${esc(titulo)}">
    <header class="modal-topo"><h2>${esc(titulo)}</h2><button class="btn-icone" data-fechar aria-label="Fechar">${ic('x')}</button></header>
    <div class="modal-corpo">${corpo}</div></div>`;
  const fechar = () => { fundo.remove(); document.removeEventListener('keydown', tecla); aoFechar && aoFechar(); };
  const tecla = (e) => { if (e.key === 'Escape') fechar(); };
  fundo.addEventListener('click', (e) => { if (e.target === fundo || e.target.closest('[data-fechar]')) fechar(); });
  document.addEventListener('keydown', tecla);
  document.body.appendChild(fundo);
  const primeiro = fundo.querySelector('input, textarea, select, button:not([data-fechar])');
  primeiro && primeiro.focus();
  return { el: fundo.querySelector('.modal'), fechar };
}

export function confirmar(msg, rotulo = 'Confirmar') {
  return new Promise((res) => {
    const { el, fechar } = janela('Confirmar', `<p>${esc(msg)}</p><div class="linha-acoes"><button class="btn" data-fechar>Cancelar</button><button class="btn primario" data-ok>${esc(rotulo)}</button></div>`, { aoFechar: () => res(false) });
    el.querySelector('[data-ok]').onclick = () => { res(true); fechar(); };
  });
}

export async function copiar(txt) {
  try { await navigator.clipboard.writeText(txt); return true; } catch {
    const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch {} t.remove(); return ok;
  }
}

export const fmtData = (ms) => new Date(ms).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
export const fmtTempo = (s) => {
  s = Math.max(0, Math.round(s));
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0');
};

export const barra = (v, max = 100) => `<span class="barra" aria-hidden="true"><span style="width:${Math.max(0, Math.min(100, (v / (max || 1)) * 100))}%"></span></span>`;

// Gráfico de colunas em SVG. dados: [{rot, v}]
export function colunas(dados, { altura = 140, max = null } = {}) {
  const topo = max ?? Math.max(1, ...dados.map((d) => d.v));
  const n = dados.length, larg = 100 / n;
  const barras = dados.map((d, i) => {
    const h = (d.v / topo) * (altura - 40);
    return `<g><rect x="${i * larg + larg * 0.2}%" y="${altura - 18 - h}" width="${larg * 0.6}%" height="${h}" class="col"><title>${esc(d.rot)}: ${d.v}</title></rect>
      <text x="${i * larg + larg / 2}%" y="${altura - 4}" text-anchor="middle" class="eixo">${esc(d.rot)}</text>
      <text x="${i * larg + larg / 2}%" y="${altura - 22 - h}" text-anchor="middle" class="valor">${d.v}</text></g>`;
  }).join('');
  return `<svg class="grafico" width="100%" height="${altura}" role="img">${barras}</svg>`;
}

export const vazio = (titulo, texto, acao = '') => `<div class="vazio"><p class="vazio-titulo">${esc(titulo)}</p><p>${esc(texto)}</p>${acao}</div>`;

// Cronômetro regressivo que continua certo mesmo com a aba em segundo plano.
export function cronometro({ segundos, aoTique, aoAcabar }) {
  let restante = segundos, inicio = null, id = null;
  const tique = () => {
    const r = Math.max(0, restante - (Date.now() - inicio) / 1000);
    aoTique(r);
    if (r <= 0) { parar(); aoAcabar && aoAcabar(); }
  };
  const iniciar = () => { if (id) return; inicio = Date.now(); id = setInterval(tique, 500); tique(); };
  const parar = () => { if (!id) return; restante = Math.max(0, restante - (Date.now() - inicio) / 1000); clearInterval(id); id = null; };
  return { iniciar, parar, rodando: () => !!id, restante: () => (id ? Math.max(0, restante - (Date.now() - inicio) / 1000) : restante) };
}
