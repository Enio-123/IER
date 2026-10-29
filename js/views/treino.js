// Treino de parágrafo: só introdução, desenvolvimento ou conclusão, com tempo curto.
import { S } from '../store.js';
import { ic } from '../icons.js';
import { esc, vazio } from '../ui.js';
import { nova } from '../redacao.js';
import { escolherTema } from '../escolherTema.js';
import { PARTES, CHECKLIST } from '../dados/checklist.js';
import { linhaRedacao } from './redacoes.js';

const DICA = {
  introducao: 'Apresente o tema com as palavras da frase-tema, traga um repertório ligado a ele e termine com a tese.',
  desenvolvimento: 'Abra com a ideia central, fundamente com repertório ou dado, explique e amarre de volta na tese.',
  conclusao: 'Retome o problema e feche com a proposta completa: ação, agente, modo/meio, efeito e detalhamento.',
};

export function render(el) {
  const treinos = S.redacoes.filter((r) => r.tipo === 'paragrafo');
  el.innerHTML = `
    <div class="topo-pagina"><div><h1>Treino de parágrafo</h1><p>Uma parte por vez, em ${S.perfil.tempoParagrafo} minutos. Bom para os dias corridos.</p></div></div>
    <div class="grade g3">${Object.entries(PARTES).map(([k, p]) => `
      <button class="cartao clicavel grade" data-parte="${k}" style="gap:8px">
        <h2>${esc(p.rot)}</h2><p class="sub">${esc(DICA[k])}</p>
        <p class="mini">${CHECKLIST[p.blocos[0]].itens.length} itens no checklist</p>
        <span class="btn peq" style="justify-self:start">${ic('play', 14)}Treinar</span>
      </button>`).join('')}</div>
    <div class="secao"><h2>Seus treinos</h2>
      ${treinos.length ? `<div class="cartao"><ul class="lista">${treinos.map(linhaRedacao).join('')}</ul></div>` : vazio('Nenhum treino ainda', 'Escolha uma parte acima para começar.')}
    </div>`;
  el.querySelectorAll('[data-parte]').forEach((b) => b.onclick = async () => {
    const parte = b.dataset.parte;
    const e = await escolherTema({ titulo: 'Treino de ' + PARTES[parte].rot.toLowerCase(), tempos: [0, 5, 10, 15, 20], tempoPadrao: S.perfil.tempoParagrafo });
    if (!e) return;
    const r = nova({ tipo: 'paragrafo', parte, tema: e.tema, limite: e.limite });
    location.hash = '#/escrever/' + r.id;
  });
}
