// Tela inicial: contagem até a prova, atalhos e onde focar.
import { S, diffDias, hojeStr } from '../store.js';
import { ic } from '../icons.js';
import { esc } from '../ui.js';
import { notaFinal, completas } from '../redacao.js';
import { COMPETENCIAS } from '../dados/matriz.js';
import { iniciarRedacao, linhaRedacao } from './redacoes.js';

export function medias(n = 5) {
  const corrigidas = completas().map((r) => ({ r, nf: notaFinal(r) })).filter((x) => x.nf).slice(0, n);
  if (!corrigidas.length) return null;
  const comps = [0, 1, 2, 3, 4].map((i) => Math.round(corrigidas.reduce((s, x) => s + x.nf.comps[i], 0) / corrigidas.length));
  return { comps, total: comps.reduce((a, b) => a + b, 0), n: corrigidas.length };
}

export function render(el) {
  const p = S.perfil;
  const dias = p.dataProva ? diffDias(hojeStr(), p.dataProva) : null;
  const m = medias();
  const fraca = m ? m.comps.indexOf(Math.min(...m.comps)) : null;
  const rascunhos = S.redacoes.filter((r) => !r.fim).slice(0, 3);
  const recentes = S.redacoes.filter((r) => r.fim).slice(0, 3);
  el.innerHTML = `
    <div class="topo-pagina"><div><h1>${p.nome ? 'Oi, ' + esc(p.nome) : 'Redação do ENEM'}</h1><p>Escreva, corrija pelas 5 competências e reescreva.</p></div></div>
    <div class="grade g3">
      <div class="cartao"><div class="rot">Até a redação</div>
        <div class="contagem" style="margin-top:8px"><span class="num" style="font-size:40px">${dias !== null && dias >= 0 ? dias : '–'}</span><span class="sub">${dias === 1 ? 'dia' : 'dias'}</span></div>
        <p class="mini" style="margin-top:6px">${p.dataProva ? 'Data em Ajustes: ' + p.dataProva.split('-').reverse().join('/') : 'Defina a data em Ajustes'}</p></div>
      <div class="cartao"><div class="rot">Média recente</div>
        <div class="num" style="font-size:40px;margin-top:8px">${m ? m.total : '–'}<small> / 1000</small></div>
        <p class="mini" style="margin-top:6px">${m ? `Últimas ${m.n} redação(ões) corrigida(s)` : 'Corrija uma redação para ver'}</p></div>
      <div class="cartao"><div class="rot">Onde focar</div>
        ${m ? `<div style="margin-top:8px"><b>C${fraca + 1} · ${esc(COMPETENCIAS[fraca].curto)}</b> <span class="sub">média ${m.comps[fraca]}</span></div>
          <p class="mini" style="margin-top:6px">${fraca === 4 ? '<a href="#/proposta">Treine a proposta</a>' : `<a href="#/competencias?c=${fraca + 1}">Veja o que a banca olha</a>`}</p>`
        : '<p class="sub" style="margin-top:8px">Aparece depois da primeira correção.</p>'}</div>
    </div>
    <div class="grade g3 secao">
      <button class="cartao clicavel grade" id="nova" style="gap:6px;align-content:start">${ic('pencil')}<h2>Redação completa</h2><p class="sub">Tema oficial, folha de 30 linhas e ${p.tempoRedacao} min.</p></button>
      <a class="cartao clicavel grade" href="#/treino" style="gap:6px;text-decoration:none;align-content:start">${ic('file-text')}<h2>Treino de parágrafo</h2><p class="sub">Só introdução, desenvolvimento ou conclusão.</p></a>
      <a class="cartao clicavel grade" href="#/proposta" style="gap:6px;text-decoration:none;align-content:start">${ic('target')}<h2>Montar proposta</h2><p class="sub">Os 5 elementos da Competência 5.</p></a>
    </div>
    ${rascunhos.length ? `<div class="secao"><h2>Continuar escrevendo</h2><div class="cartao"><ul class="lista">${rascunhos.map(linhaRedacao).join('')}</ul></div></div>` : ''}
    ${recentes.length ? `<div class="secao"><h2>Últimos textos</h2><div class="cartao"><ul class="lista">${recentes.map(linhaRedacao).join('')}</ul></div></div>` : ''}`;
  el.querySelector('#nova').onclick = iniciarRedacao;
}
