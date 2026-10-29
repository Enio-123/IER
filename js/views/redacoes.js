// Lista de redações e início de uma nova.
import { S } from '../store.js';
import { ic } from '../icons.js';
import { esc, fmtData, vazio } from '../ui.js';
import { nova, notaFinal, situacao } from '../redacao.js';
import { escolherTema } from '../escolherTema.js';
import { PARTES } from '../dados/checklist.js';

export async function iniciarRedacao() {
  const e = await escolherTema({ tempoPadrao: S.perfil.tempoRedacao });
  if (!e) return;
  const r = nova({ tema: e.tema, limite: e.limite });
  location.hash = '#/escrever/' + r.id;
}

export const linhaRedacao = (r) => {
  const nf = notaFinal(r);
  const destino = r.fim ? '#/avaliar/' + r.id : '#/escrever/' + r.id;
  return `<li class="clicavel" onclick="location.hash='${destino}'" style="cursor:pointer">
    <div class="cresce"><div>${esc(r.tema)}</div><div class="mini">${r.tipo === 'paragrafo' ? 'Treino · ' + (PARTES[r.parte]?.rot || '') : 'Redação completa'} · ${fmtData(r.criado)} · ${situacao(r)}${r.origem ? ' · reescrita' : ''}</div></div>
    ${nf ? `<span class="num" style="font-size:20px">${nf.total}</span>` : ''}${ic('chevron-right', 18)}</li>`;
};

export function render(el) {
  const completas = S.redacoes.filter((r) => r.tipo === 'completa');
  el.innerHTML = `
    <div class="topo-pagina"><div><h1>Redações</h1><p>Folha de 30 linhas, cronômetro e correção pelas 5 competências.</p></div>
      <button class="btn primario" id="nova">${ic('plus', 16)}Nova redação</button></div>
    ${completas.length ? `<div class="cartao"><ul class="lista">${completas.map(linhaRedacao).join('')}</ul></div>`
      : vazio('Nenhuma redação ainda', 'Escolha um tema oficial do ENEM ou um tema próprio e escreva com o tempo da prova.', `<button class="btn primario" id="nova2">${ic('plus', 16)}Escrever a primeira</button>`)}`;
  el.querySelector('#nova').onclick = iniciarRedacao;
  const n2 = el.querySelector('#nova2'); if (n2) n2.onclick = iniciarRedacao;
}
