// Guia oficial: as 5 competências com os níveis do INEP, nota zero e como a correção funciona.
import { ic } from '../icons.js';
import { esc } from '../ui.js';
import { COMPETENCIAS, NIVEIS, NOTA_ZERO, CORRECAO, ELEMENTOS, FONTE_CARTILHA } from '../dados/matriz.js';

const ABAS = [...COMPETENCIAS.map((c) => ['c' + c.n, 'C' + c.n]), ['estrutura', 'Estrutura'], ['regras', 'Nota zero e correção']];

const ESTRUTURA = [
  ['Introdução', 'Apresente o tema exatamente como a frase-tema propõe, contextualize (um repertório ajuda) e deixe clara a sua tese.'],
  ['Desenvolvimento 1 e 2', 'Um argumento por parágrafo: a ideia central na primeira frase, um fundamento (repertório, dado, exemplo) e a explicação de como ele prova a tese.'],
  ['Conclusão', 'Retome o problema e apresente a proposta de intervenção com os 5 elementos, ligada ao que foi discutido.'],
];

function corpo(aba) {
  const c = COMPETENCIAS.find((x) => 'c' + x.n === aba);
  if (c) return `
    <div class="cartao grade"><div class="rot">Competência ${c.n}</div><h2 style="font-family:var(--leitura);font-size:19px;line-height:1.4">${esc(c.titulo)}</h2>
      <div><h3>O que o avaliador olha</h3><ul class="lista sub" style="margin-top:6px">${c.olhar.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></div>
      ${c.n === 5 ? `<div><h3>Os 5 elementos</h3><ul class="lista" style="margin-top:6px">${ELEMENTOS.map((e) => `<li><b style="min-width:130px">${esc(e.rot)}</b><span class="sub">${esc(e.pergunta)}</span></li>`).join('')}</ul></div>` : ''}
    </div>
    <div class="cartao secao"><h2>Níveis oficiais</h2><div class="niveis" style="margin-top:12px">${NIVEIS.map((n) => `<div class="nivel ${n === 200 ? 'topo' : ''}"><b>${n}</b><span>${esc(c.niveis[n])}</span></div>`).join('')}</div></div>`;
  if (aba === 'estrutura') return `
    <div class="cartao grade"><h2>A estrutura que a banca espera</h2>
      <p class="sub">O texto é dissertativo-argumentativo em prosa, com até 30 linhas: proposição (tese), argumentação e conclusão com proposta. A divisão mais usada é em 4 parágrafos.</p>
      <ul class="lista">${ESTRUTURA.map(([t, d]) => `<li style="align-items:flex-start"><b style="min-width:170px">${esc(t)}</b><span>${esc(d)}</span></li>`).join('')}</ul></div>
    <div class="cartao secao grade"><h2>Escrever para quem não conhece o tema</h2>
      <p>A professora Lílian Carvalho, que tirou 1000 duas vezes no ENEM, chama o método dela de "redação autoexplicativa": escrever como se o leitor não soubesse nada do tema, para que o texto se explique sozinho. Ela é contra modelos decorados e ensina introdução, desenvolvimento e conclusão como estrutura.</p>
      <p class="mini">Fonte: <a href="https://www.nsctotal.com.br/?p=7057870" target="_blank" rel="noopener">NSC Total</a>.</p></div>`;
  return `
    <div class="cartao grade"><h2>O que zera a redação</h2><ul class="lista">${NOTA_ZERO.map((z) => `<li>${esc(z)}</li>`).join('')}</ul></div>
    <div class="cartao secao grade"><h2>Como a correção funciona</h2><ul class="lista">${CORRECAO.map((z) => `<li>${esc(z)}</li>`).join('')}</ul></div>`;
}

export function render(el, _, params) {
  let aba = params.c ? 'c' + params.c : 'c1';
  const pintar = () => {
    el.innerHTML = `
      <div class="topo-pagina"><div><h1>As 5 competências</h1><p>Texto oficial da Matriz de Referência da redação do ENEM.</p></div></div>
      <div class="chips" style="margin-bottom:16px">${ABAS.map(([k, r]) => `<button class="chip ${aba === k ? 'on' : ''}" data-aba="${k}">${r}</button>`).join('')}</div>
      ${corpo(aba)}
      <p class="mini secao">Fonte: <a href="${FONTE_CARTILHA}" target="_blank" rel="noopener">A redação no Enem — Cartilha do Participante (INEP)</a>. ${ic('external-link', 12).replace('class="ic"', 'class="ic" style="display:inline"')}</p>`;
    el.querySelectorAll('[data-aba]').forEach((b) => b.onclick = () => { aba = b.dataset.aba; pintar(); });
  };
  pintar();
}
