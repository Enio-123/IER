// Evolução das notas por competência.
import { S } from '../store.js';
import { esc, colunas, barra, vazio, fmtData } from '../ui.js';
import { notaFinal, completas } from '../redacao.js';
import { COMPETENCIAS } from '../dados/matriz.js';
import { medias } from './inicio.js';

export function render(el) {
  const corr = completas().map((r) => ({ r, nf: notaFinal(r) })).filter((x) => x.nf).reverse();
  const m = medias();
  const min = Object.values(S.dias).reduce((s, d) => s + (d.min || 0), 0);
  const treinos = S.redacoes.filter((r) => r.tipo === 'paragrafo' && r.fim).length;
  el.innerHTML = `
    <div class="topo-pagina"><div><h1>Progresso</h1><p>Notas finais de cada redação corrigida, da mais antiga para a mais nova.</p></div></div>
    <div class="grade g4">
      <div class="cartao"><div class="rot">Redações</div><div class="num">${completas().filter((r) => r.fim).length}</div></div>
      <div class="cartao"><div class="rot">Treinos</div><div class="num">${treinos}</div></div>
      <div class="cartao"><div class="rot">Propostas</div><div class="num">${S.propostas.length}</div></div>
      <div class="cartao"><div class="rot">Minutos escrevendo</div><div class="num">${min}</div></div>
    </div>
    ${corr.length ? `
      <div class="cartao secao"><h2>Nota total</h2><div style="margin-top:12px">${colunas(corr.slice(-12).map((x) => ({ rot: fmtData(x.r.criado).slice(0, 5), v: x.nf.total })), { max: 1000 })}</div></div>
      <div class="cartao secao"><h2>Média por competência</h2><p class="sub" style="margin-top:4px">Últimas ${m.n} corrigida(s).</p>
        <div style="margin-top:12px">${COMPETENCIAS.map((c, i) => `<div class="comp-linha"><div><b>C${c.n}</b> <span class="sub">${esc(c.curto)}</span></div>
          <div class="entre">${barra(m.comps[i], 200)}<b style="min-width:36px;text-align:right">${m.comps[i]}</b></div></div>`).join('')}</div></div>`
    : `<div class="secao">${vazio('Sem notas ainda', 'Quando uma redação tiver nota (sua, da IA ou de um professor), a evolução aparece aqui.', '<a class="btn primario" href="#/redacoes">Ir para redações</a>')}</div>`}`;
  el.querySelectorAll('.comp-linha .barra').forEach((b) => b.style.flex = '1');
}
